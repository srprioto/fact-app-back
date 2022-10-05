import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm'
import { VentasService } from 'src/module/ventas/services/ventas.service';
import { CreateCajaDto } from '../dtos/caja.dto';
import { Caja } from '../entities/caja.entity';
import { Locales } from '../entities/locales.entity';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

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
            order: { updated_at: "DESC" },
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
            return {
                data: true
            };
        } else {
            return {
                data: false
            };
        }   
    }


    async cerrarCaja(id:number, payload:any){ // id, es el id de la caja que vamos a cerrar
        
        const caja:any = await this.cajaRepo.findOne(id, {
            where: {
                locales: payload.localId
            }
        });

        caja.locales = payload.localId // requiere tambien el id del local
        caja.usuarioCierra = payload.usuarioCierraId
        caja.codigo_venta_caja = 0;

        this.cajaRepo.merge(caja, payload);

        const data = await this.cajaRepo.save(caja);
        await this.registrarIdCasaLocal(0, payload.localId);

        // añadir aqui eliminar todos los elementos que rechazados y enviados
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


    async localCajaIngresos(idLocal:number){
        const local:any = await this.localesRepo.findOne(idLocal);

        const caja:any = await this.cajaRepo.findOne(local.caja_actual, {
            relations: ["cajaDetalles", "cajaDetalles.usuario"]
        });

        // let ingresosDiarios:any;

        // if (caja) {
        //     ingresosDiarios = await this.ventasService.ingresosDiariosAperturaCaja(idLocal, caja.created_at);
        // } else {
        //     ingresosDiarios = await this.ventasService.ingresosDiariosLocal(idLocal);
        // }

        // ingresosDiarios = await this.ventasService.ingresosDiariosLocal(idLocal);

        return {
            success: "Ok",
            data: {
                local, 
                caja,
                // totalIngresos: ingresosDiarios.data.totalDineroDia
            }
        }
        
    }


    async incrementoCaja(caja:any, formasPago:any, venta:any){

        if (formasPago.length > 0) {
            formasPago.forEach(async (e:any) => { 
                if (e.forma_pago === "efectivo") {
                    caja.monto_efectivo = Number(caja.monto_efectivo) + Number(e.precio_parcial);
                } else if (e.forma_pago === "tarjeta") {
                    caja.monto_tarjeta = Number(caja.monto_tarjeta) + Number(e.precio_parcial);
                } else if (e.forma_pago === "pago_electronico") {
                    caja.monto_pago_electronico = Number(caja.monto_pago_electronico) + Number(e.precio_parcial);
                } else if (e.forma_pago === "deposito") {
                    caja.monto_deposito = Number(caja.monto_deposito) + Number(e.precio_parcial);
                }
            })
        } else {
            if (venta.forma_pago === "efectivo") {
                caja.monto_efectivo = Number(caja.monto_efectivo) + Number(venta.total);
            } else if (venta.forma_pago === "tarjeta") {
                caja.monto_tarjeta = Number(caja.monto_tarjeta) + Number(venta.total);
            } else if (venta.forma_pago === "pago_electronico") {
                caja.monto_pago_electronico = Number(caja.monto_pago_electronico) + Number(venta.total);
            } else if (venta.forma_pago === "deposito") {
                caja.monto_deposito = Number(caja.monto_deposito) + Number(venta.total);
            }
        }

        await this.cajaRepo.save(caja);

    }

    
    async descuentoCaja(caja:any, formasPago:any, venta:any){
        if (formasPago.length > 0) {
            formasPago.forEach(async (e:any) => { 
                if (e.forma_pago === "efectivo") {
                    caja.monto_efectivo = Number(caja.monto_efectivo) - Number(e.precio_parcial);
                } else if (e.forma_pago === "tarjeta") {
                    caja.monto_tarjeta = Number(caja.monto_tarjeta) - Number(e.precio_parcial);
                } else if (e.forma_pago === "pago_electronico") {
                    caja.monto_pago_electronico = Number(caja.monto_pago_electronico) - Number(e.precio_parcial);
                } else if (e.forma_pago === "deposito") {
                    caja.monto_deposito = Number(caja.monto_deposito) - Number(e.precio_parcial);
                }
            })
        } else {
            if (venta.forma_pago === "efectivo") {
                caja.monto_efectivo = Number(caja.monto_efectivo) - Number(venta.total);
            } else if (venta.forma_pago === "tarjeta") {
                caja.monto_tarjeta = Number(caja.monto_tarjeta) - Number(venta.total);
            } else if (venta.forma_pago === "pago_electronico") {
                caja.monto_pago_electronico = Number(caja.monto_pago_electronico) - Number(venta.total);
            } else if (venta.forma_pago === "deposito") {
                caja.monto_deposito = Number(caja.monto_deposito) - Number(venta.total);
            }
        }

        await this.cajaRepo.save(caja);
    }
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