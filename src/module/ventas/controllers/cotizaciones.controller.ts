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
import { Ventas } from '../entities/ventas.entity';
import { CotizacionesService } from '../services/cotizaciones.service';

@Controller('cotizaciones')
export class CotizacionesController {

    constructor(
        private cotizacionesService:CotizacionesService
    ){}

    
    @Get("paginate/:idLocal")
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number = 12,
        @Param('idLocal') idLocal:string,
    ): Promise<Pagination<Ventas>> {
        limit = limit > 100 ? 100 : limit;
        return this.cotizacionesService.paginateFilter(idLocal, {
            page,
            limit,
            route: `/cotizaciones/paginate/${idLocal}`
        });
    }


    @Post('search/:idLocal')
    searchData(@Body() payload:any, @Param('idLocal') idLocal:string){
        return this.cotizacionesService.searchData(payload.value, idLocal);
    }



}
