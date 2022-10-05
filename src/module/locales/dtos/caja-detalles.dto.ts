import { IsNumber, IsPositive, Min, IsString } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

export class CreateCajaDetalesDto{

    @IsNumber()
    monto_movimiento:number;

    @IsString()
    descripcion:string;

    @IsNumber()
    cajaId:number;

    @IsNumber()
    usuarioId:number;

}

export class UpdateCajaDetalesDto extends PartialType(CreateCajaDetalesDto) {}