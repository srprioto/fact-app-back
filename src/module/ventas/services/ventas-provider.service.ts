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
import { IngresosVentas } from '../entities/ingresos-ventas.entity';
import { LocalesStockService } from 'src/module/locales/services/locales-stock.service';

@Injectable()
export class VentasProviderService {

    constructor(
        @InjectRepository(Ventas) private ventasRepo:Repository<Ventas>,
        @InjectRepository(IngresosVentas) private ingresosVentasRepo:Repository<IngresosVentas>,
        private cajaDetallesService:CajaDetallesService,
        private localesStockService:LocalesStockService,
        // @InjectRepository(Caja) private cajaRepo:Repository<Caja>,
    ){ }

    async anulacionVenta(idVenta:number, notaBaja:string, usuarioId:number, idCajaActual:number){

        // actualizar y anular venta
        const venta:any = await this.ventasRepo.findOne(idVenta, { 
            relations: ["ventaDetalles", "ventaDetalles.productos", "locales", "formasPago", "creditoDetalles", "caja", "ingresosVentas"] 
        });
        const idCajaVenta:number = venta.caja ? venta.caja.id : 0;

        // verifica que sea una venta que no pertenece a la caja actual
        if (idCajaActual !== idCajaVenta) { 

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

        // guardamos cambiamos de anulacion de venta
        venta.estado_venta = "anulado";
        venta.observaciones = notaBaja;
        const newVenta:any = this.ventasRepo.create(venta);
        await this.ventasRepo.save(newVenta);

        // eliminamos ingreso ventas
        if (!!venta.ingresosVentas) {
            await this.ingresosVentasRepo.delete(venta.ingresosVentas.id);
        }

        // devolver stock de productos
        if (venta.ventaDetalles.length > 0) {
            await Promise.all(venta.ventaDetalles.map(async (e:any) => {
                await this.localesStockService.anadirCantidadProductos(e.productos.id, venta.locales.id, e.cantidad_venta);
            }))
        }
        
        return {
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
            // tipo_ingreso: tiposIngresos.ventas,
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