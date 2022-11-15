import { Injectable } from '@nestjs/common';
import { Repository, Like, Between, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ventas } from '../entities/ventas.entity';
import { IngresosVentas } from '../entities/ingresos-ventas.entity';
import { ahora, fechaInicioFinDia, fechaInicioFinMes, inicioDia } from 'src/assets/functions/fechas';
import { consulta } from 'src/assets/functions/queryBuilder';
import { sumaArrayObj } from 'src/assets/functions/sumaArrayObj';


@Injectable()
export class VentasReportesService {
    
    constructor(
        @InjectRepository(Ventas) private ventasRepo:Repository<Ventas>,
        @InjectRepository(IngresosVentas) private ingresosVentasRepo:Repository<IngresosVentas>,
    ){}


    async reporteIngresosVentas(){
        const gananciasHoy:number = await this.gananciasVentasHoy();
        const [ ingresos, costos, ganancias ]:Array<number> = await this.gananciasVentasMes();
        return {
            success: "Info general de ventas",
            data: {
                gananciasHoy: gananciasHoy,
                ingresos: ingresos,
                costos: costos,
                ganancias: ganancias,
            }
        }
    }


    async gananciasVentasMes(){
        const [ inicioMes, finMes ]:Array<string> = fechaInicioFinMes();
        const query = await consulta(`
            SELECT sum(ganancia) as ganancias_mes, sum(ingreso) as ingresos_mes, sum(costo) as costos_mes
            FROM ingresos_ventas
            where created_at BETWEEN '` + inicioMes + `' AND  '` + finMes + `'
        `);

        const ganancias:number = !!query[0].ganancias_mes ? Number(query[0].ganancias_mes) : 0;
        const ingresos:number = !!query[0].ingresos_mes ? Number(query[0].ingresos_mes) : 0;
        const costos:number = !!query[0].costos_mes ? Number(query[0].costos_mes) : 0;

        return [ingresos, costos, ganancias];
    }


    async gananciasVentasHoy(){
        const [ inicioDia, finDia ] = fechaInicioFinDia();
        const query = await consulta(`
            SELECT sum(ganancia) as ganancias_hoy
            from ingresos_ventas 
            where created_at BETWEEN '` + inicioDia + `' AND  '` + finDia + `'
        `);
        const ganancia:number = !!query[0].ganancias_hoy ? Number(query[0].ganancias_hoy) : 0;
        return ganancia;
    }

    
    async registroGananciasMes({ inicioMes, finMes }:any){

        const [ inicio, fin ]:Array<string> = fechaInicioFinMes();

        const startMonth:string = inicioMes ? inicioMes : inicio;
        const endMonth:string = finMes ? finMes : fin;

        const query = await consulta(`
            select IF(sum(ganancia) = null, 0, sum(ganancia)) as Ganancias_dia, DATE_FORMAT(created_at, "%d/%m/%Y")  as "Fecha"
            from ingresos_ventas 
            where created_at BETWEEN '` + startMonth + `' AND  '` + endMonth + `'
            group by Fecha
        `);

        const sumaGanancias = sumaArrayObj(query, "Ganancias_dia");

        return {
            query: query,
            sumaGanancias: sumaGanancias
        };

    }
    

}
