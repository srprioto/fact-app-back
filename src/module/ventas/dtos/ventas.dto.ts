import {
    IsString,
    IsNumber,
    IsNotEmpty,
    IsBoolean,
    IsOptional,
    IsArray
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';
// import { CreateVentaDetallesDto } from './venta_detalles.dto';

export class CreateVentasDto{

    // @IsString()
    // @IsNotEmpty()
    // serie:string;

    @IsString()
    @IsNotEmpty()
    tipo_venta:string;
    
    @IsNumber()
    @IsNotEmpty()
    total:number;

    @IsNumber()
    @IsNotEmpty()
    subtotal:number;

    @IsString() // cambio
    observaciones:string;

    @IsNumber()
    @IsNumber()
    descuento_total:number;

    @IsNotEmpty()
    @IsString()
    estado_venta:string;

    @IsOptional()
    @IsString()
    codigo_venta:string;

    @IsString()
    forma_pago:string;
    
    @IsNotEmpty()
    ventaDetalles:any;

    @IsOptional()
    @IsBoolean()
    estado_producto:boolean;
    
    @IsOptional()
    @IsNumber()
    totalPagado:number;

    @IsOptional()
    @IsArray()
    creditoDetalles:any;

    @IsOptional()
    formasPago:any;

    @IsOptional()
    cliente:any;

    @IsNumber()
    @IsOptional()
    clienteId:number|null;

    @IsNumber()
    @IsNotEmpty()
    localId:number;

    @IsNumber()
    @IsNotEmpty()
    usuarioId:number;

    @IsOptional()
    comprobante:any;

    @IsOptional()
    envioComprobante:string|boolean;
}

export class UpdateVentasDto extends PartialType(CreateVentasDto){}

export class AnularVentaDto {
    @IsString()
    @IsNotEmpty()
    notaBaja:string;
    
    @IsNumber()  
    @IsNotEmpty()  
    usuarioId:number;

    @IsBoolean()
    @IsNotEmpty()
    afectarCaja:boolean;
}

export const tipoVenta = {
    factura: "factura",
    boleta: "boleta",
    venta_rapida: "venta rapida",
    credito: "credito",
    adelanto: "adelanto",
}

// export class UpdateVentasDto {

//     @IsNumber()
//     @IsNotEmpty()
//     total:number;

//     @IsNumber()
//     @IsNotEmpty()
//     subtotal:number;

//     @IsString()
//     observaciones:string;

//     @IsNumber()
//     descuento_total:number;

//     @IsNotEmpty()
//     @IsString()
//     estado_venta:string;

//     @IsNotEmpty()
//     @IsString()
//     codigo_venta:string;  



//     @IsNotEmpty()
//     ventaDetalles:any;

//     @IsNumber()
//     @IsNotEmpty()
//     usuarioId:number;

//     @IsOptional()
//     clienteId:number|null;

//     @IsOptional()
//     cliente:any;

//      @IsNumber()
//      @IsNotEmpty()
//      localId:number;

// }






// Fecha, correlativo (Serie+numero), codigo_comporbante (01=Factura; 03=Boleta), Nombre cliente, documento cliente(DNI o RUC), codigo_documento(00=Otro, 06=RUC, ..no recuerdo DNI), direccion, subtoal, igv, total



// @IsString()
// codigo_venta:string;

// @IsString()
// nro_factura:string;