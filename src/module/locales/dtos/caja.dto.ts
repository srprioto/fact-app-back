import { IsNumber, IsPositive, IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

// import { PartialType } from '@nestjs/mapped-types';

export class CreateCajaDto{

    @IsNumber()
    @IsPositive()
    monto_apertura:number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    localId:number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    usuarioAbreId:number;

}

// export class UpdateCajaDto extends PartialType(CreateCajaDto) {}
export class UpdateCajaDto {
    
    @IsBoolean()
    estado_caja:boolean;

    // @IsNumber()
    // @IsNotEmpty()
    // monto_efectivo:number;

    @IsNumber()
    @IsOptional()
    cantidad_diferencia?:number;

    @IsString()
    @IsOptional()
    nota_observacion?:string;

    @IsNumber()
    @IsNotEmpty()
    localId:number;

    @IsNumber()    
    @IsNotEmpty()
    usuarioCierraId:number;

}