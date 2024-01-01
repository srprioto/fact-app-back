import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { CreateMovimientosDto, UpdateMovimientosDto } from '../dtos/movimientos.dto';
import { Movimientos } from '../entities/movimientos.entity';
// import { MovimientoDetalles } from '../entities/movimiento_detalles.entity';
// import { Productos } from 'src/module/productos/entities/productos.entity';
// import { Proveedores } from '../entities/proveedores.entity';
// import { LocalesStock } from '../entities/locales_stock.entity';

// import { LocalesStockService } from './locales-stock.service';
import { MovimientoDetallesService } from './movimiento-detalles.service';
import { TransaccionesService } from './transacciones.service';
import { fechaCompletaActualJs } from 'src/assets/functions/fechas';
import { consulta } from 'src/assets/functions/queryBuilder';

var xl = require('excel4node');



@Injectable()
export class MovimientosService {

    constructor(
        @InjectRepository(Movimientos) private movimientosRepo:Repository<Movimientos>,
        private transaccionesService:TransaccionesService,
        // @InjectRepository(Productos) private productosRepo:Repository<Productos>,
        // @InjectRepository(Proveedores) private proveedoresRepo:Repository<Proveedores>,
        // @InjectRepository(LocalesStock) private localesStockRepo:Repository<LocalesStock>,

        // private localesStockService:LocalesStockService,
        private movimientoDetallesService:MovimientoDetallesService
        
        
    ){ }


    async paginate(options: IPaginationOptions): Promise<Pagination<Movimientos>> {
        return paginate<Movimientos>(this.movimientosRepo, options, {
            relations: ["locales", "movimientoDetalles", "movimientoDetalles.productos"],
            order: { id: "DESC" }
        });
    }

    // async getAll(){
    //     const data = await this.movimientosRepo.find({
    //         relations: [
    //             "movimientoDetalles", 
    //             // "movimientoDetalles.productos"
    //         ]
    //     });
    //     return {
    //         success: "Lista registros encontrados",
    //         data
    //     }
    // }

    async getOne(id:number){
        const data = await this.movimientosRepo.findOne(id,{
            relations: ["locales", "movimientoDetalles", "movimientoDetalles.productos", "movimientoDetalles.proveedores"]
        });
        return {
            success: "Registro encontrado",
            data
        }
    }

    async post(payload:CreateMovimientosDto){
        const elemento = await this.movimientosRepo.create(payload);
        const data:Movimientos = await this.movimientosRepo.save(elemento);

        return {
            success: "Registro creado",
            data
        }
    }

    async put(id:number, payload:UpdateMovimientosDto){
        const elemento = await this.movimientosRepo.findOne(id);
        await this.movimientosRepo.merge(elemento, payload);
        const data:Movimientos = await this.movimientosRepo.save(elemento)

        return {
            success: "Registro actualizado",
            data
        }
        
    }

    async delete(id:number){
        await this.movimientosRepo.delete(id);
        return{ success: "Registro eliminado" }
    }

    
    async anadirProductos(payload:any){

        payload.subtotal = Number(payload.subtotal)
        payload.costo_transporte = Number(payload.costo_transporte)
        payload.costo_otros = Number(payload.costo_otros)
        payload.total = Number(payload.total)

        const transaccionDetalles:Array<any> = [];
        const transaccion:any = {
            descripcion: payload.observaciones === "" ? "Ingreso de productos" : payload.observaciones,
            localOrigen: null,
            localDestino: Number(payload.local_destino),
            usuarioEnvia: payload.usuarioId
        }

        const movimiento:any = await this.movimientosRepo.create(payload); //guardar en moviminetos
        movimiento.locales = Number(payload.local_destino);
        const response_movimientos:any = await this.movimientosRepo.save(movimiento);
        
        // crea los movimientos detalles y regresa si todos estan listos
        await Promise.all(payload.movimiento_detalles.map(async (m:any) => { 
            const updateMovimientoDetalles:any = {
                productosId: m.producto.id,
                productoNombre: m.producto.nombre,
                cantidad: m.cantidad,
            };
            transaccionDetalles.push(updateMovimientoDetalles)
            return await this.movimientoDetallesService.añadirProductoDetalles(m, payload.local_destino, response_movimientos);
        }));

        transaccion.detalleTransferencia = transaccionDetalles;
        await this.transaccionesService.crearTransaccion(transaccion); // añade el ingreso de productos a transaccion

        return {
            success: "Registro creado",
            idMovimiento: response_movimientos.id
        };

    }

    
    async searchData(value:string){

        const data = await this.movimientosRepo.find({
            relations: ["locales", "movimientoDetalles", "movimientoDetalles.productos"],
            where: [
                { id: Like(`%${Number(value)}%`) },
                { locales: { nombre: Like(`%${value}%`) } }
            ]
        });

        return data;
    }



