import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    ParseIntPipe, 
    Post, 
    Put, 
    Query, 
    UseGuards, 
    DefaultValuePipe,
    Res
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';

import { CreateProductosDto, UpdateProductosDto } from '../dtos/productos.dto';
import { ProductosService } from '../services/productos.service';
import { Productos } from '../entities/productos.entity';

import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
// import { Role } from 'src/auth/models/roles.model';


// establece requisito de login y activacion de login
// los roles se encuentran en el archivo src\auth\models\roles.model.ts
// @UseGuards(AuthGuard('jwt'), RolesGuard) 
@Controller('productos')
export class ProductosController {

    constructor(
        private productosService:ProductosService
    ){}

    @Get()
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number = 12,
    ): Promise<Pagination<Productos>> {
        limit = limit > 100 ? 100 : limit;
        return this.productosService.paginate({
            page,
            limit,
            // route: `/productos`,
            route: `/productos`
        });
    }



    // @Roles(Role.ADMIN)
    // @Get("/todos")
    // getAll(){
    //     return this.productosService.getAll();
    // }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.productosService.getOne(id);
    }

    @Post()
    post(@Body() payload:CreateProductosDto){
        return this.productosService.post(payload);
    }

    @Put(':id')
    put(@Param('id', ParseIntPipe) id:number, @Body() payload:UpdateProductosDto){
        return this.productosService.put(id, payload);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number){
        return this.productosService.delete(id);
    }

    @Post('search')
    searchData(@Body() payload:any){
        return this.productosService.searchData(payload.value);
    }





    @Get("descargar/excel")
    getDescargarExcel(
        @Res() res:any
    ){
        return this.productosService.descargarExcel(res);
    }

}
