import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, DefaultValuePipe, Query } from '@nestjs/common';
import { CorrelativoService } from '../services/correlativo.service';

@Controller('correlativo')
export class CorrelativoController {
    constructor(
        private correlativoService:CorrelativoService
    ){ }

    @Get()
    getAll(){
        return this.correlativoService.getAll();
    }

    @Get(':id/:descripcion')
    getOne(
        @Param('id', ParseIntPipe) id:number,
        @Param('descripcion') descripcion:string
    ){
        return this.correlativoService.getOneForLocal(id, descripcion);
    }

    @Post()
    post(@Body() payload:any){
        return this.correlativoService.post(payload);
    }


}
