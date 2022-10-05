import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

import { Locales } from '../entities/locales.entity';
import { CreateLocalesDto, UpdateLocalesDto } from '../dtos/locales.dto';

@Injectable()
export class LocalesService {

    constructor(
        @InjectRepository(Locales) private localesRepo:Repository<Locales>
    ){ }

    async getAll(){
        const data = await this.localesRepo.find();
        
        return {
            success: "Lista registros encontrados",
            data
        }        
    }
    
    async getLocales(){
        const data = await this.localesRepo.find({
            // relations: [
            //     "locales"
            // ],
            // es importante que el almacen tenga el Id 1
            // evita mostrar el almacen
            // where: (`locales.tipo_local = "tienda"`)
            where: { tipo_local: "tienda" }
            // tipo_local: "tienda" ,
            // where: (`locales.tipo_local = "tienda"`)
        });

        return {
            success: "Lista registros encontrados",
            data
        }
    }

    async getAlmacenes(){
        const data = await this.localesRepo.find({
            // es importante que el almacen tenga el Id 1
            // evita mostrar el tiendas
            where: { tipo_local: "almacen" }
            // where: (`locales.tipo_local = "almacen"`)
        });
        return {
            success: "Lista registros encontrados",
            data
        }
    }



    async getOne(id:number){
        const data = await this.localesRepo.findOne(id,{
            relations: ["localesStock", "localesStock.productos"]
        });
        return {
            success: "Registro encontrado",
            data
        }
    }


    async getLocal(id:number){
        const data = await this.localesRepo.findOne(id);
        return {
            success: "Local encontrado",
            data
        }
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Locales>> {
        return paginate<Locales>(this.localesRepo, options, {
            relations: ["localesStock", "localesStock.productos"],
            order: { id: "DESC" }
        });
    }
    
    async post(payload:CreateLocalesDto){

        const elemento = await this.localesRepo.create(payload);
        const data:Locales = await this.localesRepo.save(elemento)

        return {
            success: "Registro creado",
            data
        }
    }

    async put(id:number, payload:UpdateLocalesDto){

        const elemento = await this.localesRepo.findOne(id);

        await this.localesRepo.merge(elemento, payload);
        const data:Locales = await this.localesRepo.save(elemento)

        return{
            success: "Registro actualizado",
            data
        }

    }

    async delete(id:number){
        await this.localesRepo.delete(id);
        return { success: "Registro eliminado" }
    }

    // async getAlmacemProdutos(options: IPaginationOptions):Promise<Pagination<Locales>>{
        
    //     return paginate<Locales>(this.localesRepo, options, {
    //         relations: ["localesStock", "localesStock.productos"],
    //         order: { id: "DESC" },
    //         where: (`locales.id = 1`),
    //     });
        
    // }

    


}
