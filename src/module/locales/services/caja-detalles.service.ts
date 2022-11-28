import { Injectable } from '@nestjs/common';
import { Repository, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

// import { sumaArrayObj } from 'src/assets/functions/sumaArrayObj';
import { CreateCajaDetalesDto } from '../dtos/caja-detalles.dto';
import { CajaDetalles } from '../entities/caja-detalles.entity';
import { Caja } from '../entities/caja.entity';

@Injectable()
export class CajaDetallesService {

    constructor(
        @InjectRepository(CajaDetalles) private cajaDetallesRepo:Repository<CajaDetalles>,
        @InjectRepository(Caja) private cajaRepo:Repository<Caja>
    ){}
    

    async paginate(idLocal:string, options:IPaginationOptions):Promise<Pagination<CajaDetalles>> {
        const where:any = {};
        if (idLocal !== "_") {
            if (idLocal === "No") {
                where.locales = IsNull();
            } else {
                where.locales = idLocal;
            }
        }

        // SELECT sum(monto_movimiento)
        // FROM caja_detalles
        // where (created_at BETWEEN "2022-11-25T00:00:00.000-05:00" AND "2022-11-25T23:59:59.999-05:00")
        // AND tipo_movimiento = "Otros movimientos"

        return paginate<CajaDetalles>(this.cajaDetallesRepo, options, {
            // relations: ["usuarios", "locales"],
            order: { id: "DESC" },
            where: where
        });
    }

    

    async post(payload:CreateCajaDetalesDto) {

        // aqui vamos a añadir a otros montos solo lo que venga en efectivo
        // verificamos que lo que venga en otras monedas no se añada

        // creacion caja detalles
        const elemento = this.cajaDetallesRepo.create(payload);
        elemento.caja = payload.cajaId
        elemento.usuario = payload.usuarioId
        const data:any = await this.cajaDetallesRepo.save(elemento);

        // // habilitar en caso de que se requiera
        // // añade actualizacion a caja, solo efectivo
        // if (payload.forma_pago === "efectivo") { 
        //     // actualizacion en caja
        //     const caja:any = await this.cajaRepo.findOne(payload.cajaId);
        //     caja.otros_montos = Number(caja.otros_montos) + Number(payload.monto_movimiento);
        //     const cajaUpdate:any = this.cajaRepo.create(caja);
        //     await this.cajaRepo.save(cajaUpdate);    
        // }

        return {
            success: "creado correctamente",
            data: data
        }
    }


    async eliminarCajaDetalles(id:number, payload:any){
        
        const cajaDetalle = await this.cajaDetallesRepo.findOne(id)
        const descripcion:any = cajaDetalle.descripcion.split('@');

        if (!(descripcion.length > 1)) { // eliminar esta condicion, o reemplazarla

            const caja:any = await this.cajaRepo.findOne(payload.idCaja);
            const monto_mov_sinsigno:number = Math.abs(Number(cajaDetalle.monto_movimiento))

            if (cajaDetalle.monto_movimiento > 0) {
                // si es positivo
                caja.otros_montos = Number(caja.otros_montos) - monto_mov_sinsigno;
            } else if (cajaDetalle.monto_movimiento < 0) {
                // si es negativo
                caja.otros_montos = Number(caja.otros_montos) + monto_mov_sinsigno;
            }
            
            const cajaUpdate:any = this.cajaRepo.create(caja);

            // actualizacion de datos
            await this.cajaRepo.save(cajaUpdate);
            await this.cajaDetallesRepo.delete(id);

            return { success: "Regisstro eliminado" }

        } else {
            return { fail: "No se pueden eliminar anulaciones" }    
        }
    }

    
    // async registrarAnulacionCajaDet(payload:CreateCajaDetalesDto){ // deprecate
    //     const elemento = await this.cajaDetallesRepo.create(payload);
    //     elemento.caja = payload.cajaId
    //     elemento.usuario = payload.usuarioId
    //     const data:any = await this.cajaDetallesRepo.save(elemento);
        
    //     return {
    //         success: "creado correctamente",
    //         data: data
    //     }
    // }


}
