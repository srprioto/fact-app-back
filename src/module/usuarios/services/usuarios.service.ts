import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

// import { Roles } from '../entities/roles.entity';
import { Usuarios } from '../entities/usuarios.entity';
import { CreateUsuariosDto } from '../dtos/usuarios.dto';
// import { Locales } from 'src/module/locales/entities/locales.entity';

@Injectable()
export class UsuariosService {

    constructor(
        @InjectRepository(Usuarios) private usuariosRepo:Repository<Usuarios>,
        // @InjectRepository(Roles) private rolesRepo:Repository<Roles>,
        // @InjectRepository(Locales) private localesRepo:Repository<Locales>
    ){ }

    async getAll(){
        const data = await this.usuariosRepo.find();
        return{
            success: "Lista registros encontrados",
            data
        }
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Usuarios>> {
        return paginate<Usuarios>(this.usuariosRepo, options, {
            select: ["id", "nombre", "documento", "direccion", "telefono", "edad", "email", "created_at", "updated_at"],
            order: { id: "DESC" }
        });
    }

    async getOne(id:number){
        const data = await this.usuariosRepo.findOne(id,{
            select: ["id", "nombre", "documento", "direccion", "telefono", "edad", "email", "created_at", "updated_at"],
            relations: ["roles", "locales"]
        });

        return{
            success: "Registro encontrado",
            data
        }
    }

    async post(payload:CreateUsuariosDto){

        const elemento = await this.usuariosRepo.create(payload);
        elemento.password = await bcrypt.hash(elemento.password, 10);
        elemento.roles = payload.rolesId;

        // if (payload.rolesId) {
        //     const roles = await this.rolesRepo.findOne(payload.rolesId)
        //     elemento.roles = roles;
        // }
        elemento.locales = payload.localesId ? payload.localesId : null;

        const data:Usuarios = await this.usuariosRepo.save(elemento);

        return {
            success: "Registro creado",
            data: data
        }

    }
    

    async put(id:number, payload:any){
        const elemento = await this.usuariosRepo.findOne(id);
        this.usuariosRepo.merge(elemento, payload);

        elemento.locales = payload.localesId ? payload.localesId : null;
        elemento.roles = payload.rolesId;
        if (!!payload.password) {
            elemento.password = await bcrypt.hash(payload.password, 10);
        }

        const data:Usuarios = await this.usuariosRepo.save(elemento);

        return{
            success: "Registro actualizado",
            elemento
        }
    }


    async delete(id:number){
        await this.usuariosRepo.delete(id);
        return { success: "Regisstro eliminado" }
    }


    async findByEmail(email: string) {
        return this.usuariosRepo.findOne({ 
            where: { email }, 
            relations: ["roles", "locales"] 
        })
    }

    
    async searchData(value:string){

        const data = await this.usuariosRepo.find({
            where: [
                { nombre: Like(`%${value}%`) },
                { documento: Like(`%${value}%`) }
            ]
        });

        return data
    }


}


