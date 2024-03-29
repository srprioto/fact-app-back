import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { CreateLocalStockDto, UpdateLocalStockDto } from '../dtos/locales_stock.dto';
// import { Locales } from '../entities/locales.entity';
import { LocalesStock } from '../entities/locales_stock.entity';
import { Productos } from 'src/module/productos/entities/productos.entity';
import { consulta } from 'src/assets/functions/queryBuilder';
import { Locales } from '../entities/locales.entity';

var xl = require('excel4node');


@Injectable()
export class LocalesStockService {
    constructor(
        @InjectRepository(LocalesStock) private localesStockRepo:Repository<LocalesStock>,
        @InjectRepository(Productos) private productosRepo:Repository<Productos>,
        @InjectRepository(Locales) private localesRepo:Repository<Locales>,
    ){ }

    async getAll(){
        const data = await this.localesStockRepo.find();
        return {
            success: "Lista registros encontrados", 
            data
        }
    }

    async getOne(id:number){
        const data = await this.localesStockRepo.findOne(id, {
            relations: ["locales", "productos"]
        });
        return {
            success: "Registro encontrado", 
            data
        }
    }


    async getOneProductoLocal(id:number, idLocal:number){ // buscar producto local
        const data = await this.localesStockRepo.findOne({
            relations: ['productos'],
            where: { 
                productos: {id: id},
                locales: {id: idLocal}
            },
        });

        return {
            success: "Registro encontrado",
            data
        }
    }


    async post(payload:CreateLocalStockDto){
        const elemento = await this.localesStockRepo.create(payload);
        elemento.locales = payload.localesId;
        elemento.productos = payload.productosId;

        // if (payload.localesId) {
        //     const local = await this.localesRepo.findOne(payload.localesId);
        //     elemento.locales = local            
        // }

        // if (payload.productosId) {
        //     const producto = await this.productosRepo.findOne(payload.productosId)
        //     elemento.productos = producto
        // }

        const data:LocalesStock = await this.localesStockRepo.save(elemento);

        return {
            success: "Registro creado",
            data
        }
    }


    async put(id:number, payload:UpdateLocalStockDto){

        const elemento = await this.localesStockRepo.findOne(id);
        elemento.locales = payload.localesId;
        elemento.productos = payload.productosId;

        // if (payload.localesId) {
        //     const local = await this.localesRepo.findOne(payload.localesId);
        //     elemento.locales = local
        // }

        // if (payload.productosId) {
        //     const producto = await this.productosRepo.findOne(payload.productosId)
        //     elemento.productos = producto
        // }

        await this.localesStockRepo.merge(elemento, payload)
        const data:LocalesStock = await this.localesStockRepo.save(elemento);


        return { 
            success: "Registro actualizado",
            data
        }
    }

    async delete(id:number){
        await this.localesStockRepo.delete(id);
        return { success: "Registro eliminado" }
    }


    async stockGeneralProducto(id:number){

        const productoLocalStock = await this.productosRepo.findOne(id, {
            relations: ["localesStock", "localesStock.locales"]
        })

        let stockGeneral:number = 0;

        productoLocalStock.localesStock.forEach((el:any) => {
            stockGeneral = stockGeneral + el.cantidad
        });

        return {
            success: "Producto encontrado",
            data: {
                stockGeneral,
                stockLocales: productoLocalStock.localesStock
            },
            
        }
    }


