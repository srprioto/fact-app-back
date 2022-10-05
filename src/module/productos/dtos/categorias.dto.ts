import {
    IsString,
    IsNotEmpty
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

export class CreateCategoriasDto{
    
    @IsString()
    @IsNotEmpty()
    nombre:string;

    @IsString()
    descripcion:string;
    
}

export class UpdateCategoriasDto extends PartialType(CreateCategoriasDto){}