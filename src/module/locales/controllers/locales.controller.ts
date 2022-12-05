import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    ParseIntPipe, 
    Post, 
    Put, 
    // Query, 
    // UseGuards, 
    // DefaultValuePipe 
} from '@nestjs/common';
// import { Pagination } from 'nestjs-typeorm-paginate';

import { LocalesService } from '../services/locales.service';
import { CreateLocalesDto, UpdateLocalesDto } from '../dtos/locales.dto';


@Controller('locales')
export class LocalesController {

    constructor(
        private localesService:LocalesService
    ){}

    @Get()
    getAll(){
        return this.localesService.getAll();
    }

    @Get("locales/solo")
    getLocales(){
        return this.localesService.getLocales();
    }

    @Get("almacenes/solo")
    getAlmacenes(){
        return this.localesService.getAlmacenes();
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.localesService.getOne(id);
    }

    @Get('local/:id')
    getLocal(@Param('id', ParseIntPipe) id:number){
        return this.localesService.getLocal(id);
    }

    @Post()
    post(@Body() payload:CreateLocalesDto){
        return this.localesService.post(payload);
    }

    @Put(':id')
    put(@Param('id', ParseIntPipe) id:number, @Body() payload:UpdateLocalesDto){
        return this.localesService.put(id, payload);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number){
        return this.localesService.delete(id);
    }    

}



    // @Get("almacen/productos")
    // async index(
    //     @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    //     @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    // ): Promise<Pagination<Locales>> {
    //     limit = limit > 100 ? 100 : limit;
    //     return this.localesService.getAlmacemProdutos({
    //         page,
    //         limit,
    //         route: `/locales`
    //     });
    // }