import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ventas } from '../entities/ventas.entity';
import { IngresosVentas } from '../entities/ingresos-ventas.entity';

@Injectable()
export class VentasReportesService {
    constructor(
        @InjectRepository(Ventas) private ventasRepo:Repository<Ventas>,
        @InjectRepository(IngresosVentas) private ingresosVentasRepo:Repository<IngresosVentas>,
    ){}

    // total recaudado personalizado
    // total recaudado hoy
    // producto mas vendido

    async reporteIngresosVentas(){
        
        
    }
    

}
