import {
    IsString,
    IsNumber,
    // IsNotEmpty,
    IsBoolean,
    IsOptional,
    // IsArray
} from 'class-validator';

export class CreateTicketDto {
    
    @IsString()
    titulo:string;

    @IsString()
    descripcion:string;

    @IsOptional()
    @IsString()
    info_adicional?:string;

    @IsString()
    tipo:string;
    
    @IsBoolean()
    estado:boolean;
    
    @IsOptional()
    @IsString()
    relacion?:string;


    @IsOptional()
    @IsNumber()
    local?:number;
    
    @IsOptional()
    @IsNumber()
    rol?:number;

    // @IsOptional()
    // @IsNumber()
    // comprobante?:number;

}




// export interface crearTicket {
//     titulo:string;
//     descripcion:string;
//     info_adicional:string;
//     tipo:string;
//     estado:boolean;
// }