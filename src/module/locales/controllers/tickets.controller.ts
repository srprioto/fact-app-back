import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, DefaultValuePipe } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Tickets } from '../entities/tickets.entity';
import { TicketsService } from '../services/tickets.service';

@Controller('tickets')
export class TicketsController {
    constructor(
        private ticketsService:TicketsService
    ){}


    @Get("paginate/:localId")
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number = 12,
        @Param('localId') localId:string,
    ): Promise<Pagination<Tickets>> {
        limit = limit > 100 ? 100 : limit;
        const options:any = { page, limit, route: `/tickets/paginate/${localId}` }
        return this.ticketsService.paginate(localId, options);
    }


    @Get(":id")
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.ticketsService.getOne(id);
    }

    @Get("ultimos_tickets/:localId")
    getUltimosTickets(@Param('localId') localId:string){
        return this.ticketsService.mostarUltimosTickets(localId);
    }

    @Get("no_vistos/:localId")
    getTicketsNoVistos(@Param('localId') localId:string){
        return this.ticketsService.ticketsNoVistos(localId);
    }

}
