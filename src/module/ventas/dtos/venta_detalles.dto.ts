import {
    IsString,
    IsNumber,
    IsNotEmpty,
    IsBoolean
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';
// import { EstadoVentaDetalle } from '../entities/venta_detalles.entity';


export interface CreateVentaDetalles {
    cantidad_venta:number;
    descuento:number;
    forzar_venta:boolean;
    precio_venta:number;
    precio_parcial:number;
    venta_negativa:number;
    // estado_venta_detalle:any;
    productosId:number;
}


export class CreateVentaDetallesDto{

    @IsNumber()
    @IsNotEmpty()
    cantidad_venta:number;

    @IsNumber()
    descuento:number|string;

    @IsBoolean()
    @IsNotEmpty()
    forzar_venta:boolean;

    @IsNumber()
    @IsNotEmpty()
    precio_venta:number;
    
    @IsNumber()
    @IsNotEmpty()
    precio_parcial:number;
    
    @IsNumber()
    venta_negativa:number;


    // @IsNotEmpty()
    // @IsString()
    // estado_venta_detalle:string;

    
    @IsNumber()
    @IsNotEmpty()
    productosId:number;
    
    @IsNumber()
    @IsNotEmpty()
    ventasId:number;
}

export class UpdateVentaDetallesDto extends PartialType(CreateVentaDetallesDto){}