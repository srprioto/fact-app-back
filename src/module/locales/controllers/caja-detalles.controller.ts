import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateCajaDetalesDto } from '../dtos/caja-detalles.dto';
import { CajaDetalles } from '../entities/caja-detalles.entity';
import { CajaDetallesService } from '../services/caja-detalles.service';


@Controller('caja-detalles')
export class CajaDetallesController {

    constructor(
        private cajaDetallesService:CajaDetallesService
    ){}

    @Get("paginate/:idLocal")
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page:number = 1,
        @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit:number = 12,
        @Param('idLocal') idLocal:string
    ):Promise<Pagination<CajaDetalles>> {
        limit = limit > 100 ? 100 : limit;
        return this.cajaDetallesService.paginate(idLocal, { page, limit, route: `/caja-detalles/paginate/${idLocal}` });
    }

    @Post()
    post(@Body() payload:CreateCajaDetalesDto){
        return this.cajaDetallesService.post(payload);
    }
    
    @Put(':id')
    put(@Param('id', ParseIntPipe) id:number, @Body() payload:any){
        return this.cajaDetallesService.eliminarCajaDetalles(id, payload);
    }

}
