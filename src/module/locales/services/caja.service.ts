import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { VentasService } from 'src/module/ventas/services/ventas.service';
import { CreateCajaDto } from '../dtos/caja.dto';
import { Caja } from '../entities/caja.entity';
import { Locales } from '../entities/locales.entity';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { tipoVenta } from 'src/module/ventas/dtos/ventas.dto';
import { sumaArrayObj } from 'src/assets/functions/sumaArrayObj';


@Injectable()
export class CajaService {

    constructor(
        @InjectRepository(Caja) private cajaRepo:Repository<Caja>,
        @InjectRepository(Locales) private localesRepo:Repository<Locales>,
        @Inject(forwardRef(() => VentasService))
        private ventasService:VentasService
    ){}


    async paginateFilter(
        idLocal:string = "_", 
        // inicio:string, 
        // fin:string, 
        options: IPaginationOptions
    ): Promise<Pagination<Caja>> {

        const where:any = {};

        if (idLocal != "_") {
            where.locales = idLocal;
        }

        // if (inicio !== "_" || fin !== "_" ) {
        //     where.created_at = Between(inicio, fin);
        // }

        return paginate<Caja>(this.cajaRepo, options, {
            relations: ["cajaDetalles"],
            order: { created_at: "DESC" },
            where
        });

        // if (idLocal != "_") { // si where no tiene nada, añadir condicion aqui
        //     return paginate<Caja>(this.cajaRepo, options, {
        //         relations: ["cajaDetalles"],
        //         order: { updated_at: "DESC" },
        //         where
        //     });
        // } else {
        //     return paginate<Caja>(this.cajaRepo, options, {
        //         relations: ["cajaDetalles"],
        //         order: { id: "DESC" }
        //     });
        // }
    }


    async getOne(id:number){
        const data = await this.cajaRepo.findOne(id, {
            relations: ["usuarioAbre", "usuarioCierra", "locales", "cajaDetalles", "cajaDetalles.usuario"]
        });

        return {
            success: "Registro encontrado",
            data
        }
    }


    async abrirCaja(payload:CreateCajaDto){
        const estadoCaja:any = await this.verificarCajaAbierta(payload.localId);

        if (estadoCaja.data) {
            return{
                Error: "caja abierta"
            }
        } else {        
            
            const caja:any = this.cajaRepo.create(payload);
            caja.locales = payload.localId;
            caja.usuarioAbre = payload.usuarioAbreId;
        
            const data = await this.cajaRepo.save(caja);

            await this.registrarIdCasaLocal(data.id, payload.localId); // registrar id en caja

            return{
                exito: "Registro creado",
                data
            }
        }
    }


    async verificarCajaAbierta(idLocal:number){
        const cajasAbiertas = await this.cajaRepo.find({
            relations: ["locales"],
            where: { 
                locales: {
                    id: idLocal,
                    tipo_local: "tienda"
                }, 
                estado_caja: true
            }
        });
        
        if (cajasAbiertas.length > 0) {
            return { data: true };
        } else {
            return { data: false };
        }   
    }


    async cerrarCaja(id:number, payload:any){ // id, es el id de la caja que vamos a cerrar
        const caja:any = await this.cajaIngresos(id);

        caja.locales = payload.localId // requiere tambien el id del local
        caja.usuarioCierra = payload.usuarioCierraId
        caja.codigo_venta_caja = 0;

        this.cajaRepo.merge(caja, payload);

        await this.cajaRepo.save(caja);
        await this.registrarIdCasaLocal(0, payload.localId);

        // elimina todos los elementos rechazados y enviados
        await this.ventasService.eliminarEnviadosRechazados(payload.localId);

        return {
            payload
        }
    }


    async registrarIdCasaLocal(idCaja:number, idLocal:number){
        const local:any = await this.localesRepo.findOne(idLocal); // buscar local
        local.caja_actual = idCaja; // añadir id a local antes de guardar
        await this.localesRepo.update(idLocal, local); // guardar id de caja en local
    }


