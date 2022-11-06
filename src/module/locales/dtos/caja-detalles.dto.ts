import { IsNumber, IsPositive, Min, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCajaDetalesDto{

    @IsNumber()
    monto_movimiento:number;

    @IsString()
    descripcion:string;

    @IsString()
    tipo_movimiento:string;

    @IsString()
    forma_pago:string;

    @IsNumber()
    cajaId:number;

    @IsNumber()
    usuarioId:number;

}

export class UpdateCajaDetalesDto extends PartialType(CreateCajaDetalesDto) {}

export const tipoMovimiento = {
    credito: "Credito",
    otrosMovimientos: "Otros movimientos",
    anulacion1: "Anulacion dia",
    anulacion2: "Anulacion pasada"
}

