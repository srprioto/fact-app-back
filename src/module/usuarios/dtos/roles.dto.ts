import {
    IsString,
    IsNotEmpty
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

export class CreateRolesDto{
    
    @IsString()
    @IsNotEmpty()
    descripcion:string;

    @IsString()
    @IsNotEmpty()
    rol:string;

}

export class UpdateRolesDto extends PartialType(CreateRolesDto){}