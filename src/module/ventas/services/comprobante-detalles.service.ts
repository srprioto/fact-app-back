import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ComprobanteDetalles } from '../entities/comprobante_detalles.entity';

@Injectable()
export class ComprobanteDetallesService {

    constructor(
        @InjectRepository(ComprobanteDetalles) private comprobanteDetallesRepo:Repository<ComprobanteDetalles>,
        
    ){ }

    async registrarComprobanteDetalles(idComprobante:number, payload:any){ 

        payload.comprobante = idComprobante;
        const compDetalle:any = this.comprobanteDetallesRepo.create(payload);
        await this.comprobanteDetallesRepo.save(compDetalle);

        return {
            success: "registro correcto"
        }

    }

}
