import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditoDetalles } from '../entities/credito_detalles.entity';

@Injectable()
export class CreditoDetallesService {
    
    constructor(
        @InjectRepository(CreditoDetalles) private creditoDetallesRepo:Repository<CreditoDetalles>
    ){}

    async crearCreditoAdelanto(payload:any){
        payload.fecha_estimada = new Date(payload.fecha_estimada);
        const creditoDetalles:any = this.creditoDetallesRepo.create(payload);
        const resto:any = await this.creditoDetallesRepo.save(creditoDetalles);
        return resto;
    }
    
}
