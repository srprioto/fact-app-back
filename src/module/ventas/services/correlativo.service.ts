import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correlativos } from '../entities/correlativos.entity';

@Injectable()
export class CorrelativoService {

    constructor(
        @InjectRepository(Correlativos) private correlativoRepo:Repository<Correlativos>,
    ){ }

    async getAll(){
        const data = await this.correlativoRepo.find({
            relations: ["locales"]
        });
        return {
            success: "datos enconetrados",
            data
        }
    }

    async getOneForLocal(idLocal:number, descripcion:string){
        const correlativo:any = await this.correlativoRepo.findOne({
            where: {
                locales: idLocal,
                descripcion: descripcion
            }
        })
        return correlativo;
    }

    async acumCorrelativo(idLocal:number, descripcion:string){ // requiere correlativo en DB
        const correlativo:any = await this.getOneForLocal(idLocal, descripcion);
        correlativo.correlativo = correlativo.correlativo + 1;
        const newCorrelativo:any = await this.correlativoRepo.save(correlativo);
        return newCorrelativo
    }

    async post(payload){

        const correlativo:any = this.correlativoRepo.create(payload);
        correlativo.locales = payload.localId
        await this.correlativoRepo.save(correlativo);

        return {
            success: "datas registrados correctamente"
        }

    }


}
