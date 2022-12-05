import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { tipoMovimiento } from 'src/module/locales/dtos/caja-detalles.dto';
import { CajaDetalles } from 'src/module/locales/entities/caja-detalles.entity';
import { Caja } from 'src/module/locales/entities/caja.entity';
import { CajaDetallesService } from 'src/module/locales/services/caja-detalles.service';
import { CajaService } from 'src/module/locales/services/caja.service';
import { Repository } from 'typeorm';
import { tipoVenta } from '../dtos/ventas.dto';
import { CreditoDetalles } from '../entities/credito_detalles.entity';
import { Ventas } from '../entities/ventas.entity';
import { FormasPagoService } from './formas-pago.service';

@Injectable()
export class CreditoDetallesService {
    
    constructor(
        @InjectRepository(CreditoDetalles) private creditoDetallesRepo:Repository<CreditoDetalles>,
        @InjectRepository(Ventas) private ventasRepo:Repository<Ventas>,
        @InjectRepository(Caja) private cajaRepo:Repository<Caja>,
        // @InjectRepository(CajaDetalles) private cajaDetallesService:Repository<CajaDetalles>,
        // private cajaService:CajaService,
        private formasPagoService:FormasPagoService,
        private cajaDetallesService:CajaDetallesService,

    ){}

    async anadirCreditoDetalles(payload:any){

        // modificacion de estado de producto(entregado o no) - por codicion
        if (payload.mod_estado_prod) {
            const venta:any = {};
            venta.id = payload.ventas;
            venta.estado_producto = payload.estado_producto
            venta.tipo_venta = payload.estado_producto ? tipoVenta.credito : tipoVenta.adelanto;
            await this.ventasRepo.save(venta);
        }

        // gestion de montos pagados
        if (payload.cantidad_pagada > 0) {
            // añade detalles credito adelanto
            await this.crearCreditoAdelanto(payload);

            // añade forma de pago de la venta, no de la caja
            const formasPago:Array<any> = [{
                forma_pago: payload.forma_pago, 
                precio_parcial: payload.cantidad_pagada 
            }];
            if (formasPago.length > 0) {
                formasPago.forEach(async (e:any) => { 
                    e.venta = payload.ventas
                    await this.formasPagoService.create(e);
                })
            }
        }

        return payload;
    }


    async crearCreditoAdelanto(payload:any){

        const ventaActual:any = await this.ventasRepo.findOne(payload.ventas, {
            relations: ["caja", "usuarios", "locales"]
        });

        const cajaActual:any = await this.cajaRepo.findOne({
            where: {
                locales: { id: ventaActual.locales.id, tipo_local: "tienda" },
                estado_caja: true
            }
        })

        payload.fecha_estimada = new Date(payload.fecha_estimada);
        const creditoDetalles:any = this.creditoDetallesRepo.create(payload);
        const resto:any = await this.creditoDetallesRepo.save(creditoDetalles);
        const notaCredito:string = payload.nota ? payload.nota : "Pago de credito"

        const idCajaVenta:number = ventaActual.caja ? ventaActual.caja.id : 0;
        const idCajaActual:number = cajaActual ? cajaActual.id : 0;

        if (idCajaActual !== idCajaVenta) {            
            await this.cajaDetallesService.post({
                monto_movimiento: payload.cantidad_pagada,
                descripcion: `Cod: ${ventaActual.id} - ${notaCredito}`,
                tipo_movimiento: tipoMovimiento.credito,
                forma_pago: payload.forma_pago,
                cajaId: idCajaActual,
                usuarioId: ventaActual.usuarios.id // cambiar en caso de que se requiera
            });
        }

        return resto;

    }
    
}
            
// // aqui añadimos ingreso a caja - condicionada por forma de pago
// // anulamos desde aqui
// const venta:any = await this.ventasRepo.findOne(payload.ventas);
// venta.forma_pago = payload.forma_pago
// const caja:any = await this.cajaRepo.findOne({
//     where: {
//         locales: { id: payload.localId, tipo_local: "tienda" },
//         estado_caja: true
//     }
// })
// const creditoDetalles:any = [{ cantidad_pagada: payload.cantidad_pagada }]
// await this.cajaService.incrementoCaja(caja, [], creditoDetalles, venta);
// // hasta anulamos desde aqui