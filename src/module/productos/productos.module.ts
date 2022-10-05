import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Categorias } from './entities/categorias.entity';
import { Productos } from './entities/productos.entity';

import { CategoriasService } from './services/categorias.service';
import { ProductosService } from './services/productos.service';

import { CategoriasController } from './controllers/categorias.controller';
import { ProductosController } from './controllers/productos.controller';
// import { LocalesModule } from '../locales/locales.module';
import { LocalesStock } from '../locales/entities/locales_stock.entity';
import { Locales } from '../locales/entities/locales.entity';

// import { UsuariosModule } from '../usuarios/usuarios.module';

// import { PrecioVentasService } from './services/precio-ventas.service';
// import { PrecioVentasController } from './controllers/precio-ventas.controller';
// import { PrecioVentas } from './entities/precio_ventas.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Categorias, Productos, LocalesStock, Locales]),
        // forwardRef(() => LocalesModule)
    ],
    providers: [CategoriasService, ProductosService],
    controllers: [CategoriasController, ProductosController],
    exports: [TypeOrmModule]
})
export class ProductosModule {}
