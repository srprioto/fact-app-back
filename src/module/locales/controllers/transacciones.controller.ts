import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, DefaultValuePipe, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { CreateTransaccionesDto } from '../dtos/transacciones.dto';
import { TransaccionesService } from '../services/transacciones.service';
import { Transacciones } from '../entities/transacciones.entity';


@Controller('transacciones')
export class TransaccionesController {

    constructor(
        private transaccionesService:TransaccionesService
    ){}

    @Get("resumen-transacciones") // ok
    getAll(){
        return this.transaccionesService.resumenTransacciones();
    }


    @Get(":value/filtro") // ok
    async paginateFiltro(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @Param('value') value:string
    ): Promise<Pagination<Transacciones>> {
        limit = limit > 100 ? 100 : limit;
        return this.transaccionesService.paginateFiltro(value, {
            page,
            limit,
            route: `/transacciones/${value}/filtro`
        });
        
    }


    @Get(':id') // ok
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.transaccionesService.getOne(id);
    }


    @Get(':id/locales') // ok
    transferenciaLocales(@Param('id', ParseIntPipe) id:number){
        return this.transaccionesService.getTransferenciaLocales(id);
    }

    @Post() // ok
    postCrearTransaccion(@Body() payload:CreateTransaccionesDto){        
        return this.transaccionesService.crearTransaccion(payload);
    }


    @Put("confirmar/:id") // ok
    actualizarTrasaccion(@Param('id', ParseIntPipe) id:number, @Body() payload:any){
        return this.transaccionesService.actualizarTransaccion(id, payload);
    }

    @Post('search')
    searchData(@Body() payload:any){
        return this.transaccionesService.searchData(payload.value);
    }

    @Post("transaccion/corregir")
    corregirTransaccion(@Body() payload:any){
        return this.transaccionesService.corregirTransfernecia(payload);
    }

}




// @Put(':id')
// put(@Param('id', ParseIntPipe) id:number, @Body() payload:any){
//     // return this.proveedoresService.put(id, payload);
// }

// @Delete(':id')
// delete(@Param('id', ParseIntPipe) id:number){
//     return this.transaccionesService.delete(id);
// }