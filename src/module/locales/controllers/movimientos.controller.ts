import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, DefaultValuePipe } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { CreateMovimientosDto, UpdateMovimientosDto } from '../dtos/movimientos.dto';
import { Movimientos } from '../entities/movimientos.entity';
import { MovimientosService } from '../services/movimientos.service';

@Controller('movimientos')
export class MovimientosController {
    
    constructor(
        private movimientosService:MovimientosService
    ){}

    @Get()
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number = 12,
    ): Promise<Pagination<Movimientos>> {
        limit = limit > 100 ? 100 : limit;
        return this.movimientosService.paginate({
            page,
            limit,
            // route: `/productos`,
            route: `/movimientos`
        });
    }

    // @Get()
    // getAll(){
    //     return this.movimientosService.getAll();
    // }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.movimientosService.getOne(id);
    }

    @Post()
    post(@Body() payload:CreateMovimientosDto){
        return this.movimientosService.post(payload);
    }

    @Put(':id')
    put(@Param('id', ParseIntPipe) id:number, @Body() payload:UpdateMovimientosDto){
        return this.movimientosService.put(id, payload);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number){
        return this.movimientosService.delete(id);
    }

    
    @Post("ingreso")
    ingresoProductos(@Body() payload:any){ // ok
        return this.movimientosService.anadirProductos(payload);
    }

    @Post('search')
    searchData(@Body() payload:any){
        return this.movimientosService.searchData(payload.value);
    }


}
