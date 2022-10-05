import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// import { Ventas } from '../entities/ventas.entity';
import { VentaDetalles } from '../entities/venta_detalles.entity';
// import { Productos } from 'src/module/productos/entities/productos.entity';
import { CreateVentaDetalles, UpdateVentaDetallesDto } from '../dtos/venta_detalles.dto';
import { LocalesStockService } from 'src/module/locales/services/locales-stock.service';

@Injectable()
export class VentaDetallesService {

    constructor(
        @InjectRepository(VentaDetalles) private ventaDetallesRepo:Repository<VentaDetalles>,
        // @InjectRepository(Ventas) private ventasRepo:Repository<Ventas>,
        // @InjectRepository(Productos) private productosRepo:Repository<Productos>,
        private localesStockService:LocalesStockService
    ){ }

    async getAll(){
        const data = await this.ventaDetallesRepo.find({
            relations: ["productos", "ventas"]
        });

        return{ 
            success: "Lista registros encontrados",
            data
        }
    }

    async getOne(id:number){
        const elemento = await this.ventaDetallesRepo.findOne(id,{
            relations: ["productos", "ventas"]
        });

        return{ 
            success: "Registro encontrado",
            elemento
        }
    }

    async post(payload:any){

        const elemento:any = await this.ventaDetallesRepo.create(payload);
        elemento.ventas = payload.ventasId;
        elemento.productos = payload.productosId;

        // if (payload.ventasId) {
        //     const venta = await this.ventasRepo.findOne(payload.ventasId);
        //     elemento.ventas = venta;
        // }

        // if (payload.productosId) {
        //     const producto = await this.productosRepo.findOne(payload.productosId);
        //     elemento.productos = producto;
        // }

        const data:VentaDetalles = await this.ventaDetallesRepo.save(elemento);

        return{
            success: "Registro creado",
            data
        }

    }


    async crearDetalleVentas(payload:CreateVentaDetalles, idVenta:number){
                
        payload.descuento = payload.descuento ? Number(payload.descuento) : 0;
        payload.cantidad_venta = Number(payload.cantidad_venta);
        payload.precio_venta = Number(payload.precio_venta);

        const elemento:any = this.ventaDetallesRepo.create(payload);
        elemento.productos = payload.productosId;
        elemento.ventas = idVenta;

        const data:VentaDetalles = await this.ventaDetallesRepo.save(elemento);
        
        return data;
    }


    async editarDetalleVentas(idVenDetall:number, idLocal:number, payload:any){

        if (payload.estado_venta_detalle === "listo") {
            // actualizamos aqui
            const elemento = await this.ventaDetallesRepo.findOne(idVenDetall);
            this.ventaDetallesRepo.merge(elemento, payload);
            await this.ventaDetallesRepo.save(elemento);

            // modificar cantidad
            await this.localesStockService.quitarCantidadProductos(payload.productos.id, idLocal, payload.cantidad_venta);

        } else if (payload.estado_venta_detalle === "rechazado") {
            const elemento = await this.ventaDetallesRepo.findOne(idVenDetall);
            this.ventaDetallesRepo.merge(elemento, payload);
            await this.ventaDetallesRepo.save(elemento);
        } 
        
        // actualizamos estado de venta detalles aqui
        
    }


    async put(id:number, payload:any){

        const elemento = await this.ventaDetallesRepo.findOne(id);

        // if (payload.ventasId) {
        //     const venta = await this.ventasRepo.findOne(payload.ventasId);
        //     elemento.ventas = venta;
        // }

        // if (payload.productosId) {
        //     const producto = await this.productosRepo.findOne(payload.productosId);
        //     elemento.productos = producto;
        // }

        // await this.ventaDetallesRepo.merge(elemento, payload);
        // const data:VentaDetalles = await this.ventaDetallesRepo.save(elemento);

        return{
            success: "Registro actualizado",
            data: elemento
        }

    }

    async delete(id:number){
        await this.ventaDetallesRepo.delete(id);

        return { success: "registro eliminado" }
    }

}
