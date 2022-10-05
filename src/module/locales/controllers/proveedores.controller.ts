import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, DefaultValuePipe, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { CreateProveedoresDto, UpdateProveedoresDto } from '../dtos/proveedores.dto';
import { Proveedores } from '../entities/proveedores.entity';
import { ProveedoresService } from '../services/proveedores.service';

@Controller('proveedores')
export class ProveedoresController {

    constructor(
        private proveedoresService: ProveedoresService
    ){}


    // @Get()
    // getAll(){
    //     return this.proveedoresService.getAll();
    // }

    @Get()
    async getPaginate(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<Proveedores>> {
        limit = limit > 100 ? 100 : limit;
        return this.proveedoresService.paginate({
            page,
            limit,
            route: '/proveedores'
        });
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.proveedoresService.getOne(id);
    }

    @Post()
    post(@Body() payload:CreateProveedoresDto){
        return this.proveedoresService.post(payload);
    }

    @Put(':id')
    put(@Param('id', ParseIntPipe) id:number, @Body() payload:UpdateProveedoresDto){
        return this.proveedoresService.put(id, payload);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number){
        return this.proveedoresService.delete(id);
    }

    @Post('search')
    searchData(@Body() payload:any){
        return this.proveedoresService.searchData(payload.value);
    }

}
