import {
    IsString,
    IsNumber,
    IsNotEmpty
} from 'class-validator';

import { CreateTransaccionDetallesDto } from './transaccion_detalles.dto';

export class CreateTransaccionesDto {

    @IsString()
    descripcion:string;
    
    @IsNumber()
    @IsNotEmpty()
    localOrigen:number;
    
    @IsNumber()
    @IsNotEmpty()
    localDestino:number;
    
    @IsNumber()
    @IsNotEmpty()
    usuarioEnvia:number;
    
    @IsNotEmpty()
    @IsNotEmpty()
    detalleTransferencia:CreateTransaccionDetallesDto;

}
