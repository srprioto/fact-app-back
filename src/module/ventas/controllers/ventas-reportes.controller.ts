import { 
    Body, 
    Controller, 
    DefaultValuePipe, 
    Get, 
    ParseIntPipe, 
    Post,
    Query, 
    // Param, 
    // ParseIntPipe, 
    // Put, 
    // Query, 
    // Delete, 
    // UseGuards, 
    // DefaultValuePipe, 
    // Res 
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
// import { Pagination } from 'nestjs-typeorm-paginate';

// import { AnularVentaDto, CreateVentasDto, UpdateVentasDto } from '../dtos/ventas.dto';
// import { Ventas } from '../entities/ventas.entity';
import { VentasReportesService } from '../services/ventas-reportes.service';


@Controller('ventas-reportes')
export class VentasReportesController {
    constructor(
        private ventasReportesService:VentasReportesService
    ){}

    @Get('ingresos_ventas_general')
    postIngresosVentasGeneral(){
        return this.ventasReportesService.reporteIngresosVentas();
    }

    @Post('reporte_ingresos_ventas')
    postReporteIngresosVentas(@Body() payload:any){
        return this.ventasReportesService.registroGananciasMes(payload);
    }

    @Post('ganancias_reporte_dia')
    postGananciasReporteDia(@Body() payload:any){
        return this.ventasReportesService.gananciasReporteDia(payload);
    }

    @Post('top_productos_vendidos')
    getTopProductosVendidos(@Body() payload:any){
        return this.ventasReportesService.topProductosVendidos(payload);
    }

    @Post('top_productos_sin_ventas')
    getTopProductosSinVent(@Body() payload:any){
        return this.ventasReportesService.topProductosSinVentas(payload);
    }


    // @Get('top_productos_vendidos')
    // async getPaginate(
    //     @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    //     @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    // ): Promise<Pagination<any>> {
    //     limit = limit > 100 ? 100 : limit;
    //     return this.ventasReportesService.topProductosVendidos({
    //         page,
    //         limit,
    //         route: '/ventas-reportes/top_productos_vendidos'
    //     });
    // }


}
