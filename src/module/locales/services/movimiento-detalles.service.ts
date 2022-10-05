import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MovimientoDetalles } from '../entities/movimiento_detalles.entity';
// import { LocalesStock } from '../entities/locales_stock.entity';
// import { Movimientos } from '../entities/movimientos.entity';
// import { Proveedores } from '../entities/proveedores.entity';
// import { Productos } from 'src/module/productos/entities/productos.entity';

import { CreateMovimientoDetallesDto, UpdateMovimientoDetallesDto } from '../dtos/movimiento_detalles.dto';
// import { LocalesStockService } from './locales-stock.service';

@Injectable()
export class MovimientoDetallesService {

    constructor(
        @InjectRepository(MovimientoDetalles) private movimientoDetallesRepo:Repository<MovimientoDetalles>,
        // @InjectRepository(Productos) private productosRepo:Repository<Productos>,
        // @InjectRepository(LocalesStock) private localesStockRepo:Repository<LocalesStock>,
        // @InjectRepository(Movimientos) private movimientosRepo:Repository<Movimientos>,
        // @InjectRepository(Proveedores) private proveedoresRepo:Repository<Proveedores>,
        // private localesStockService:LocalesStockService
    ){ }

    async getAll(){
        const data = await this.movimientoDetallesRepo.find();
        return {
            success: "Lista registros encontrados",
            data
        }
    }

    async getOne(id:number){
        const elemento = await this.movimientoDetallesRepo.findOne(id,{
            relations: ["productos", "localesStock", "movimientos", "proveedores"]
        });

        return {
            success: "registro encontrado",
            elemento
        }

    }

    async post(payload:CreateMovimientoDetallesDto){

        const elemento = await this.movimientoDetallesRepo.create(payload);
        elemento.productos = payload.productosId ? payload.productosId : null;
        elemento.localesStock = payload.localesStockId ? payload.localesStockId : null;
        elemento.movimientos = payload.movimientosId ? payload.movimientosId : null;
        elemento.proveedores = payload.proveedoresId ? payload.proveedoresId : null;

        // if (payload.productosId) {
        //     const producto = await this.productosRepo.findOne(payload.productosId)
        //     elemento.productos = producto;
        // }

        // if (payload.localesStockId) {
        //     const localesStock = await this.localesStockRepo.findOne(payload.localesStockId)
        //     elemento.localesStock = localesStock;
        // }

        // if (payload.movimientosId) {
        //     const movimientos = await this.movimientosRepo.findOne(payload.movimientosId);
        //     elemento.movimientos = movimientos;
        // }

        // if (payload.proveedoresId) {
        //     const proveedores = await this.proveedoresRepo.findOne(payload.proveedoresId);
        //     elemento.proveedores = proveedores;
        // }

        const data:MovimientoDetalles = await this.movimientoDetallesRepo.save(elemento);

        return {
            success: "Registro creado",
            data
        }

    }

    async put(id:number, payload:UpdateMovimientoDetallesDto){

        const elemento = await this.movimientoDetallesRepo.findOne(id);
        elemento.productos = payload.productosId ? payload.productosId : null;
        elemento.localesStock = payload.localesStockId ? payload.localesStockId : null;
        elemento.movimientos = payload.movimientosId ? payload.movimientosId : null;
        elemento.proveedores = payload.proveedoresId ? payload.proveedoresId : null;

        // if (payload.productosId) {
        //     const producto = await this.productosRepo.findOne(payload.productosId)
        //     elemento.productos = producto;
        // }

        // if (payload.localesStockId) {
        //     const localesStock = await this.localesStockRepo.findOne(payload.localesStockId)
        //     elemento.localesStock = localesStock;
        // }

        // if (payload.movimientosId) {
        //     const movimientos = await this.movimientosRepo.findOne(payload.movimientosId);
        //     elemento.movimientos = movimientos;
        // }

        // if (payload.proveedoresId) {
        //     const proveedores = await this.proveedoresRepo.findOne(payload.proveedoresId);
        //     elemento.proveedores = proveedores;
        // }

        await this.movimientoDetallesRepo.merge(elemento, payload);
        const data:MovimientoDetalles = await this.movimientoDetallesRepo.save(elemento);

        return {
            success: "Registro creado",
            data
        };
    }

    async delete(id:number){
        await this.movimientoDetallesRepo.delete(id);
        return { success: "Registro eliminado" };
    }


    // obliterado
    async añadirProductoDetalles(m:any, local_destino:any, response_movimientos:any){

        // let localStockid:number;

        let movimientoDetalles:any = await this.movimientoDetallesRepo.create(m);
        movimientoDetalles.productos = m.producto.id ? m.producto.id : null;
        movimientoDetalles.proveedores = m.proveedor.id ? m.proveedor.id : null;
        movimientoDetalles.movimientos = response_movimientos.id ? response_movimientos.id : null;
        
        // if (m.producto.id) {
        //     const producto:any = await this.productosRepo.findOne(m.producto.id);
        //     movimientoDetalles.productos = producto;
            
        //     // id para guardar relacion con localstock, en caso de que se requiera (DESACTIVAR)
        //     // localStockid = await this.localesStockService.ingresoProductosAmacen(m.producto.id, local_destino, movimientoDetalles.cantidad);
        // }

        // if (m.proveedor.id) {
        //     const proveedores = await this.proveedoresRepo.findOne(m.proveedor.id);
        //     movimientoDetalles.proveedores = proveedores;
        // }

        // if (response_movimientos.id) {
        //     const movimiento = await this.movimientosRepo.findOne(response_movimientos.id);
        //     movimientoDetalles.movimientos = movimiento;
        // }

        // habilitar locakstock
        // const localstock = await this.localesStockRepo.findOne(localStockid);
        // movimientoDetalles.localesStock = localstock

        return await this.movimientoDetallesRepo.save(movimientoDetalles);

    }

}
