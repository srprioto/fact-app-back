import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
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
import { paginacionOrm } from 'src/assets/functions/paginacion';
import { fechaInicioFinMes } from 'src/assets/functions/fechas';
import { consulta } from 'src/assets/functions/queryBuilder';

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


    // async ventasDelUsuario(id:number){
    //     const data:any = await this.ventasRepo.find({
    //         relations: ["ventaDetalles", "ventaDetalles.productos"],
    //         where: {usuarios: id}
    //     });

    //     return {
    //         success: "informacion correcta",
    //         data: data
    //     }
    // }

    async ventasUsuarioPaginate(payload:any, id:number){

        const data:any = await this.ventasRepo.find({
            relations: ["ventaDetalles", "ventaDetalles.productos"],
            where: {usuarios: id}
        });

        const inicio:string = payload.fechas.inicio;
        const fin:string = payload.fechas.fin;

        const where:any = {usuarios: id};
        let filtroFechas:string = "";

        if (inicio !== "_" || fin !== "_" ) {
            where.created_at = Between(inicio, fin);
            filtroFechas = `AND ventas.created_at BETWEEN '${inicio}' AND '${fin}'`
        }

        // lista total ventas usuarios
        const resto:any = await paginacionOrm(this.ventasRepo, {
            relations: ["ventaDetalles", "ventaDetalles.productos"],
            where: where,
            pagina: payload.pagina,
        });


        // respuestas especificas
        // consultas
        const queryTotalDineroVendido:string = `
            SELECT SUM(ventas.total) AS total_vendido
            FROM ventas
            WHERE ventas.usuariosId = ${id} ${filtroFechas};
        `;


        const queryTotalProdVendidos:string = `
            SELECT
                SUM(cantidad_venta) AS total_vendido
            FROM venta_detalles
            JOIN ventas ON venta_detalles.ventasId = ventas.id
            WHERE ventas.usuariosId = ${id} ${filtroFechas};
        `;


        const queryTopVendido:string = `
            SELECT
                CONCAT(productos.nombre, ' - ', productos.marca, ' - ', productos.talla, ' - ', productos.color) AS name,
                SUM(venta_detalles.cantidad_venta) AS total_vendido,
                SUM(venta_detalles.precio_parcial) AS valor_venta_total
            FROM venta_detalles
            JOIN ventas ON venta_detalles.ventasId = ventas.id
            JOIN productos ON venta_detalles.productosId = productos.id
            WHERE 
                ventas.usuariosId = ${id} ${filtroFechas}
            GROUP BY productos.id
            ORDER BY total_vendido DESC
            LIMIT 10;
        `;


        // query builder
        const totalDineroVendido:Promise<any> = await consulta(queryTotalDineroVendido);
        const totalProdVendidos:Promise<any> = await consulta(queryTotalProdVendidos);
        const topProducVendidos:any = await consulta(queryTopVendido);


        const convTopProductosVendidos = topProducVendidos.map(obj => ({
            ...obj,
            total_vendido: Number(obj.total_vendido),
        }));


        return {
            resto: resto,
            detalles: {
                totalDineroRecaudado: totalDineroVendido[0].total_vendido,
                totalProductosVendidos: totalProdVendidos[0].total_vendido,
                topProductosVendidos: convTopProductosVendidos
            }
        };

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


// 2024-01-12T00:00:00.000-05:00
// 2024-01-13T23:59:59.999-05:00




// busquedas
// let where:any = [];
// if (!!payload.searchText) {
//     where = [
//         { nombre: Like(`%${payload.searchText}%`), tipo: "personal" },
//         { documento: Like(`%${payload.searchText}%`), tipo: "personal" }
//     ]
// } else {
//     where = { tipo: "personal" };
// }


