import { Injectable } from '@nestjs/common';
import { Repository, Like, IsNull, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IngresosEgresos } from '../entities/ingresos_egresos.entity';
import { paginate, Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ingresosEgresos, IngresosEgresosDto, IngresosEgresosEditDto } from '../dtos/ingresos-egresos.dto';


@Injectable()
export class IngresosEgresosService {

    constructor(
        @InjectRepository(IngresosEgresos) private ingresosEgresosRepo:Repository<IngresosEgresos>
    ){}


    async paginate(idLocal:string, {fechaInicio, fechaFin}:any, options:IPaginationOptions):Promise<Pagination<IngresosEgresos>> {

        const where:any = {};
        if (idLocal !== "_") {
            if (idLocal === "No") {
                where.locales = IsNull();
            } else {
                where.locales = idLocal;
            }
        }

        if (fechaInicio !== "_" || fechaFin !== "_") {
            where.created_at = Between(fechaInicio, fechaFin);
        }

        return paginate<IngresosEgresos>(this.ingresosEgresosRepo, options, {
            relations: ["usuarios", "locales"],
            order: { id: "DESC" },
            where: where
        });
    }


    async searchData(value:string){
        const data = await this.ingresosEgresosRepo.find({
            where: [
                { descripcion: Like(`%${value}%`) },
                // { nombre: Like(`%${value}%`) },
                // { marca: Like(`%${value}%`) },
                // { talla: Like(`%${value}%`) }
            ]
        });
        return data;
    }


    async create(payload:IngresosEgresosDto){
        if (!payload.addLocal) {
            payload.locales = null;
        }
        const ingresoEgreso:ingresosEgresos = this.ingresosEgresosRepo.create(payload);
        ingresoEgreso.tipo = payload.monto > 0 ? "ingreso" : "egreso";
        if (Number(ingresoEgreso.monto) !== 0) {
            await this.ingresosEgresosRepo.save(ingresoEgreso);
        }
        return payload;
    }


    async put(id:number, payload:IngresosEgresosEditDto){
        if (!payload.addLocal) {
            payload.locales = null;
        }
        const ingresoEgreso = await this.ingresosEgresosRepo.findOne(id);
        ingresoEgreso.tipo = payload.monto > 0 ? "ingreso" : "egreso";
        this.ingresosEgresosRepo.merge(ingresoEgreso, payload);
        const data:ingresosEgresos = await this.ingresosEgresosRepo.save(ingresoEgreso);
        return {
            exito: "Registro actualizado",
            data
        }
    }


    async delete(id:number){
        await this.ingresosEgresosRepo.delete(id);
        return {
            exito: "Registro eliminado"            
        }
    }

}


// async paginate(
//     value:string,
//     options:IPaginationOptions
// ):Promise<Pagination<IngresosEgresos>> {
//     let where:any = [];
//     if (!!value) {
//         where = [ { descripcion: Like(`%${value}%`) } ]
//     }
//     const data = await paginate<IngresosEgresos>(this.ingresosEgresosRepo, options, {
//         order: { id: "DESC" },
//         where: where
//     });
//     return data
// }