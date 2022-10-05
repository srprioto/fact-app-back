import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './module/productos/productos.module';
import { UsuariosModule } from './module/usuarios/usuarios.module';
import { VentasModule } from './module/ventas/ventas.module';
import { LocalesModule } from './module/locales/locales.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

const confModule = ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true
})

@Module({
  imports: [confModule, ProductosModule, UsuariosModule, VentasModule, LocalesModule, DatabaseModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
