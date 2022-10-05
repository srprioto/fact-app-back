// import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

// import { CreatePrecioVentasDto, UpdatePrecioVentasDto } from '../dtos/precio_ventas.dto';
// import { PrecioVentasService } from '../services/precio-ventas.service';

// @Controller('precio-ventas')
// export class PrecioVentasController {

//     constructor(
//         private precioVentasService:PrecioVentasService
//     ){}


//     @Get()
//     getAll(){
//         return this.precioVentasService.getAll();
//     }

//     @Get(':id')
//     getOne(@Param('id', ParseIntPipe) id:number){
//         return this.precioVentasService.getOne(id);
//     }

//     @Post()
//     post(@Body() payload:CreatePrecioVentasDto){
//         return this.precioVentasService.post(payload);
//     }

//     @Put(':id')
//     put(@Param('id', ParseIntPipe) id:number, @Body() payload:UpdatePrecioVentasDto){
//         return this.precioVentasService.put(id, payload);
//     }

//     @Delete(':id')
//     delete(@Param('id', ParseIntPipe) id:number){
//         return this.precioVentasService.delete(id);
//     }

// }