    async localCajaIngresos(idLocal:number){ // *****
        const local:any = await this.localesRepo.findOne(idLocal);
        let caja:any = {};
        if (local.caja_actual !== 0) {
            caja = await this.cajaIngresos(local.caja_actual);    
        }
                
        return {
            success: "Ok",
            data: { local, caja }
        }
    }


    async cajaIngresos(caja_actual:number){
        const caja:any = await this.cajaRepo.findOne(caja_actual, {
            relations: ["cajaDetalles", "cajaDetalles.usuario"]
        });

        let montoEfectivo:number = 0;
        let montoTarjeta:number = 0;
        let montoPagoElectronico:number = 0;
        let montoDeposito:number = 0;
        let otrosMovimientos:number = 0;

        if (!!caja) {
            const ventas:any = await this.ventasService.ventasCaja(caja.id);
            ventas.forEach((e:any) => {
                if (e.formasPago.length > 0) {
                    e.formasPago.forEach(async (e:any) => {
                        if (e.forma_pago === "efectivo") {
                            montoEfectivo = Number(montoEfectivo) + Number(e.precio_parcial);
                        } else if (e.forma_pago === "tarjeta") {
                            montoTarjeta = Number(montoTarjeta) + Number(e.precio_parcial);
                        } else if (e.forma_pago === "pago_electronico") {
                            montoPagoElectronico = Number(montoPagoElectronico) + Number(e.precio_parcial);
                        } else if (e.forma_pago === "deposito") {
                            montoDeposito = Number(montoDeposito) + Number(e.precio_parcial);
                        }
                    })
                } else {
                    if (e.forma_pago === "efectivo") {
                        montoEfectivo = Number(montoEfectivo) + Number(e.total);
                    } else if (e.forma_pago === "tarjeta") {
                        montoTarjeta = Number(montoTarjeta) + Number(e.total);
                    } else if (e.forma_pago === "pago_electronico") {
                        montoPagoElectronico = Number(montoPagoElectronico) + Number(e.total);
                    } else if (e.forma_pago === "deposito") {
                        montoDeposito = Number(montoDeposito) + Number(e.total);
                    }
                }
            });
            caja.cajaDetalles.forEach((e:any) => { 
                if (e.forma_pago === "efectivo") {
                    otrosMovimientos = Number(otrosMovimientos) + Number(e.monto_movimiento)
                } else if (e.forma_pago === "tarjeta") {
                    montoTarjeta = Number(montoTarjeta) + Number(e.monto_movimiento)
                } else if (e.forma_pago === "pago_electronico") {
                    montoPagoElectronico = Number(montoPagoElectronico) + Number(e.monto_movimiento)
                } else if (e.forma_pago === "deposito") {
                    montoDeposito = Number(montoDeposito) + Number(e.monto_movimiento)
                }
            })
        }

        caja.monto_efectivo = montoEfectivo;
        caja.monto_tarjeta = montoTarjeta;
        caja.monto_pago_electronico = montoPagoElectronico;
        caja.monto_deposito = montoDeposito;
        caja.otros_montos = otrosMovimientos;

        return caja;
    }


    // // ** obliterado **
    // async incrementoCajaNo(caja:any, formasPago:any, creditoDetalles:any, venta:any){ // requiere creditoDetalles

    //     let anadirCajaTotal:number = 0;
    //     const esCredito:boolean = (
    //         !!creditoDetalles &&
    //         ( venta.tipo_venta === tipoVenta.credito || venta.tipo_venta === tipoVenta.adelanto )
    //     );
        
    //     if (esCredito) {
    //         anadirCajaTotal = sumaArrayObj(creditoDetalles, "cantidad_pagada");
    //     } else {
    //         anadirCajaTotal = venta.total;
    //     }

