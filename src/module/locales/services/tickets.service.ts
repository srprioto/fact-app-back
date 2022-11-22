import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tickets } from '../entities/tickets.entity';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CreateTicketDto } from '../dtos/tickets.dto';

@Injectable()
export class TicketsService {

    constructor(
        @InjectRepository(Tickets) private ticketsRepo:Repository<Tickets>
    ){}


    async paginate(localId:string, options:IPaginationOptions){
        const where:any = {};
        if (localId !== "_") {
            where.local = localId;
        }
        return paginate<Tickets>(this.ticketsRepo, options, {
            order: { id: "DESC" },
            where: where
        });
    }


    async getOne(id:number){ 
        const ticket:Tickets = await this.ticketsRepo.findOne(id, {
            relations: ["local"]
        });
        ticket.estado = true;
        const newTicket:Tickets = await this.ticketsRepo.save(ticket);
        return {
            success: "ticket visto",
            data: newTicket
        };        
    }


    async mostarUltimosTickets(localId:string){
        const where:any = {};
        if (localId !== "_") {
            where.local = localId;
        }
        const data:Array<any> = await this.ticketsRepo.find({
            select: ["id", "created_at", "estado", "titulo", "tipo"],
            where: where,
            order: { id: "DESC" },
            take: 5
        });
        return {
            success: "registros litso",
            data
        }
    }


    async ticketsNoVistos(localId:string){
        const where:any = { estado: false };
        if (localId !== "_") {
            where.local = localId;
        }
        const data:number = await this.ticketsRepo.count({
            where: where,
        });
        return {
            success: "total tickets no vistos",
            data
        };
    }


    async create(payload:CreateTicketDto){
        const ticket:any = this.ticketsRepo.create(payload);
        const newTicket:CreateTicketDto = await this.ticketsRepo.save(ticket);
        return { newTicket }
    }

}
