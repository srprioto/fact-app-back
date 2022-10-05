import {
    IsString,
    IsNumber,
    IsNotEmpty    
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

export class CreateMovimientoDetallesDto {

    @IsString()
    @IsNotEmpty()
    descripcion:string;
    
    @IsString()
    @IsNotEmpty()
    cantidad:number;

    @IsString()
    @IsNotEmpty()
    precio_unidad:number;

    @IsString()
    @IsNotEmpty()
    precio_parcial:number;



    @IsNumber()
    productosId:number;
    
    @IsNumber()
    localesStockId:number;
    
    @IsNumber()
    movimientosId:number;

    @IsNumber()
    proveedoresId:number;

}

export class UpdateMovimientoDetallesDto extends PartialType(CreateMovimientoDetallesDto){}

export interface MovimientoDetallesIngreso {
    descripcion:string;
    cantidad:number;
    precio_unidad:number;
    precio_parcial:number;
}