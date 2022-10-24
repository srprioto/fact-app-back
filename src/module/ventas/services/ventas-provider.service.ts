import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CajaService } from 'src/module/locales/services/caja.service';
import { Ventas } from '../entities/ventas.entity';
import { Caja } from 'src/module/locales/entities/caja.entity';
import { CajaDetallesService } from 'src/module/locales/services/caja-detalles.service';
import { tipoVenta } from '../dtos/ventas.dto';
import { sumaArrayObj } from 'src/assets/functions/sumaArrayObj';

@Injectable()
export class VentasProviderService {

    constructor(
        @InjectRepository(Ventas) private ventasRepo:Repository<Ventas>,
        @InjectRepository(Caja) private cajaRepo:Repository<Caja>,
        private cajaService:CajaService,
        private cajaDetallesService:CajaDetallesService,
    ){ }

    async anulacionVenta(idVenta:number, notaBaja:string, usuarioId:number, afectarCaja:boolean){

        // actualizar y anular venta
        const venta:any = await this.ventasRepo.findOne(idVenta, { relations: ["locales", "formasPago", "creditoDetalles"] });
        let montoMovimiento:number = 0;

        if (venta.tipo_venta === tipoVenta.credito || venta.tipo_venta === tipoVenta.adelanto) {
            montoMovimiento = sumaArrayObj(venta.creditoDetalles, "cantidad_pagada");;
        } else {
            montoMovimiento = venta.total;
        }

        venta.estado_venta = "anulado";
        venta.observaciones = notaBaja;
        const newVenta:any = this.ventasRepo.create(venta);
        await this.ventasRepo.save(newVenta);

        if (afectarCaja) {
            // quitar cantidad de caja
            const locales:any = venta.locales;
            let caja:any = await this.cajaRepo.findOne({
                where: {
                    locales: { id: locales.id, tipo_local: "tienda" },
                    estado_caja: true
                }
            })

            await this.cajaService.descuentoCaja(caja, venta.formasPago, venta.creditoDetalles, venta);

            await this.cajaDetallesService.registrarAnulacionCajaDet({
                monto_movimiento: Number("-" + montoMovimiento),
                descripcion: "anulacion@" + notaBaja,
                cajaId: caja.id,
                usuarioId: usuarioId
            });

            return {
                success: "Venta anulada correctamente"
            }
        } else {
            return {
                success: "Venta anulada correctamente"
            }
        }
    }
}
