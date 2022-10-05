import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateRolesDto, UpdateRolesDto } from '../dtos/roles.dto';
import { Roles } from '../entities/roles.entity';


@Injectable()
export class RolesService {

    constructor(
        @InjectRepository(Roles) private rolesRepo:Repository<Roles>
    ){ }

    async getAll(){
        const data = await this.rolesRepo.find();
        return {
            success: "Lista registros encontrados",
            data
        }
    }

    async getOne(id:number){
        const elemento = await this.rolesRepo.findOne(id);

        return{
            success: "Registro encontrado",
            elemento
        }
    }

    async post(payload:CreateRolesDto){
        const elementos = await this.rolesRepo.create(payload)

        const data:CreateRolesDto = await this.rolesRepo.save(elementos);

        return {
            success: "Registro create",
            data 
        }

    }

    async put(id:number, payload:UpdateRolesDto){
        const elemento = await this.rolesRepo.findOne(id);
        await this.rolesRepo.merge(elemento, payload);
        const data:UpdateRolesDto = await this.rolesRepo.save(elemento);

        return{
            success: "Registro actualizado",
            data
        }
    }

    async delete(id:number){
        await this.rolesRepo.delete(id);
        return{
            success: "Registro eliminado"
        }
    }

}
