import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

enum TipoLocal {
    almacen = "almacen",
    tienda = "tienda"
}

export class CreateLocalesDto {

    @IsString()
    @IsNotEmpty()
    nombre:string;

    @IsString()
    @IsNotEmpty()
    direccion:string;

    @IsString()
    @IsNotEmpty()
    telefono:string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(TipoLocal)
    tipo_local:TipoLocal;

}

export class UpdateLocalesDto extends PartialType(CreateLocalesDto) {}