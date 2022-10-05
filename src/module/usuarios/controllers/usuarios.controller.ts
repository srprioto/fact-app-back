import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, DefaultValuePipe, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { UsuariosService } from '../services/usuarios.service';
import { CreateUsuariosDto, UpdateUsuariosDto } from '../dtos/usuarios.dto';
import { Usuarios } from '../entities/usuarios.entity';

@Controller('usuarios')
export class UsuariosController {

    constructor(
        private usuariosService: UsuariosService
    ) {}

    // @Get()
    // getAll(){
    //     return this.usuariosService.getAll();
    // }

    @Get()
    async getPaginate(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<Usuarios>> {
        limit = limit > 100 ? 100 : limit;
        return this.usuariosService.paginate({
            page,
            limit,
            route: '/usuarios'
        });
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.usuariosService.getOne(id);
    }

    @Post()
    post(@Body() payload:CreateUsuariosDto){
        return this.usuariosService.post(payload);
    }

    @Put(':id')
    put(@Param('id', ParseIntPipe) id:number, @Body() payload:UpdateUsuariosDto){
        return this.usuariosService.put(id, payload);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number){
        return this.usuariosService.delete(id);
    }

    @Post('search')
    searchData(@Body() payload:any){
        return this.usuariosService.searchData(payload.value);
    }

}
