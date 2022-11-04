import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { sumaArrayObj } from 'src/assets/functions/sumaArrayObj';
import { Repository } from 'typeorm'
import { CreateCajaDetalesDto } from '../dtos/caja-detalles.dto';
import { CajaDetalles } from '../entities/caja-detalles.entity';
import { Caja } from '../entities/caja.entity';

@Injectable()
export class CajaDetallesService {

    constructor(
        @InjectRepository(CajaDetalles) private cajaDetallesRepo:Repository<CajaDetalles>,
        @InjectRepository(Caja) private cajaRepo:Repository<Caja>
    ){}

    async post(payload:CreateCajaDetalesDto) {

        // creacion caja detalles
        const elemento = this.cajaDetallesRepo.create(payload);
        elemento.caja = payload.cajaId
        elemento.usuario = payload.usuarioId
        const data:any = await this.cajaDetallesRepo.save(elemento);

        // actualizacion en caja
        const caja:any = await this.cajaRepo.findOne(payload.cajaId);
        caja.otros_montos = Number(caja.otros_montos) + Number(payload.monto_movimiento);
        const cajaUpdate:any = this.cajaRepo.create(caja);
        await this.cajaRepo.save(cajaUpdate);

        return {
            success: "creado correctamente",
            data: data
        }

    }


    async registrarAnulacionCajaDet(payload:CreateCajaDetalesDto){
        const elemento = await this.cajaDetallesRepo.create(payload);
        elemento.caja = payload.cajaId
        elemento.usuario = payload.usuarioId
        const data:any = await this.cajaDetallesRepo.save(elemento);
        
        return {
            success: "creado correctamente",
            data: data
        }
    }


    async eliminarCajaDetalles(id:number, payload:any){
        
        const cajaDetalle = await this.cajaDetallesRepo.findOne(id)
        const descripcion:any = cajaDetalle.descripcion.split('@');

        if (!(descripcion.length > 1)) {

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


}
