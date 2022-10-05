import {
    IsString,
    IsNumber,
    IsNotEmpty
} from 'class-validator';

export class CreateTransaccionDetallesDto {

    @IsString()
    productoNombre:string;

    @IsNumber()
    @IsNotEmpty()
    cantidad:number;

    @IsNumber()
    @IsNotEmpty()
    productosId:number;

}