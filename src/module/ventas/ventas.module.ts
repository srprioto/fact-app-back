import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientesController } from './controllers/clientes.controller';
import { VentaDetallesController } from './controllers/venta-detalles.controller';
import { VentasController } from './controllers/ventas.controller';
import { ComprobanteController } from './controllers/comprobante.controller';

import { ClientesService } from './services/clientes.service';
import { VentaDetallesService } from './services/venta-detalles.service';
import { VentasService } from './services/ventas.service';
import { ComprobanteService } from './services/comprobante.service';
import { FormasPagoService } from './services/formas-pago.service';

import { Clientes } from './entities/clientes.entity';
import { VentaDetalles } from './entities/venta_detalles.entity';
import { Ventas } from './entities/ventas.entity';

// import { ProductosModule } from '../productos/productos.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { LocalesModule } from '../locales/locales.module';
import { FormasPago } from './entities/formas_pago.entity';
import { Comprobante } from './entities/comprobante.entity';
import { ComprobanteDetalles } from './entities/comprobante_detalles.entity';
import { ComprobanteDetallesService } from './services/comprobante-detalles.service';
import { VentasProviderService } from './services/ventas-provider.service';
import { CotizacionesService } from './services/cotizaciones.service';
import { CotizacionesController } from './controllers/cotizaciones.controller';
import { Correlativos } from './entities/correlativos.entity';
import { CorrelativoService } from './services/correlativo.service';
import { CorrelativoController } from './controllers/correlativo.controller';
import { CreditoDetallesService } from './services/credito-detalles.service';
import { CreditoDetalles } from './entities/credito_detalles.entity';


@Module({
    imports: [
        // ProductosModule, 
        UsuariosModule, 
        LocalesModule,
        TypeOrmModule.forFeature([
            Clientes, 
            VentaDetalles, 
            Ventas, 
            FormasPago, 
            Comprobante,
            ComprobanteDetalles,
            Correlativos,
            CreditoDetalles
        ])
    ],
    providers: [ClientesService, VentaDetallesService, VentasService, FormasPagoService, ComprobanteService, ComprobanteDetallesService, VentasProviderService, CotizacionesService, CorrelativoService, CreditoDetallesService],
    controllers: [ClientesController, VentaDetallesController, VentasController, ComprobanteController, CotizacionesController, CorrelativoController],
    exports: [VentasService]
})
export class VentasModule {}



