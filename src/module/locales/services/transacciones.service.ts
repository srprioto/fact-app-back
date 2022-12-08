import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull, Not } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { Transacciones } from '../entities/transacciones.entity';
import { TransaccionDetalles } from '../entities/transaccion_detalle.entity';

import { LocalesStockService } from './locales-stock.service';

@Injectable()
export class TransaccionesService {

    constructor(
        @InjectRepository(Transacciones) private transaccionesRepo:Repository<Transacciones>,
        @InjectRepository(TransaccionDetalles) private transaccionDetallesRepo:Repository<TransaccionDetalles>,
        private localesStockService:LocalesStockService
    ){ }


    async paginateFiltro(value:string = "_", options: IPaginationOptions): Promise<Pagination<Transacciones>> {

        const where:any = { localOrigen: Not(IsNull()) };

        if (value !== "_") {
            where.estado_general = value;
        }

        return await paginate<Transacciones>(this.transaccionesRepo, options, {
            relations: [
                "localDestino",
                "localOrigen"
            ],
            order: { created_at: "DESC" },
            where: where
        });
        
    }


    async searchData(value:string){
        const data = await this.transaccionesRepo.find({
            relations: [
                "localDestino"
            ],
            where: [
                { id: Like(`%${Number(value)}%`) },
                { descripcion: Like(`%${value}%`) }
            ]
        });
        return data
    }


    async resumenTransacciones(){
        
        const enviados = await this.transaccionesRepo.count({
            where: { estado_general: "enviado" },
        });

        const listos = await this.transaccionesRepo.count({
            where: { estado_general: "listo" },
        });

        const observados = await this.transaccionesRepo.count({
            where: { estado_general: "observado" },
        });

        const total = enviados + listos + observados;
        
        return {
            data: {
                enviados,
                listos,
                observados,
                total
            }
        }
    }

    
    async getOne(id:number){
        const data = await this.transaccionesRepo.findOne(id, {
            relations: [
                "localOrigen", 
                "localDestino", 
                "usuarioEnvia", 
                "usuarioRecibe", 
                "transaccionDetalles", 
                "transaccionDetalles.productos"
            ],
        });
        return {
            success: "Registro encontrados",
            data
        }
    }


    async crearTransaccion(payload:any){ // crear transaccion
        
        const transaccion:any = this.transaccionesRepo.create(payload);
        const response_transaccion:any = await this.transaccionesRepo.save(transaccion);

        payload.detalleTransferencia.forEach(async (detalle:any) => { 

            const detalleTransferencia:any = this.transaccionDetallesRepo.create(detalle);
            detalleTransferencia.productos = detalle.productosId
            detalleTransferencia.transacciones = response_transaccion.id

            // aqui quitamos cantidad (CONDICIONAR Y DESACTIVAR EN CASO DE QUE LOCAL ORIGEN SEA 0)
            if (payload.localOrigen !== null) {
                await this.localesStockService.quitarCantidadProductos(detalle.productosId, payload.localOrigen, detalle.cantidad);    
            }

            await this.transaccionDetallesRepo.save(detalleTransferencia);

        });

        return {
            success: "Registro creado",
            payload,
        }
    }


    async actualizarTransaccion(id:number, payload:any){

        const transaccion:any = await this.transaccionesRepo.findOne(id, {
            relations: [
                "transaccionDetalles", 
                "localDestino"
                // "transaccionDetalles.productos"
            ],
        });

        transaccion.observaciones = payload.observaciones;
        transaccion.estado_general = payload.estado_general;
        transaccion.usuarioRecibe = payload.usuarioRecibe;

        // this.transaccionesRepo.merge(transaccion, payload);
        const respuesta = await this.transaccionesRepo.save(transaccion);

        transaccion.transaccionDetalles.forEach(async (detalles:any) => {

            const detallesTrans:any = await this.transaccionDetallesRepo.findOne(detalles.id, {
                relations: [
                    "productos"
                ],
            });

            if (payload.transaccionDetalles.includes(detalles.id.toString())) {
                // si concuerda   
                detallesTrans.estado_detalle = "listo";

                // aqui añadir cantidad a destino

                this.localesStockService.anadirCantidadProductos(
                    detallesTrans.productos.id,
                    transaccion.localDestino.id,
                    detallesTrans.cantidad
                );

            } else {
                // si no concuerda
                detallesTrans.estado_detalle = "observado";

                // añadir configuracion en caso de que corresponda
            }

            await this.transaccionDetallesRepo.update(detalles.id, detallesTrans);

        })

        return {
            success: "Registro actualizado",
            respuesta
        }
    }


    async getTransferenciaLocales(idLocal:number){

        const data = await this.transaccionesRepo.find({
            relations: [
                "localOrigen", 
                "localDestino", 
                "usuarioEnvia", 
                "usuarioRecibe", 
                "transaccionDetalles", 
                "transaccionDetalles.productos"
            ],
            where: {
                localDestino: { id: idLocal },
                estado_general: "enviado"
            }
        });

        return {
            success: "Registro encontrados",
            data
        }

    }

    async corregirTransfernecia(payload:any){

        let transaccionDetalle:any = await this.transaccionDetallesRepo.findOne(payload.id_transaccion_detalle);
        if (payload.estado_detalle === "listo") {
            transaccionDetalle.estado_detalle = "listo";    
        } else if (payload.estado_detalle === "regresar") {
            transaccionDetalle.estado_detalle = "corregido";
        }

        await this.transaccionDetallesRepo.update(payload.id_transaccion_detalle, transaccionDetalle);

        await this.localesStockService.anadirCantidadProductos(
            payload.id_producto,
            payload.id_local_destino,
            payload.cantidad
        );
        
        // cambiar estado general

        const transaccion:any = await this.transaccionesRepo.findOne(payload.id_transaccion, {
            relations: ["transaccionDetalles"]
        })

        let estado_general:string = "listo";

        let listos:number = 0;
        let corregido:number = 0;
        let observado:number = 0;

        transaccion.transaccionDetalles.forEach((e:any) => {
            if (e.estado_detalle === "listo" && e.estado_detalle != "corregido" && e.estado_detalle != "observado"){
                listos++;
            } else if (e.estado_detalle === "corregido" && e.estado_detalle != "observado") {
                corregido++;
            } else if (e.estado_detalle === "observado") {
                observado++;
            }
        });

        if (corregido > 0) {
            estado_general = "corregido";
        }

        if (observado > 0) {
            estado_general = "observado";
        }

        transaccion.estado_general = estado_general;

        await this.transaccionesRepo.save(transaccion);
        
        return {
            data: transaccion
        }

    }

}


// async paginateFiltro(value:string = "_", options: IPaginationOptions): Promise<Pagination<Transacciones>> {

//     if (value === "_") {
//         return paginate<Transacciones>(this.transaccionesRepo, options, {
//             relations: [
//                 "localDestino"
//             ],
//             order: { created_at: "DESC" }
//         });
//     } else {
//         return paginate<Transacciones>(this.transaccionesRepo, options, {
//             relations: [
//                 "localDestino"
//             ],
//             where: { estado_general: value },
//             order: { created_at: "DESC" }
//         });
//     }
// }


// async put(id:number, payload:any){
//     const elemento = await this.transaccionesRepo.findOne(id);

//     await this.transaccionesRepo.merge(elemento, payload);
//     const data:any = await this.transaccionesRepo.save(elemento);

//     return {
//         success: "Registro actualizado",
//         data
//     }
// }


// async delete(id:number){
//     await this.transaccionesRepo.delete(id);
//     return { success: "Registro eliminado" }
// }