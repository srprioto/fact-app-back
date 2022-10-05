import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { ProductosModule } from '../productos/productos.module';
import { UsuariosModule } from '../usuarios/usuarios.module';

import { LocalesStockService } from './services/locales-stock.service';
import { LocalesService } from './services/locales.service';
import { MovimientoDetallesService } from './services/movimiento-detalles.service';
import { MovimientosService } from './services/movimientos.service';
import { ProveedoresService } from './services/proveedores.service';
import { TransaccionesService } from './services/transacciones.service';
import { CajaService } from './services/caja.service';
import { CajaDetallesService } from './services/caja-detalles.service';

import { LocalesStockController } from './controllers/locales-stock.controller';
import { LocalesController } from './controllers/locales.controller';
import { MovimientoDetallesController } from './controllers/movimiento-detalles.controller';
import { MovimientosController } from './controllers/movimientos.controller';
import { ProveedoresController } from './controllers/proveedores.controller';
import { TransaccionesController } from './controllers/transacciones.controller';
import { CajaController } from './controllers/caja.controller';
import { CajaDetallesController } from './controllers/caja-detalles.controller';

import { LocalesStock } from './entities/locales_stock.entity';
import { Locales } from './entities/locales.entity';
import { MovimientoDetalles } from './entities/movimiento_detalles.entity';
import { Movimientos } from './entities/movimientos.entity';
import { Proveedores } from './entities/proveedores.entity';
import { TransaccionDetalles } from './entities/transaccion_detalle.entity';
import { Transacciones } from './entities/transacciones.entity';
import { Caja } from './entities/caja.entity';
import { CajaDetalles } from './entities/caja-detalles.entity';
import { VentasModule } from '../ventas/ventas.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([
            LocalesStock, 
            Locales, 
            MovimientoDetalles, 
            Movimientos, 
            Proveedores, 
            TransaccionDetalles, 
            Transacciones,
            Caja,
            CajaDetalles
        ]), 
        // forwardRef(() => ProductosModule),
        ProductosModule,
        UsuariosModule,
        forwardRef(() => VentasModule)
    ],
    providers: [
        LocalesStockService, 
        LocalesService, 
        MovimientoDetallesService, 
        MovimientosService, 
        ProveedoresService, 
        TransaccionesService, 
        CajaService, 
        CajaDetallesService
    ],
    controllers: [LocalesStockController, LocalesController, MovimientoDetallesController, MovimientosController, ProveedoresController, TransaccionesController, CajaController, CajaDetallesController],
    exports: [TypeOrmModule, LocalesStockService, CajaService, CajaDetallesService]
})
export class LocalesModule {}