    // ingreso de productos al almacen
    async ingresoProductosAmacen(idProducto:number, idLocal:number, cantidad:number){
        
        const localstockAlmacen = await this.localesStockRepo.findOne({
            where: { locales: idLocal, productos: { id: idProducto }}
        })

        let idLocalStock:number;

        if (localstockAlmacen) {
            // aqui actualizar
            let actualizarLocalStock:any = await this.localesStockRepo.findOne(localstockAlmacen.id);
            actualizarLocalStock.cantidad = Number(actualizarLocalStock.cantidad) + Number(cantidad);

            // habilitar id y producto, en caso de que se requiera
            // actualizarLocalStock.locales = await this.localesRepo.findOne(idLocal);
            
            // if (idProducto) {
            //     const producto = await this.productosRepo.findOne(idProducto)
            //     actualizarLocalStock.productos = producto
            // }
            
            await this.localesStockRepo.update(actualizarLocalStock.id, actualizarLocalStock);

            idLocalStock = actualizarLocalStock.id
            
            
        }else{
            // aqui crear
            const nuevoLocalStock = await this.localesStockRepo.create({cantidad: cantidad});
            nuevoLocalStock.locales = idLocal
            // nuevoLocalStock.locales = await this.localesRepo.findOne(idLocal)
            nuevoLocalStock.productos = idProducto;

            // if (idProducto) {
            //     const producto = await this.productosRepo.findOne(idProducto)
            //     nuevoLocalStock.productos = producto
            // }
            const localstock = await this.localesStockRepo.save(nuevoLocalStock);

            idLocalStock = localstock.id
        }

        return idLocalStock;
    }    

    
    // locales o tiendas
    async getLocales(idLocal:number, orden:"ASC" | "DESC" | 1 | -1, options: IPaginationOptions):Promise<Pagination<LocalesStock>>{
        return paginate<LocalesStock>(this.localesStockRepo, options, {
            relations: [ "productos" ],
            order: { cantidad: orden },
            where: { locales: idLocal }
        });
    }


    async searchLocales(idLocal:number, value:string){
        const data = await this.localesStockRepo.find({
            relations: [ "productos" ],
            order: { id: "DESC" },
            where: [
                {
                    locales: idLocal,
                    productos: { codigo: Like(`%${value}%`) } 
                },
                {
                    locales: idLocal,
                    productos: { nombre: Like(`%${value}%`) } 
                },
                { 
                    locales: idLocal,
                    productos: { marca: Like(`%${value}%`) }
                },
                { 
                    locales: idLocal,
                    productos: { talla: Like(`%${value}%`) }
                }
            ] 
        });
        return data;
    }


    // manejo de cantidades
    async quitarCantidadProductos(idProducto:number, idLocal:number, cantidad:number){
        
        const localStock = await this.localesStockRepo.findOne({
            // relations: ["locales", "productos"],
            where: { locales: idLocal, productos: { id: idProducto }}
        })

        if (localStock) {
            // actualizar cantidad y quita cantidad de productos
            let actualizarLocalStock:any = await this.localesStockRepo.findOne(localStock.id);
            actualizarLocalStock.cantidad = Number(actualizarLocalStock.cantidad) - Number(cantidad);
            
            await this.localesStockRepo.update(actualizarLocalStock.id, actualizarLocalStock);

        }else{
            console.log("el producto no existe");

            // // aqui crear

            // const nuevoLocalStock = await this.localesStockRepo.create({cantidad: cantidad});

            // nuevoLocalStock.locales = await this.localesRepo.findOne(idLocal)
    
            // if (idProducto) {
            //     const producto = await this.productosRepo.findOne(idProducto)
            //     nuevoLocalStock.productos = producto
            // }
            // const localstock = await this.localesStockRepo.save(nuevoLocalStock);

        }

    }

    async anadirCantidadProductos(idProducto:number, idLocal:number, cantidad:number){
        
        const localstockAlmacen = await this.localesStockRepo.findOne({
            where: { locales: idLocal, productos: { id: idProducto }}
        })

        if (localstockAlmacen) {
            // aqui actualizar
            let actualizarLocalStock:any = await this.localesStockRepo.findOne(localstockAlmacen.id);
            actualizarLocalStock.cantidad = Number(actualizarLocalStock.cantidad) + Number(cantidad);
            
            await this.localesStockRepo.update(actualizarLocalStock.id, actualizarLocalStock);
            
        }else{
            // aqui crear
            const nuevoLocalStock = await this.localesStockRepo.create({cantidad: cantidad});
            nuevoLocalStock.locales = idLocal;
            nuevoLocalStock.productos = idProducto;
            // nuevoLocalStock.locales = await this.localesRepo.findOne(idLocal)
    
            // if (idProducto) {
            //     const producto = await this.productosRepo.findOne(idProducto)
            //     nuevoLocalStock.productos = producto
            // }

            await this.localesStockRepo.save(nuevoLocalStock);

        }

    }




