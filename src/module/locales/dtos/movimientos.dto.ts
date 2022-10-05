import {
    IsString,
    IsNumber,
    IsNotEmpty
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

export class CreateMovimientosDto {

    @IsString()
    observaciones:string;

    // @IsString()
    // tipo:string;
    
    @IsNumber()
    @IsNotEmpty()
    subtotal:number;

    @IsNumber()
    costo_transporte:number;

    @IsNumber()
    costo_otros:number;

    @IsNumber()
    @IsNotEmpty()
    total:number;

    // @IsString()
    // origen:string;

    // @IsString()
    // destino:string;

}

export class UpdateMovimientosDto extends PartialType(CreateMovimientosDto) {}