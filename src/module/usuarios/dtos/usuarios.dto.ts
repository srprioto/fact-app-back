import {
    IsString,
    IsNumber,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsEmpty
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

export class CreateUsuariosDto{

    @IsString()
    @IsNotEmpty()
    nombre:string;

    @IsString()
    @IsNotEmpty()
    documento:string;

    @IsString()
    // @IsNotEmpty()
    direccion:string;

    @IsString()
    // @IsNotEmpty()
    telefono:string;

    @IsNumber()
    @IsOptional()
    edad:number;
    
    // @IsEmail()
    @IsString()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    password:string;
    
    @IsNumber()
    @IsNotEmpty()
    rolesId:number;

    @IsNumber()
    @IsOptional()
    localesId:number;

}


export class UpdateUsuariosDto extends PartialType(CreateUsuariosDto){}