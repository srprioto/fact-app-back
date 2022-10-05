import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, DefaultValuePipe } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { CreateClienteDto, UpdateClienteDto } from '../dtos/clientes.dto';
import { Clientes } from '../entities/clientes.entity';
import { ClientesService } from '../services/clientes.service';

@Controller('clientes')
export class ClientesController {

    constructor(
        private clientesService:ClientesService
    ){}

    @Get()
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<Clientes>> {
        limit = limit > 100 ? 100 : limit;
        return this.clientesService.paginate({
            page,
            limit,
            route: `/clientes`
        });
    }

    // @Get()
    // getAll(){
    //     return this.clientesService.getAll();
    // }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.clientesService.getOne(id);
    }

    @Post()
    post(@Body() payload:CreateClienteDto){
        return this.clientesService.post(payload);
    }

    @Post("verificar/cliente")
    verificarClientePost(@Body() payload:CreateClienteDto){
        return this.clientesService.verificarCliente(payload);
    }

    @Put(':id')
    put(@Param('id', ParseIntPipe) id:number, @Body() payload:UpdateClienteDto){
        return this.clientesService.put(id, payload);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number){
        return this.clientesService.delete(id);
    }

    @Post('search')
    searchData(@Body() payload:any){
        return this.clientesService.searchData(payload.value);
    }

    @Post("padron/search")
    getClienteExterno(@Body() payload:any){
        return this.clientesService.clientesExternos(payload);
    }
    

}
