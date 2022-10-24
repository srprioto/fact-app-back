import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Caja } from 'src/module/locales/entities/caja.entity';
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
        private cajaService:CajaService,
        private formasPagoService:FormasPagoService,

    ){}

    async anadirCreditoDetalles(payload:any){

        // aqui modificar estado de producto - por codicion
        if (payload.mod_estado_prod) {
            const venta:any = {};
            venta.id = payload.ventas;
            venta.estado_producto = payload.estado_producto
            venta.tipo_venta = payload.estado_producto ? tipoVenta.credito : tipoVenta.adelanto;
            await this.ventasRepo.save(venta);
        }

        // gestion de cantidades
        if (payload.cantidad_pagada > 0) {
            // añade detalles credito adelanto
            await this.crearCreditoAdelanto(payload);
            
            // aqui añadimos ingreso a caja - condicionada por forma de pago
            const venta:any = await this.ventasRepo.findOne(payload.ventas);
            venta.forma_pago = payload.forma_pago
            const caja:any = await this.cajaRepo.findOne({
                where: {
                    locales: { id: payload.localId, tipo_local: "tienda" },
                    estado_caja: true
                }
            })
            const creditoDetalles:any = [{ cantidad_pagada: payload.cantidad_pagada }]
            await this.cajaService.incrementoCaja(caja, [], creditoDetalles, venta);

            // añade forma de pago de la venta, no de la caja
            const formasPago:Array<any> = [{
                forma_pago: payload.forma_pago, 
                precio_parcial: payload.cantidad_pagada 
            }];
            if (formasPago.length > 0) {
                formasPago.forEach(async (e:any) => { 
                    e.venta = venta.id
                    await this.formasPagoService.create(e);
                })
            }
        }

        return payload;
    }


    async crearCreditoAdelanto(payload:any){
        payload.fecha_estimada = new Date(payload.fecha_estimada);
        const creditoDetalles:any = this.creditoDetallesRepo.create(payload);
        const resto:any = await this.creditoDetallesRepo.save(creditoDetalles);
        return resto;
    }
    
}
