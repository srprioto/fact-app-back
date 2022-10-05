import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';

import { CreateRolesDto, UpdateRolesDto } from '../dtos/roles.dto';
import { RolesService } from '../services/roles.service';

@Controller('roles')
export class RolesController {
    constructor(
        private rolesService:RolesService
    ){}


    @Get()
    getAll(){
        return this.rolesService.getAll();
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.rolesService.getOne(id);
    }

    @Post()
    post(@Body() payload:CreateRolesDto){
        return this.rolesService.post(payload);
    }

    @Put(':id')
    put(@Param('id', ParseIntPipe) id:number, @Body() payload:UpdateRolesDto){
        return this.rolesService.put(id, payload);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number){
        return this.rolesService.delete(id);
    }
}
