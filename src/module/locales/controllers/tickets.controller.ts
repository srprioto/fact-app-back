import { 
    Controller, 
    Get, 
    Param, 
    ParseIntPipe, 
    Query, 
    DefaultValuePipe,
    // Body, 
    // Delete, 
    // Post, 
    // Put, 
    // UseGuards, 
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Tickets } from '../entities/tickets.entity';
import { TicketsService } from '../services/tickets.service';

@Controller('tickets')
export class TicketsController {
    constructor(
        private ticketsService:TicketsService
    ){}


    @Get("paginate/:localId/:userId")
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number = 12,
        @Param('localId') localId:string,
        @Param('userId') userId:string,
    ): Promise<Pagination<Tickets>> {
        limit = limit > 100 ? 100 : limit;
        const options:any = { page, limit, route: `/tickets/paginate/${localId}/${userId}` }
        return this.ticketsService.paginate(localId, userId, options);
    }


    @Get(":id")
    getOne(@Param('id', ParseIntPipe) id:number){
        return this.ticketsService.getOne(id);
    }

    @Get("ultimos_tickets/:localId/:userId")
    getUltimosTickets(
        @Param('localId') localId:string,
        @Param('userId') userId:string
    ){
        return this.ticketsService.mostarUltimosTickets(localId, userId);
    }

    @Get("no_vistos/:localId/:userId")
    getTicketsNoVistos(
        @Param('localId') localId:string,
        @Param('userId') userId:string
    ){
        return this.ticketsService.ticketsTotalNoVistos(localId, userId);
    }

}
