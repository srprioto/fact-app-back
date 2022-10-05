import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository, Like, Between, Not } from 'typeorm';
import { Ventas } from '../entities/ventas.entity';

@Injectable()
export class CotizacionesService {
    constructor(
        @InjectRepository(Ventas) private ventasRepo:Repository<Ventas>,
    ){ }

    async paginateFilter(idLocal:string = "_", options: IPaginationOptions): Promise<Pagination<Ventas>> {

        const where:any = {
            estado_venta: "cotizacion"
        };

        // if (filtro != "_") {
        //     where.estado_venta = filtro;
        // }
        if (idLocal != "_") {
            where.locales = idLocal;
        }

        return paginate<Ventas>(this.ventasRepo, options, {
            relations: ["locales", "clientes"],
            order: { id: "DESC" },
            where: where
        });
    
    }


    async searchData(value:string, idLocal:string){
        // corregir aqui

        const where:any = {
            codigo_venta: Like(`%${value}%`),
            estado_venta: "cotizacion"
        };

        if (idLocal != "_") {
            where.locales = idLocal;
        }

        const data = await this.ventasRepo.find({
            where: [
                where
            ]
        });

        return data;
    }


}
