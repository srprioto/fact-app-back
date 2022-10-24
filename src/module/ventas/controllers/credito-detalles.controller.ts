import { Body, Controller, Post } from '@nestjs/common';
import { CreditoDetallesService } from '../services/credito-detalles.service';

@Controller('credito-detalles')
export class CreditoDetallesController {

    constructor(
        private creditoDetallesService:CreditoDetallesService
    ){}
    
    @Post()
    postAnadirCreditoDetalles(@Body() payload:any){
        return this.creditoDetallesService.anadirCreditoDetalles(payload);
    }

}
