import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { Proveedores } from '../entities/proveedores.entity';
import { CreateProveedoresDto, UpdateProveedoresDto } from '../dtos/proveedores.dto';

@Injectable()
export class ProveedoresService {

    constructor(
        @InjectRepository(Proveedores) private proveedoresRepo:Repository<Proveedores>
    ){ }

    // async getAll(){
    //     const data = await this.proveedoresRepo.find();

    //     return{
    //         success: "Lista registros encontrados",
    //         data
    //     }
    // }

    async paginate(options: IPaginationOptions): Promise<Pagination<Proveedores>> {
        return paginate<Proveedores>(this.proveedoresRepo, options, {
            order: { id: "DESC" }
        });
    }

    async getOne(id:number){
        const data = await this.proveedoresRepo.findOne(id);
        return {
            success: "Registro encontrados",
            data
        }
    }

    async post(payload:CreateProveedoresDto){
        const elemento = await this.proveedoresRepo.create(payload);
        const data:CreateProveedoresDto = await this.proveedoresRepo.save(elemento);

        return {
            success: "Registro creado",
            data
        }
    }

    async put(id:number, payload:UpdateProveedoresDto){
        const elemento = await this.proveedoresRepo.findOne(id);

        await this.proveedoresRepo.merge(elemento, payload);
        const data:UpdateProveedoresDto = await this.proveedoresRepo.save(elemento);

        return {
            success: "Registro actualizado",
            data
        }
    }

    async delete(id:number){
        await this.proveedoresRepo.delete(id);
        return { success: "Registro eliminado" }
    }

    async searchData(value:string){

        const data = await this.proveedoresRepo.find({
            where: [
                { nombre: Like(`%${value}%`) },
                { razon_social: Like(`%${value}%`) }
            ]
        });

        return data
    }

}
