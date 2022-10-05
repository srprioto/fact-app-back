import {
    IsString,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsNumber
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

export interface clienteDto{
    estadoCliente?:string;
    tipoDocumento:string;
    numero_documento:string;
    nombre:string;
    razonSocial:string;
    nombreComercial:string;
    ubigeo:number;

    direccion:string;
    email:string;
    telefono:string;
    codigo_pais:string;

    departamento:string;
    provincia:string;
    distrito:string;

    estado:string;
    condom:string;

    // tvia:string;
    // nvia:string;
    // czona:string;
    // tzona:string;
    // numero:number;
    // interior:string;
    // lote:string;
    // dpto:string;
    // mz:string;
    // km:string;
}

export const cliente:clienteDto = {
    estadoCliente: "",
    tipoDocumento: "",
    numero_documento: "",
    nombre: "",
    razonSocial: "",
    nombreComercial: "",
    ubigeo: 0,
    direccion: "",
    email: "",
    telefono: "",
    codigo_pais: "",
    departamento: "",
    provincia: "",
    distrito: "",
    estado: "",
    condom: "",
}


export class CreateClienteDto{

    @IsString()
    @IsOptional()
    tipoDocumento:string;
    
    @IsString()
    @IsOptional()
    razonSocial:string;

    @IsString()
    @IsOptional()
    nombreComercial:string;

    @IsString()
    @IsOptional()
    codigo_pais:string;

    @IsString()
    @IsOptional()
    departamento:string;

    @IsString()
    @IsOptional()
    provincia:string;

    @IsString()
    @IsOptional()
    distrito:string;

    @IsString()
    @IsOptional()
    nombre:string;

    @IsString()
    @IsOptional()
    numero_documento:string;

    @IsString()
    @IsOptional()
    direccion:string;

    @IsString()
    @IsOptional()
    telefono:string;

    @IsString()
    @IsOptional()
    estado_cliente:string;

    @IsString()
    @IsOptional()
    email:string;

    @IsNumber()
    @IsOptional()
    ubigeo:number;
}

export class UpdateClienteDto extends PartialType(CreateClienteDto){}

// tipos de documentos:
// 0.- TRIB.NO.DOM.SIN.RUC. DOC.
// 1.- DNI
// 4.- Carnet de extranjeria
// 6.- Reg. unico de cliente
// 7.- pasaporte
// A.- Ced diplomatica de identidad