import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tickets } from '../entities/tickets.entity';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CreateTicketDto } from '../dtos/tickets.dto';
import { Role } from 'src/auth/models/roles.model';
import { Usuarios } from 'src/module/usuarios/entities/usuarios.entity';

@Injectable()
export class TicketsService {

    constructor(
        @InjectRepository(Tickets) private ticketsRepo:Repository<Tickets>,
        @InjectRepository(Usuarios) private usuariosRepo:Repository<Usuarios>
    ){}


    async paginate(localId:string, userId:string, options:IPaginationOptions){
        const user:any = await this.usuariosRepo.findOne(userId, { relations: ["roles"] });
        const rol:string = user.roles.rol;
        const where:any = this.ticketRoles(rol);

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


    async mostarUltimosTickets(localId:string, userId:string){
        const user:any = await this.usuariosRepo.findOne(userId, { relations: ["roles"] });
        const rol:string = user.roles.rol;
        const where:any = this.ticketRoles(rol);

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


    async ticketsTotalNoVistos(localId:string, userId:string){
        const user:any = await this.usuariosRepo.findOne(userId, { relations: ["roles"] });
        const rol:string = user.roles.rol;
        let where:any = this.ticketVistosRoles(rol);

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


    ticketVistosRoles(rol:string){
        let where:any = {};
        if (rol === Role.ADMIN) {
            where = [
                { rol: 1, estado: false }, // amdin
                { rol: 2, estado: false }, // supervisor
                { rol: 3, estado: false }  // vendedor
            ];
        }
        if (rol === Role.SUPERVISOR) {
            where = [
                { rol: 2, estado: false }, // amdin
                { rol: 3, estado: false }  // supervisor
            ];
        }
        if (rol === Role.SALLER) {
            where = [
                { rol: 3, estado: false }  // vendedor
            ];
        }
        return where;
    }

    
    ticketRoles(rol:string){
        let where:any = {};
        if (rol === Role.ADMIN) {
            where = [
                { rol: 1 }, // amdin
                { rol: 2 }, // supervisor
                { rol: 3 }  // vendedor
            ];
        }
        if (rol === Role.SUPERVISOR) {
            where = [
                { rol: 2 }, // supervisor
                { rol: 3 }  // vendedor
            ];
        }
        if (rol === Role.SALLER) {
            where = [
                { rol: 3 } // vendedor
            ];
        }
        return where;
    }


}
