import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { IngresosEgresosDto, IngresosEgresosEditDto } from '../dtos/ingresos-egresos.dto';
import { IngresosEgresos } from '../entities/ingresos_egresos.entity';
import { IngresosEgresosService } from '../services/ingresos-egresos.service';

@Controller('ingresos-egresos')
export class IngresosEgresosController {

    constructor(
        private ingresosEgresosService:IngresosEgresosService
    ){}

    @Get("paginate/:idLocal/:fechaInicio/:fechaFin")
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page:number = 1,
        @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit:number = 12,
        @Param('idLocal') idLocal:string,
        @Param('fechaInicio') fechaInicio:string,
        @Param('fechaFin') fechaFin:string
    ):Promise<Pagination<IngresosEgresos>> {
        limit = limit > 100 ? 100 : limit;
        return this.ingresosEgresosService.paginate(
            idLocal, 
            {fechaInicio, fechaFin}, 
            { page, limit, route: `/ingresos-egresos/paginate/${idLocal}/${fechaInicio}/${fechaFin}`}
        );
    }


    @Post('search')
    searchData(@Body() payload:any){        
        return this.ingresosEgresosService.searchData(payload.value);
    }


    @Post()
    postCreate(@Body() payload:IngresosEgresosDto){
        return this.ingresosEgresosService.create(payload);
    }


    @Put(':id')
    put(@Param('id', ParseIntPipe) id:number, @Body() payload:IngresosEgresosEditDto){
        return this.ingresosEgresosService.put(id, payload);
    }


    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number){
        return this.ingresosEgresosService.delete(id);
    }

}