    //     if (formasPago.length > 0) {
    //         formasPago.forEach(async (e:any) => { 
    //             if (e.forma_pago === "efectivo") {
    //                 caja.monto_efectivo = Number(caja.monto_efectivo) + Number(e.precio_parcial);
    //             } else if (e.forma_pago === "tarjeta") {
    //                 caja.monto_tarjeta = Number(caja.monto_tarjeta) + Number(e.precio_parcial);
    //             } else if (e.forma_pago === "pago_electronico") {
    //                 caja.monto_pago_electronico = Number(caja.monto_pago_electronico) + Number(e.precio_parcial);
    //             } else if (e.forma_pago === "deposito") {
    //                 caja.monto_deposito = Number(caja.monto_deposito) + Number(e.precio_parcial);
    //             }
    //         })
    //     } else {
    //         if (venta.forma_pago === "efectivo") {
    //             caja.monto_efectivo = Number(caja.monto_efectivo) + Number(anadirCajaTotal);
    //         } else if (venta.forma_pago === "tarjeta") {
    //             caja.monto_tarjeta = Number(caja.monto_tarjeta) + Number(anadirCajaTotal);
    //         } else if (venta.forma_pago === "pago_electronico") {
    //             caja.monto_pago_electronico = Number(caja.monto_pago_electronico) + Number(anadirCajaTotal);
    //         } else if (venta.forma_pago === "deposito") {
    //             caja.monto_deposito = Number(caja.monto_deposito) + Number(anadirCajaTotal);
    //         }
    //     }

    //     await this.cajaRepo.save(caja);

    // }
    
    
    // // ** obliterado **
    // async descuentoCajaNo(caja:any, formasPago:any, creditoDetalles:any, venta:any){ // requiere creditoDetalles

    //     let anadirCajaTotal:number = 0;
    //     const esCredito:boolean = (
    //         !!creditoDetalles &&
    //         ( venta.tipo_venta === tipoVenta.credito || venta.tipo_venta === tipoVenta.adelanto )
    //     );
        
    //     if (esCredito) {
    //         anadirCajaTotal = sumaArrayObj(creditoDetalles, "cantidad_pagada");
    //     } else {
    //         anadirCajaTotal = venta.total;
    //     }   

    //     if (formasPago.length > 0) {
    //         formasPago.forEach(async (e:any) => { 
    //             if (e.forma_pago === "efectivo") {
    //                 caja.monto_efectivo = Number(caja.monto_efectivo) - Number(e.precio_parcial);
    //             } else if (e.forma_pago === "tarjeta") {
    //                 caja.monto_tarjeta = Number(caja.monto_tarjeta) - Number(e.precio_parcial);
    //             } else if (e.forma_pago === "pago_electronico") {
    //                 caja.monto_pago_electronico = Number(caja.monto_pago_electronico) - Number(e.precio_parcial);
    //             } else if (e.forma_pago === "deposito") {
    //                 caja.monto_deposito = Number(caja.monto_deposito) - Number(e.precio_parcial);
    //             }
    //         })
    //     } else {
    //         if (venta.forma_pago === "efectivo") {
    //             caja.monto_efectivo = Number(caja.monto_efectivo) - Number(venta.total);
    //         } else if (venta.forma_pago === "tarjeta") {
    //             caja.monto_tarjeta = Number(caja.monto_tarjeta) - Number(venta.total);
    //         } else if (venta.forma_pago === "pago_electronico") {
    //             caja.monto_pago_electronico = Number(caja.monto_pago_electronico) - Number(venta.total);
    //         } else if (venta.forma_pago === "deposito") {
    //             caja.monto_deposito = Number(caja.monto_deposito) - Number(venta.total);
    //         }
    //     }

    //     await this.cajaRepo.save(caja);
    // }



}

// async getAll(){
//     const data = await this.cajaRepo.find({
//         relations: ["locales"]
//     });
//     return {
//         success: "Lista registros encontrados",
//         data
//     }
// }



// async put(id:number, payload:any){

// }

// async delete(id:number){
    
// }


// if (payload.usuarioId) {
//     const usuario = await this.usuarioRepo.findOne(payload.usuarioId)
//     producto.usuarios = usuario
// }

// if (payload.categoriasId) {
//     const categoria = await this.categoriasRepo.findOne(payload.categoriasId)
//     producto.categorias = categoria
// }

// if (payload.precioVentaId) {
//     const precioVenta = await this.precioVentasRepo.findOne(payload.precioVentaId)
//     producto.precioVenta = precioVenta
// }

// const data:Productos = await this.productosRepo.save(producto)
