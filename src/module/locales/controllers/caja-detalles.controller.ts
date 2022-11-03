import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateCajaDetalesDto } from '../dtos/caja-detalles.dto';
import { CajaDetallesService } from '../services/caja-detalles.service';


@Controller('caja-detalles')
export class CajaDetallesController {

    constructor(
        private cajaDetallesService:CajaDetallesService
    ){}

    @Post()
    post(@Body() payload:CreateCajaDetalesDto){
        return this.cajaDetallesService.post(payload);
    }
    
    @Put(':id')
    put(@Param('id', ParseIntPipe) id:number, @Body() payload:any){
        return this.cajaDetallesService.eliminarCajaDetalles(id, payload);
    }

}
