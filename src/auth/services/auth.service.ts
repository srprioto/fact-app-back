import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsuariosService } from 'src/module/usuarios/services/usuarios.service';
import { Usuarios } from 'src/module/usuarios/entities/usuarios.entity';
import { PayloadToken } from '../models/token.model';


@Injectable()
export class AuthService {

    constructor(
        private usuariosService:UsuariosService,
        private jwtService:JwtService
    ) {}

    async validateUser(email:string, password:string){
        const usuario = await this.usuariosService.findByEmail(email);
        if (usuario) {
            const isMatch = await bcrypt.compare(password, usuario.password); 
            if (isMatch) {
                return usuario;
            }
        }
        return null;
    }


    generateJWT(user:any){
        const payload:PayloadToken = {
            role: user.roles.rol,
            sub: user.id,
            name: user.nombre,
            local: {
                id: user.locales ? user.locales.id : null,
                nombre: user.locales ? user.locales.nombre : null
            }
        }
        return { 
            access_token: this.jwtService.sign(payload),
            // user
        }
    }

}