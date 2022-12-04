import { 
    Body, 
    Controller, 
    Get, 
    Post, 
    // Param, 
    // ParseIntPipe, 
    // Put, 
    // Query, 
    // Delete, 
    // UseGuards, 
    // DefaultValuePipe, 
    // Res 
} from '@nestjs/common';
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

}
