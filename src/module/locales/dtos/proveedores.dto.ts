import {
    IsString,
    IsNumber,
    IsNotEmpty
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

export class CreateProveedoresDto{

    @IsString()
    nombre:string;

    @IsString()
    razon_social:string;

    @IsString()
    direccion:string;

    @IsString()
    telefono:string;

    @IsString()
    tel_movil:string;

    @IsString()
    tipo_documento:string;

    @IsString()
    documento:string;

    @IsString()
    nro_cuenta_bancaria:string;

    @IsString()
    nombre_banco:string;

    @IsString()
    nombre_titular:string;

    @IsString()
    email:string;
    
    @IsString()
    tipo_producto:string;
    
}

export class UpdateProveedoresDto extends PartialType(CreateProveedoresDto){}