    async descargarExcelIngresoProductos(res:any, id:number){
        const data = await this.movimientosRepo.findOne(id,{
            relations: ["locales", "movimientoDetalles", "movimientoDetalles.productos", "movimientoDetalles.proveedores"]
        });

        let exportar:Array<any> = [];

        data.movimientoDetalles.forEach((e:any) => {
            
            let dataUpdate:any = {};

            dataUpdate.cantidad = e.cantidad.toString()
            dataUpdate.precio_unidad = e.precio_unidad.toString()
            dataUpdate.precio_parcial = e.precio_parcial.toString()
            
            dataUpdate.nombre_producto = e.productos.nombre;
            dataUpdate.codigo_producto = e.productos.codigo;
            dataUpdate.marca = e.productos.marca;
            dataUpdate.color = e.productos.color;
            dataUpdate.talla = e.productos.talla;
            dataUpdate.precio_compra = e.productos.precio_compra.toString();
            dataUpdate.precio_venta_1 = e.productos.precio_venta_1.toString();
            dataUpdate.precio_venta_2 = e.productos.precio_venta_2.toString();
            dataUpdate.precio_venta_3 = e.productos.precio_venta_3.toString();
            
            exportar.push(dataUpdate);
        });


        const wb = new xl.Workbook();
        const ws = wb.addWorksheet("nombre plantilla");

        ws.cell(1, 1).string('Codigo Ingreso:');
        ws.cell(1, 2).string(data.id.toString());
        
        ws.cell(2, 1).string('Subtotal:');
        ws.cell(2, 2).string(data.subtotal);
        
        ws.cell(3, 1).string('Costo de transporte:');
        ws.cell(3, 2).string(data.costo_transporte);
        
        ws.cell(4, 1).string('Otros costos:');
        ws.cell(4, 2).string(data.costo_otros);

        ws.cell(5, 1).string('Total:');
        ws.cell(5, 2).string(data.total);
        
        ws.cell(6, 1).string('Observaciones:');
        ws.cell(6, 2).string(data.observaciones);
        
        ws.cell(7, 1).string('Fecha de ingreso:');
        ws.cell(7, 2).string(fechaCompletaActualJs(data.created_at));

        
        const titlesColumns = [
            "Cantidad de unidades",
            "Precio unitario",
            "Precio parcial",
            "Nombre del producto",
            "Codigo  del producto",
            "Marca del producto",
            "Color del producto",
            "Talla del producto",
            "Precio de compra",
            "Precio de venta por unidad",
            "Precio de venta al por menor",
            "Precio de venta al por mayor",
        ];

        let filaInicioTitulos = 9;
        let filaInicioIteracion = filaInicioTitulos + 1;

        let handlerColumnIndex = 1; // añadir nombres de las columnas
        titlesColumns.forEach(element => {
            ws.cell(filaInicioTitulos, handlerColumnIndex++).string(element)
        });

        exportar.forEach((record) => { 
            let columnIndex = 1;
            Object.keys(record).forEach((columnName) => { 
                ws.cell(filaInicioIteracion, columnIndex++).string(record[columnName])
            })
            filaInicioIteracion++;
        }) 

        wb.write(`Registro Ingresos.xlsx`, res);

    }


