import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, DefaultValuePipe, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateCajaDto, UpdateCajaDto } from '../dtos/caja.dto';
import { Caja } from '../entities/caja.entity';

import { CajaService } from '../services/caja.service';

@Controller('caja')
export class CajaController {
    constructor(
        private cajaService:CajaService
    ){}

    @Get(":idLocal/filtro")
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number = 12,
        @Param('idLocal') idLocal:string,
        // @Param('inicio') inicio:string,
        // @Param('fin') fin:string,
    ): Promise<Pagination<Caja>> {
        limit = limit > 100 ? 100 : limit;
        return this.cajaService.paginateFilter(idLocal, {
            page,
            limit,
            route: `/caja/${idLocal}/filtro`
        });
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.cajaService.getOne(id);
    }

    @Post('abrir-caja')
    getAbrirCaja(@Body() payload:CreateCajaDto){
        return this.cajaService.abrirCaja(payload);
    }

    @Get('verificar-caja/:id')
    getVerificarCaja(@Param('id', ParseIntPipe) id:number){
        return this.cajaService.verificarCajaAbierta(id);
    }

    @Put('cerrar-caja/:id')
    putCerrarCaja(@Param('id', ParseIntPipe) id:number, @Body() payload:UpdateCajaDto){
        return this.cajaService.cerrarCaja(id, payload);
    }

    @Get('local-caja-ingresos/:id')
    getLocalCajaIngresos(@Param('id', ParseIntPipe) id:number){
        return this.cajaService.localCajaIngresos(id);
    }

    // @Get('search/:value')
    // searchData(@Param('value') value:string){
    //     return this.cajaService.searchData(value);
    // }

}

// @Put(':id')
// put(@Param('id', ParseIntPipe) id:number, @Body() payload:UpdateCajaDto){
//     return this.cajaService.put(id, payload);
// }

// @Delete(':id')
// delete(@Param('id', ParseIntPipe) id:number){
//     return this.cajaService.delete(id);
// }