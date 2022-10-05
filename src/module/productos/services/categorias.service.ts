import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Categorias } from '../entities/categorias.entity';
import { CreateCategoriasDto, UpdateCategoriasDto } from '../dtos/categorias.dto';

@Injectable()
export class CategoriasService {

    constructor(
        @InjectRepository(Categorias) private categoriasRepo:Repository<Categorias>
    ){ }

    async getAll(){
        const data = await this.categoriasRepo.find();

        return {
            success: "Lista registros encontrados",
            data
        }
    }

    async getOne(id:number){
        const elemento = await this.categoriasRepo.findOne(id);

        return {
            success: "Registro encontrado",
            elemento
        }

    }

    async post(payload:any){

        const elemento = await this.categoriasRepo.create(payload);
        const data = await this.categoriasRepo.save(elemento);

        return{
            success: "Registro creado",
            data
        }
    }

    async put(id:number, payload:UpdateCategoriasDto){
        const elemento = await this.categoriasRepo.findOne(id);
        await this.categoriasRepo.merge(elemento, payload);
        const data:UpdateCategoriasDto = await this.categoriasRepo.save(elemento)

        return{
            success: "Registro actualizado",
            data
        }
    }

    async delete(id:number){
        await this.categoriasRepo.delete(id);
        return{
            success: "Registro eliminado"
        }
    }

}
