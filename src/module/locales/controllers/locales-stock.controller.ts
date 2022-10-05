import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, DefaultValuePipe } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { CreateLocalStockDto, UpdateLocalStockDto } from '../dtos/locales_stock.dto';

import { LocalesStock } from '../entities/locales_stock.entity';
import { LocalesStockService } from '../services/locales-stock.service';


@Controller('locales-stock')
export class LocalesStockController {
    constructor(
        private localesStockService:LocalesStockService
    ){}

    @Get()
    getAll(){
        return this.localesStockService.getAll();
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.localesStockService.getOne(id);
    }

    // recuperar un producto de un local
    @Get(':id/local/:idLocal') // ok
    getProductoLocal(
        @Param('id', ParseIntPipe) id:number,
        @Param('idLocal', ParseIntPipe) idLocal:number
    ){
        return this.localesStockService.getOneProductoLocal(id, idLocal);
    }


    @Post()
    post(@Body() payload:CreateLocalStockDto){
        return this.localesStockService.post(payload);
    }

    @Put(':id')
    put(@Param('id', ParseIntPipe) id:number, @Body() payload:UpdateLocalStockDto){
        return this.localesStockService.put(id, payload);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number){
        return this.localesStockService.delete(id);
    }


    @Get('stock/producto/:id')
    getStockGeneralProducto(@Param('id', ParseIntPipe) id:number){
        return this.localesStockService.stockGeneralProducto(id);
    }

    // locales
    @Get("locales/:id")
    async getLocales( // ok
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @Param('id', ParseIntPipe) id:number
    ): Promise<Pagination<LocalesStock>> {
        limit = limit > 100 ? 100 : limit;

        return this.localesStockService.getLocales(id, {
            page,
            limit,
            route: `/locales-stock/locales/${id}`
        });
    }

    @Post('locales/search/:id')
    searchLocales(@Body() payload:any, @Param('id', ParseIntPipe) id:number){
        return this.localesStockService.searchLocales(id, payload.value);
    }


    // @Post('fullstock/stock') // añade productos en cadena
    // fullStock(@Body() payload:any){
    //     return this.localesStockService.anadirFullProd(payload);
    // }

}


    // almacen
    // @Get("almacen/productos") // ok
    // async index(
    //     @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    //     @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    // ): Promise<Pagination<LocalesStock>> {
    //     limit = limit > 100 ? 100 : limit;
    //     return this.localesStockService.getAlmacen({
    //         page,
    //         limit,
    //         route: `/locales-stock/almacen/productos`
    //     });
    // }

    // @Get('search/:value')
    // searchData(@Param('value') value:string){ // ok
    //     return this.localesStockService.searchAlmacen(value);
    // }