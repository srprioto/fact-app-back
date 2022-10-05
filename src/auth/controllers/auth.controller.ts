import { Controller, Post, Req, UseGuards,  } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';
import { Usuarios } from 'src/module/usuarios/entities/usuarios.entity';


@Controller('login')
export class AuthController {

    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post()
    login(@Req() req:Request){
        const user = req.user as Usuarios;
        return this.authService.generateJWT(user);
    }
}