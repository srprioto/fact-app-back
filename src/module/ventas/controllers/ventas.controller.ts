import { 
    Body, 
    Controller, 
    Get, 
    Param, 
    ParseIntPipe, 
    Post, 
    Put, 
    Query, 
    Delete, 
    UseGuards, 
    DefaultValuePipe, 
    Res 
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { AnularVentaDto, CreateVentasDto, UpdateVentasDto } from '../dtos/ventas.dto';
import { Ventas } from '../entities/ventas.entity';
import { VentasService } from '../services/ventas.service';

// import xl from 'excel4node';

@Controller('ventas')
export class VentasController {

    constructor(
        private ventasService:VentasService
    ){}

    @Get("paginate/:value/:idLocal/:inicio/:fin")
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number = 15,
        @Param('value') value:string,
        @Param('idLocal') idLocal:string,
        @Param('inicio') inicio:string,
        @Param('fin') fin:string,
        // @Param('tiendas') tiendas:number,
    ): Promise<Pagination<Ventas>> {
        limit = limit > 100 ? 100 : limit;
        return this.ventasService.paginateFilter(value, idLocal, inicio, fin, {
            page,
            limit,
            route: `/ventas/paginate/${value}/${idLocal}/${inicio}/${fin}`
        });
    }

    @Post('search/:idLocal')
    searchData(@Body() payload:any, @Param('idLocal') idLocal:string){
        return this.ventasService.searchData(payload.value, idLocal);
    }

    @Get()
    getAll(){
        return this.ventasService.getAll();
    }

    @Get("pedidos/:id")
    getVentasPedidos(@Param('id', ParseIntPipe) id:number){
        return this.ventasService.ventasPedidos(id);
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.ventasService.getOne(id);
    }

    @Post()
    post(@Body() payload:CreateVentasDto){
        return this.ventasService.crearVenta(payload);
    }

    @Put(':id')
    put(@Param('id', ParseIntPipe) id:number, @Body() payload:UpdateVentasDto){
        return this.ventasService.confirmarVenta(id, payload);
    }

    @Put('cambiar_tipo_venta/:id')
    putCambiarTipoVenta(@Param('id', ParseIntPipe) id:number, @Body() payload:any){
        return this.ventasService.cambiarTipoVenta(id, payload);
    }

    @Put('anular/:id')
    putAnularVenta(@Param('id', ParseIntPipe) id:number, @Body() payload:AnularVentaDto){ 
        return this.ventasService.anularVenta(id, payload);
    }

    @Post('search/local/:idLocal')
    searchDataLocal(@Body() payload:any, @Param('idLocal') idLocal:number){
        return this.ventasService.searchDataLocal(payload.value, idLocal);
    }

    @Put('reporte/habilitar-venta/:id')
    habilitarVenta(@Param('id', ParseIntPipe) id:number, @Body() payload:any){
        return this.ventasService.habilitarVenta(id, payload);
    }

    // reportes
    @Get('reporte/download')
    downloadReporte(@Res() res){
        return this.ventasService.downloadReporteVentas(res);
    }

    @Get('reporte/estadisticas')
    estadisticas(){
        return this.ventasService.estadisticasGenerales();
    }

    @Get('reporte/ventas-semana')
    estadisticasVentaSemana(){
        return this.ventasService.ventasSemana();
    }

    @Get('reporte/ingresos-semana/:id')
    estadisticasIngresosSemana(@Param('id', ParseIntPipe) id:number){
        return this.ventasService.ingresosSemana(id);
    }

    @Get('reporte/ingresos-dia-local/:id')
    getIngresosDiaLocal(@Param('id', ParseIntPipe) id:number){
        return this.ventasService.ingresosDiariosLocal(id);
    }


    

    // @Get("pruebas/solo")
    // getPruebas(){
    //     return this.ventasService.eliminarEnviadosRechazados();
    // }


}



// @Put(':id')
// put(@Param('id', ParseIntPipe) id:number, @Body() payload:UpdateVentasDto){
//     return this.ventasService.put(id, payload);
// }

// @Delete(':id')
// delete(@Param('id', ParseIntPipe) id:number){
//     return this.ventasService.delete(id);
// }