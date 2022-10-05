import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuariosController } from './controllers/usuarios.controller';
import { RolesController } from './controllers/roles.controller';

import { UsuariosService } from './services/usuarios.service';
import { RolesService } from './services/roles.service';

import { Usuarios } from './entities/usuarios.entity';
import { Roles } from './entities/roles.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Usuarios, Roles])],
    controllers: [UsuariosController, RolesController],
    providers: [UsuariosService, RolesService],
    exports: [TypeOrmModule, UsuariosService]
})
export class UsuariosModule {}
