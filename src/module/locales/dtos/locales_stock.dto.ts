import { IsNumber, IsPositive, Min } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

export class CreateLocalStockDto{

    @IsNumber()
    @Min(0)
    cantidad:number;
    
    @IsNumber()
    @IsPositive()
    localesId:number;

    @IsNumber()
    @IsPositive()
    productosId:number;

}

export class UpdateLocalStockDto extends PartialType(CreateLocalStockDto) {}