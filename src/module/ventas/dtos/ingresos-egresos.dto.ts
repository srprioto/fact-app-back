import { PartialType } from '@nestjs/mapped-types';
import {
    IsString,
    IsNumber,
    IsNotEmpty,
    IsOptional,
    IsBoolean
} from 'class-validator';

export class IngresosEgresosDto{

    @IsNumber()
    @IsNotEmpty()
    monto:number;

    @IsString()
    descripcion:string;

    @IsBoolean()
    addLocal:boolean;

    @IsNumber()
    usuarios:number;

    @IsNumber()
    @IsOptional()
    locales:number;

}

export class IngresosEgresosEditDto extends PartialType(IngresosEgresosDto){}

export interface ingresosEgresos {
    monto:number;
    descripcion:string;
    tipo:string;
    usuarios:number;
    locales:number;
}