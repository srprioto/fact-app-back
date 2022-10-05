import { IsString, IsNumber, IsNotEmpty, IsPositive, IsOptional, Min, IsBoolean } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

export class CreateProductosDto{

    @IsBoolean()
    @IsOptional()
    switchCrear:boolean;

    @IsString()
    @IsOptional()
    codigo:string;

    @IsString()
    @IsNotEmpty()
    nombre:string;

    @IsString()
    descripcion:string;

    @IsString()
    @IsOptional()
    marca:string;

    @IsString()
    @IsOptional()
    color:string;

    @IsString()
    @IsOptional()
    talla:string;

    @IsNumber()
    @IsOptional()
    precio_compra:number;

    @IsNumber()
    @IsOptional()
    precio_venta_1:number;

    @IsNumber()
    @IsOptional()
    precio_venta_2:number;

    @IsNumber()
    @IsOptional()
    precio_venta_3:number;

    @IsNumber()
    @IsOptional()
    categoriasId:number;


    // @IsNumber()
    // @IsPositive()
    // cantidad:number;

    // @IsNumber()
    // @IsPositive()
    // precioVentaId:number;

}

export class UpdateProductosDto extends PartialType(CreateProductosDto){ }

export class CreateProductosDtoCompleto{

    @IsString()
    @IsOptional()
    codigo:string;

    @IsString()
    @IsNotEmpty()
    nombre:string;

    @IsString()
    descripcion:string;

    @IsString()
    @IsOptional()
    marca:string;

    @IsString()
    @IsOptional()
    color:string;

    @IsString()
    @IsOptional()
    talla:string;

    @IsNumber()
    @IsOptional()
    precio_compra:number;

    @IsNumber()
    @IsOptional()
    precio_venta_1:number;

    @IsNumber()
    @IsOptional()
    precio_venta_2:number;

    @IsNumber()
    @IsOptional()
    precio_venta_3:number;

    @IsNumber()
    @IsOptional()
    categoriasId:number;


    // @IsNumber()
    // @IsPositive()
    // cantidad:number;

    // @IsNumber()
    // @IsPositive()
    // precioVentaId:number;

}