import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { CajaService } from 'src/module/locales/services/caja.service';
import { Ventas } from '../entities/ventas.entity';
// import { Caja } from 'src/module/locales/entities/caja.entity';
// import { CajaDetallesService } from 'src/module/locales/services/caja-detalles.service';
import { tipoVenta } from '../dtos/ventas.dto';
import { sumaArrayObj } from 'src/assets/functions/sumaArrayObj';
import { CajaDetallesService } from 'src/module/locales/services/caja-detalles.service';
import { tipoMovimiento } from 'src/module/locales/dtos/caja-detalles.dto';
import { tiposIngresos } from '../dtos/ingresos-ventas.dto';
import { IngresosVentas } from '../entities/ingresos-ventas.entity';

@Injectable()
export class VentasProviderService {

    constructor(
        @InjectRepository(Ventas) private ventasRepo:Repository<Ventas>,
        @InjectRepository(IngresosVentas) private ingresosVentasRepo:Repository<IngresosVentas>,
        private cajaDetallesService:CajaDetallesService,
        // @InjectRepository(Caja) private cajaRepo:Repository<Caja>,
        // private cajaService:CajaService,
    ){ }

    async anulacionVenta(idVenta:number, notaBaja:string, usuarioId:number, idCajaActual:number){

        // actualizar y anular venta
        const venta:any = await this.ventasRepo.findOne(idVenta, { relations: ["locales", "formasPago", "creditoDetalles", "caja", "ingresosVentas"] });
        const idCajaVenta:number = venta.caja ? venta.caja.id : 0;

        if (idCajaActual !== idCajaVenta) { // verifica que sea una anulacion pasada

            let montoMovimiento:number = 0;
            if (venta.tipo_venta === tipoVenta.credito || venta.tipo_venta === tipoVenta.adelanto) {
                montoMovimiento = sumaArrayObj(venta.creditoDetalles, "cantidad_pagada");
            } else {
                montoMovimiento = venta.total;
            }

            await this.cajaDetallesService.post({
                monto_movimiento: Number("-" + montoMovimiento),
                descripcion: `Cod: ${venta.id} - ${notaBaja}`,
                tipo_movimiento: tipoMovimiento.anulacion2,
                forma_pago: "efectivo",
                cajaId: idCajaActual,
                usuarioId: usuarioId
            });
        } 

        venta.estado_venta = "anulado";
        venta.observaciones = notaBaja;

        const newVenta:any = this.ventasRepo.create(venta);

        if (!!venta.ingresosVentas) {
            await this.ingresosVentasRepo.delete(venta.ingresosVentas.id);
        }
        await this.ventasRepo.save(newVenta);

        return { // aqui devolvemos true o false, dependiendo de si existe cantidad de dinero necesaria
            success: "Venta anulada correctamente"
        }
    }


    // venta REQUIERE "VENTADETALLES"
    // los creditos se añaden hasta culminar y cancelar
    async addIngresosVenta(venta:any){

        const ventaDetalles:any = venta.ventaDetalles ? venta.ventaDetalles : [];
        const totalIngreso:number = Number(venta.total);
        let totalCosto:number = 0;

        ventaDetalles.forEach((e:any) => {
            totalCosto = totalCosto + (e.cantidad_venta * e.productos.precio_compra);
        })

        const totalGanancia:number = totalIngreso - totalCosto;
        
        const ingresosVentas:any = {
            tipo_ingreso: tiposIngresos.ventas,
            ingreso: totalIngreso,
            costo: totalCosto,
            ganancia: totalGanancia,
            ventas: venta.id
        }

        await this.ingresosVentasRepo.save(ingresosVentas);

    }


}


// dentro de anulacionVenta
// if (afectarCaja) { // *** eliminar desde aqui
//     // quitar cantidad de caja
//     const locales:any = venta.locales;
//     let caja:any = await this.cajaRepo.findOne({
//         where: {
//             locales: { id: locales.id, tipo_local: "tienda" },
//             estado_caja: true
//         }
//     })
//     await this.cajaService.descuentoCaja(caja, venta.formasPago, venta.creditoDetalles, venta);
// registro de anulacion de venta en cajaDetalles
//     await this.cajaDetallesService.registrarAnulacionCajaDet({
//         monto_movimiento: Number("-" + montoMovimiento),
//         descripcion: "anulacion@" + notaBaja,
//         cajaId: caja.id,
//         usuarioId: usuarioId
//     });
// }