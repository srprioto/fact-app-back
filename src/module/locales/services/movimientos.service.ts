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