    async reabastecimientoReportes(payload:any){

        const { local, fechas }:any = payload;
        let whereSumatoria:string = `where 1 = 1 `;
        let whereTotalComprado:string = `where 1 = 1 `;

        if (local !== 0) {
            whereSumatoria += `AND localesId = ${local}`
            whereTotalComprado += `AND m.localesId = ${local}`;
        }

        if (fechas.inicio !== "_" || fechas.fin !== "_") {
            whereSumatoria += `
                AND created_at 
                    BETWEEN STR_TO_DATE('${fechas.inicio}', '%Y-%m-%dT%H:%i:%s.%f') 
                    AND STR_TO_DATE('${fechas.fin}', '%Y-%m-%dT%H:%i:%s.%f')
            `
            whereTotalComprado += `
                AND m.created_at 
                    BETWEEN STR_TO_DATE('${fechas.inicio}', '%Y-%m-%dT%H:%i:%s.%f')
                    AND STR_TO_DATE('${fechas.fin}', '%Y-%m-%dT%H:%i:%s.%f')
            `;
        }

        const sumatorias:any = await consulta(`
            SELECT
                SUM(total) AS suma_total,
                SUM(costo_otros) AS suma_costo_otros,
                SUM(costo_transporte) AS suma_costo_transporte,
                SUM(subtotal) AS suma_subtotal
            FROM movimientos
            ${whereSumatoria}
        `);


        const total_comprado:any = await consulta(`
            SELECT
                CONCAT(p.nombre, ' - ', p.talla, ' - ', p.marca) AS producto,
                SUM(md.cantidad) AS total_adquirido
            FROM movimiento_detalles md
            JOIN productos p ON md.productosId = p.id
            JOIN movimientos m ON md.movimientosId = m.id
            ${whereTotalComprado}
            GROUP BY p.id
            ORDER BY total_adquirido DESC
            LIMIT 10;
        `);


        return {
            sumatorias: sumatorias,
            total_comprado: total_comprado
        }

        // SELECT
        //     p.codigo AS codigo,
        //     p.nombre AS nombre_producto,
        //     p.marca AS marca_producto,
        //     p.color AS color_producto,
        //     p.talla AS talla_producto,
        //     SUM(md.cantidad) AS total_adquirido,
        //     SUM(md.precio_parcial) AS precio_compra_total
        // FROM movimiento_detalles md
        // JOIN productos p ON md.productosId = p.id
        // JOIN movimientos m ON md.movimientosId = m.id
        // WHERE m.created_at 
        //     BETWEEN '2023-10-01' AND '2023-10-31'
        //     AND m.localesId = 2
        // GROUP BY p.id
        // ORDER BY total_adquirido DESC;

    }


}








// let localStockid:number;

// let movimientoDetalles:any = this.movimientoDetallesRepo.create(m);

// if (m.producto.id) {
//     const producto:any = await this.productosRepo.findOne(m.producto.id);
//     movimientoDetalles.productos = producto
    
//     // id para guardar relacion con localstock, en caso de que se requiera
//     localStockid = await this.localesStockService.ingresoProductosAmacen(m.producto.id, payload.local_destino, movimientoDetalles.cantidad)

// }

// if (m.proveedor.id) {
//     const proveedores = await this.proveedoresRepo.findOne(m.proveedor.id);
//     movimientoDetalles.proveedores = proveedores
// }

// if (response_movimientos.id) {
//     const movimiento = await this.movimientosRepo.findOne(response_movimientos.id);
//     movimientoDetalles.movimientos = movimiento
// }

// // habilitar locakstock
// // const localstock = await this.localesStockRepo.findOne(localStockid);
// // movimientoDetalles.localesStock = localstock

// return await this.movimientoDetallesRepo.save(movimientoDetalles);