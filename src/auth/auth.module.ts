import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UsuariosModule } from 'src/module/usuarios/usuarios.module';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [UsuariosModule, PassportModule, JwtModule.registerAsync({ 
        useFactory: () => { 
            return {
                secret: process.env.JWT_SECRET,
                signOptions: {
                    expiresIn: '10d'
                }
            }
        }
    })],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