    async anadirFullProd(payload:any){

        [...Array(995)].forEach(async (e:any, index:number) => {
            // console.log(e);

            const nuevoLocalStock = await this.localesStockRepo.create({cantidad: 50});
            nuevoLocalStock.locales = 1;
            nuevoLocalStock.productos = (index + 1);

            // nuevoLocalStock.locales = await this.localesRepo.findOne(1)
    
            // const producto = await this.productosRepo.findOne(index+1)
            // nuevoLocalStock.productos = producto

            const items:any = await this.localesStockRepo.save(nuevoLocalStock)

            // console.log(items);            
            
            // await this.anadirCantidadProductos(index, 2, 50);

        });
        
        // await this.anadirCantidadProductos(1, 2, 50);

        return {ok: "ok"}

    }


    async descargarStockExcel(res:any, idLocal:number){

        const stock:any = await consulta(`
            SELECT
                p.codigo,
                p.nombre AS nombre_producto,
                p.marca,
                p.color,
                p.talla,
                p.precio_venta_1,
                p.precio_venta_2,
                p.precio_venta_3,
                CAST(ls.cantidad AS CHAR) AS stock
            FROM productos AS p
            LEFT JOIN locales_stock AS ls ON p.id = ls.productosId
            WHERE ls.localesId = ${idLocal}
            ORDER BY ls.id desc;
        `)

        const wb = new xl.Workbook();
        const ws = wb.addWorksheet("nombre plantilla");

        const titlesColumns = [
            "Codigo",
            "Nombre",
            "Marca",
            "Color",
            "Talla",
            "Precio de venta 1",
            "Precio de venta 2",
            "Precio de venta 3",
            "Stock"
        ];

        let handlerColumnIndex = 1; // añadir nombres de las columnas
        titlesColumns.forEach(element => {
            ws.cell(1, handlerColumnIndex++).string(element)
        });


        let rowIndex = 2;
        stock.forEach((record) => { 
            let columnIndex = 1;
            Object.keys(record).forEach((columnName) => { 
                ws.cell(rowIndex, columnIndex++).string(record[columnName])
            })
            rowIndex++;
        }) 

        wb.write('StockProductos.xlsx', res);

    }


    // procesado de informacion
    async infoLocalStock(id:number){

        const local = await this.localesRepo.findOne(id);

        const queryValorTotalStock:string = `
            SELECT
                SUM(valorizacion_por_producto) AS valor_total_local
            FROM (
                SELECT
                    SUM(locales_stock.cantidad * productos.precio_compra) AS valorizacion_por_producto
                FROM locales_stock
                JOIN productos ON locales_stock.productosId = productos.id
                WHERE locales_stock.localesId = ${id}
                GROUP BY productos.id, productos.nombre
            ) AS subconsulta;
        `;

        const valorTotalStock:any = await consulta(queryValorTotalStock);

        return {
            success: "Producto encontrado",
            data: {
                valorTotalStock: valorTotalStock[0].valor_total_local,
                nombreLocal: local.nombre
            },
        }
        
    }

}



    // // productos almacen
    // async getAlmacen(options: IPaginationOptions):Promise<Pagination<LocalesStock>>{
        
    //     return paginate<LocalesStock>(this.localesStockRepo, options, {
    //         relations: [
    //             // "locales", 
    //             "productos"
    //         ],
    //         order: { updated_at: "DESC" },
    //         // 1 es el almacen
    //         // where: (`localesId = 1`)
    //         where: { locales: 1 }
    //     });
        
    // }

    // async searchAlmacen(value:string){

    //     const data = await this.localesStockRepo.find({
    //         relations: [
    //             "productos"
    //         ],
    //         order: { id: "DESC" },
    //         where: [
    //             { 
    //                 locales: 1,
    //                 productos: { 
    //                     codigo: Like(`%${value}%`)
    //                 } 
    //             },
    //             { 
    //                 locales: 1,
    //                 productos: { 
    //                     nombre: Like(`%${value}%`)
    //                 } 
    //             }
    //         ]
    //     });

    //     return {
    //         success: "Lista registros encontrados",
    //         data
    //     }
    // }