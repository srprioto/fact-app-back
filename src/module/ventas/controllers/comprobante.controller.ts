import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, DefaultValuePipe, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Comprobante } from '../entities/comprobante.entity';
import { ComprobanteService } from '../services/comprobante.service';


@Controller('comprobante')
export class ComprobanteController {

    constructor(
        private comprobanteService:ComprobanteService
    ){}

    @Get("paginate/:value/:idLocal/:inicio/:fin")
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number = 12,
        @Param('value') value:string,
        @Param('idLocal') idLocal:string,
        @Param('inicio') inicio:string,
        @Param('fin') fin:string,
        // @Param('tiendas') tiendas:number,
    ): Promise<Pagination<Comprobante>> {
        limit = limit > 100 ? 100 : limit;
        return this.comprobanteService.paginateFilter(value, idLocal, inicio, fin, { // ACTUALIZAR DATOS A COMPROBNATE
            page,
            limit,
            route: `/comprobante/paginate/${value}/${idLocal}/${inicio}/${fin}`
        });
    }


    @Post('search/:idLocal')
    searchData(@Body() payload:any, @Param('idLocal') idLocal:string){
        return this.comprobanteService.searchData(payload.value, idLocal);
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.comprobanteService.getOne(id);
    }

    @Post('reenviar')
    postReenviar(@Body() payload:any){
        return this.comprobanteService.reenviarComprobante(payload);
    }

    // @Post('anular')
    // postAnular(@Body() payload:any){
    //     return this.comprobanteService.anularComprobante(payload);
    // }
    

    // @Post("comprobate-sunat")
    // postComprobanteSunat(@Body() payload:any){
    //     return this.facturasService.enviarComprobanteSunat(payload);
    // }


    // @Post("enviar-correo")
    // postEnviarEmail(@Body() payload:any){
    //     return this.facturasService.facturaEnviarCorreo(payload);
    // }

    // @Get()
    // getAll(){
    //     // return this.facturasService.getAll();
    // }

    // @Get(':id')
    // getOne(@Param('id', ParseIntPipe) id:number){
    //     // return this.facturasService.getOne(id);
    // }

    // @Put(':id')
    // put(@Param('id', ParseIntPipe) id:number, @Body() payload:any){
    //     // return this.facturasService.put(id, payload);
    // }

    // @Delete(':id')
    // delete(@Param('id', ParseIntPipe) id:number){
    //     // return this.facturasService.delete(id);
    // }

    // @Post('search')
    // searchData(@Body() payload:any){
    //     // return this.facturasService.searchData(payload.value);
    // }

}
