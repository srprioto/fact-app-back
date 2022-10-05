import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { VentaDetallesService } from '../services/venta-detalles.service';
import { CreateVentaDetallesDto, UpdateVentaDetallesDto } from '../dtos/venta_detalles.dto';

@Controller('venta-detalles')
export class VentaDetallesController {

    constructor(
        private ventaDetallesService:VentaDetallesService
    ){}


    @Get()
    getAll(){
        return this.ventaDetallesService.getAll();
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.ventaDetallesService.getOne(id);
    }

    @Post()
    post(@Body() payload:CreateVentaDetallesDto){
        return this.ventaDetallesService.post(payload);
    }

    @Put(':id')
    put(@Param('id', ParseIntPipe) id:number, @Body() payload:UpdateVentaDetallesDto){
        return this.ventaDetallesService.put(id, payload);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number){
        return this.ventaDetallesService.delete(id);
    }

}
