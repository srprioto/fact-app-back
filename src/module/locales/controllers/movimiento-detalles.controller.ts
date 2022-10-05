import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { CreateMovimientoDetallesDto, UpdateMovimientoDetallesDto } from '../dtos/movimiento_detalles.dto';
import { MovimientoDetallesService } from '../services/movimiento-detalles.service';


@Controller('movimiento-detalles')
export class MovimientoDetallesController {

    constructor(
        private movimientoDetallesService:MovimientoDetallesService
    ){}

    @Get()
    getAll(){
        return this.movimientoDetallesService.getAll();
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.movimientoDetallesService.getOne(id);
    }

    @Post()
    post(@Body() payload:CreateMovimientoDetallesDto){
        return this.movimientoDetallesService.post(payload);
    }

    @Put(':id')
    put(@Param('id', ParseIntPipe) id:number, @Body() payload:UpdateMovimientoDetallesDto){
        return this.movimientoDetallesService.put(id, payload);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number){
        return this.movimientoDetallesService.delete(id);
    }

}
