import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { CreateCategoriasDto, UpdateCategoriasDto } from '../dtos/categorias.dto';
import { CategoriasService } from '../services/categorias.service';

@Controller('categorias')
export class CategoriasController {

    constructor(
        private categoriasService:CategoriasService
    ){}

    @Get()
    getAll(){
        return this.categoriasService.getAll();
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.categoriasService.getOne(id);
    }

    @Post()
    post(@Body() payload:CreateCategoriasDto){
        return this.categoriasService.post(payload);
    }

    @Put(':id')
    put(@Param('id', ParseIntPipe) id:number, @Body() payload:UpdateCategoriasDto){
        return this.categoriasService.put(id, payload);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number){
        return this.categoriasService.delete(id);
    }

}
