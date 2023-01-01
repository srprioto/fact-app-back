import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { fechaInicioFinDia, fechaInicioFinMes, inicioFinFechaJson } from 'src/assets/functions/fechas';
import { consulta } from 'src/assets/functions/queryBuilder';
import { sumaArrayObj, sumaArrayObjRepetidos } from 'src/assets/functions/sumaArrayObj';
import { tipoMovimiento } from 'src/module/locales/dtos/caja-detalles.dto';
import { IngresosVentas } from '../entities/ingresos-ventas.entity';
import { IngresosEgresos } from '../entities/ingresos_egresos.entity';
import { CajaDetalles } from 'src/module/locales/entities/caja-detalles.entity';
import { VentaDetalles } from '../entities/venta_detalles.entity';
import { paginacionQuery } from 'src/assets/functions/paginacion';
// import { paginacionQuery } from 'src/assets/functions/paginacion';


@Injectable()
export class VentasReportesService {
    
    constructor(
        @InjectRepository(IngresosVentas) private ingresosVentasRepo:Repository<IngresosVentas>,
        @InjectRepository(VentaDetalles) private ventaDetallesRepo:Repository<VentaDetalles>,
        @InjectRepository(IngresosEgresos) private ingresosEgresosRepo:Repository<IngresosEgresos>,
        @InjectRepository(CajaDetalles) private cajaDetallesRepo:Repository<CajaDetalles>,
    ){}


    async reporteIngresosVentas(){

        const [ inicioMes, finMes ]:Array<string> = fechaInicioFinMes();

        const queryIngresosVentas = await consulta(`
            SELECT sum(ganancia) as ganancias_mes, sum(ingreso) as ingresos_mes, sum(costo) as costos_mes
            FROM ingresos_ventas
            where created_at BETWEEN '` + inicioMes + `' AND  '` + finMes + `'
        `);

        const queryIngresosEgresos = await consulta(`
            SELECT sum(monto) as monto_ingresos_egresos
            FROM ingresos_egresos
            where created_at BETWEEN '` + inicioMes + `' AND  '` + finMes + `'
        `);

        const queryCajaDetalles = await consulta(`
            SELECT sum(monto_movimiento) as caja_detalles
            FROM caja_detalles
            where created_at BETWEEN '` + inicioMes + `' AND  '` + finMes + `'
            AND tipo_movimiento = '` + tipoMovimiento.ingresosEgresosCaja + `'
        `);

        const ingresosEgresos:number = !!queryIngresosEgresos[0].monto_ingresos_egresos ? Number(queryIngresosEgresos[0].monto_ingresos_egresos) : 0;
        const cajaDetalles:number = !!queryCajaDetalles[0].caja_detalles ? Number(queryCajaDetalles[0].caja_detalles) : 0;

        const otrosGastos:number = ingresosEgresos + cajaDetalles;

        const ganancias:number = otrosGastos + (!!queryIngresosVentas[0].ganancias_mes ? Number(queryIngresosVentas[0].ganancias_mes) : 0);
        const ingresos:number = !!queryIngresosVentas[0].ingresos_mes ? Number(queryIngresosVentas[0].ingresos_mes) : 0;
        const costos:number = !!queryIngresosVentas[0].costos_mes ? Number(queryIngresosVentas[0].costos_mes) : 0;

        return {
            success: "Info general de ventas",
            data: {
                ingresos: ingresos,
                costos: costos,
                otrosGastos: otrosGastos,
                ganancias: ganancias,
            }
        }
    }

    
    async registroGananciasMes({ inicioMes, finMes, idLocal }:any){

        const [ inicio, fin ]:Array<string> = fechaInicioFinMes();

        const startMonth:string = inicioMes ? inicioMes : inicio;
        const endMonth:string = finMes ? finMes : fin;

        let ingresosEgresosGenerales:number = 0;

        if (idLocal !== "_") {
            const ieGenerales:Array<any> = await consulta(`
                SELECT sum(ingresos_egresos.monto) as IEgenerales
                FROM ingresos_egresos
                WHERE
                    (ingresos_egresos.created_at BETWEEN '${startMonth}' AND  '${endMonth}')
                    AND ingresos_egresos.localesId IS NULL
            `);
            ingresosEgresosGenerales = Number(ieGenerales[0].IEgenerales);
        }

        const queryGananciasVentas = await consulta(`
            SELECT 
                sum(ingresos_ventas.ganancia) as Ganancias_dia, 
                DATE_FORMAT(ingresos_ventas.created_at, "%d/%m/%Y")  as "Dia"
            FROM ingresos_ventas, ventas
            WHERE
                (ingresos_ventas.created_at BETWEEN '${startMonth}' AND  '${endMonth}') AND
                ingresos_ventas.ventasId = ventas.id
                ${
                    (idLocal !== "_") 
                    ? `AND ventas.localesId = ${idLocal}` 
                    : ""
                }
            GROUP BY Dia
            ORDER BY Dia desc
            LIMIT 50
        `);
        
        // aqui estan los ingresos y egresos generales
        const queryIngresosEgresos = await consulta(`
            SELECT 
                sum(ingresos_egresos.monto) as Ganancias_dia,
                DATE_FORMAT(ingresos_egresos.created_at, "%d/%m/%Y")  as "Dia"
            FROM ingresos_egresos
            WHERE 
                (ingresos_egresos.created_at BETWEEN '${startMonth}' AND  '${endMonth}')
                ${
                    (idLocal !== "_")
                    ? `AND ingresos_egresos.localesId = ${idLocal}`
                    : ""
                }
            GROUP BY Dia
            ORDER BY Dia desc
            LIMIT 65
        `);

        const queryCajaDetalles = await consulta(`
            SELECT 
                sum(caja_detalles.monto_movimiento) as Ganancias_dia,
                DATE_FORMAT(caja_detalles.created_at, "%d/%m/%Y")  as "Dia"
            FROM caja_detalles, caja
            WHERE 
                (caja_detalles.created_at BETWEEN '${startMonth}' AND  '${endMonth}')
                AND caja_detalles.tipo_movimiento = '${tipoMovimiento.ingresosEgresosCaja}'
                AND caja_detalles.cajaId = caja.id
                ${
                    (idLocal !== "_") 
                    ? `AND caja.localesId = ${idLocal}` 
                    : ""
                }
            GROUP BY Dia
            ORDER BY Dia desc
            LIMIT 65
        `);
        
        const unionQuerys:Array<any> = [
            ...queryGananciasVentas,
            ...queryIngresosEgresos,
            ...queryCajaDetalles,
        ];

        const resultados = sumaArrayObjRepetidos(unionQuerys, "Dia", "Ganancias_dia");
        const sumaGanancias = sumaArrayObj(resultados, "Ganancias_dia");

        return {
            query: resultados,
            sumaMontos: {
                // sumaIngresos,
                ingresosEgresosGenerales,
                sumaGanancias
            }
        };
    }


    async gananciasReporteDia(payload:any) {

        const [inicioDia, finDia] = inicioFinFechaJson(payload.fecha);
        let ingresosEgresosGenerales:number = 0;
        let whereIVentas:any = {};
        let whereIngEgre:any = {};
        let whereMovCaja:any = {};

        if (payload.idLocal !== "_") {
            whereIVentas = { locales: payload.idLocal }
            whereIngEgre = payload.idLocal
            whereMovCaja = { locales: payload.idLocal }
            const ieGenerales:Array<any> = await consulta(`
                SELECT sum(ingresos_egresos.monto) as IEgenerales
                FROM ingresos_egresos
                WHERE
                    (ingresos_egresos.created_at BETWEEN '${inicioDia}' AND  '${finDia}')
                    AND ingresos_egresos.localesId IS NULL
            `);
            ingresosEgresosGenerales = Number(ieGenerales[0].IEgenerales);
        }
        
        const ingresosVentasDia:any = await this.ingresosVentasRepo.find({ 
            relations: ["ventas"],
            select: ["ingreso", "costo", "ganancia", "ventas"],
            order: { id: "DESC" },
            where: {
                created_at: Between(inicioDia, finDia),
                ventas: whereIVentas
            }
        });
        const ingresosEgresosDia:any = await this.ingresosEgresosRepo.find({
            relations: ["locales"],
            select: ["monto", "descripcion", "tipo", "locales"],
            order: { id: "DESC" },
            where: {
                created_at: Between(inicioDia, finDia),
                locales: whereIngEgre
            }
        });
        const movimientosCaja:any = await this.cajaDetallesRepo.find({
            relations: ["caja", "caja.locales"],
            select: ["monto_movimiento", "descripcion"],
            order: { id: "DESC" },
            where: {
                created_at: Between(inicioDia, finDia),
                tipo_movimiento: tipoMovimiento.ingresosEgresosCaja,
                caja: whereMovCaja
            }
        });

        // suma de ingresos de ventas
        const sumaIngresosVentas:number = sumaArrayObj(ingresosVentasDia, "ingreso");
        const sumaCostosVentas:number = sumaArrayObj(ingresosVentasDia, "costo");
        const sumaGananciasVentas:number = sumaArrayObj(ingresosVentasDia, "ganancia");

        // suma de ingresos y egresos
        const sumaIngresosEgresos:number = sumaArrayObj(ingresosEgresosDia, "monto");

        // suma de movimientos de caja
        const sumaMovimientosCaja:number = sumaArrayObj(movimientosCaja, "monto_movimiento");

        // sumat total del dia
        const sumaGananciasDia:number = sumaGananciasVentas + sumaIngresosEgresos + sumaMovimientosCaja
        
        return {
            ingresosVentasDia,
            ingresosEgresosDia,
            movimientosCaja,
            sumatorias: {
                sumaIngresosVentas,
                sumaCostosVentas,
                sumaGananciasVentas,
                sumaIngresosEgresos,
                sumaMovimientosCaja,
                sumaGananciasDia,
                ingresosEgresosGenerales
            }
        };
    }


    async gananciasVentasHoy(){
        const [ inicioDia, finDia ] = fechaInicioFinDia();
        const query = await consulta(`
            SELECT sum(ganancia) as ganancias_hoy
            from ingresos_ventas 
            where created_at BETWEEN '${inicioDia}' AND  '${finDia}'
        `);
        const ganancia:number = !!query[0].ganancias_hoy ? Number(query[0].ganancias_hoy) : 0;
        return ganancia;
    }


    async topProductosVendidos(payload:any){
        
        const filtro:boolean = (!!payload.searchText) || payload.local !== "_";
        let innerJoin:string = "";
        let where:string = "";
        

        if (filtro) {
            where = `WHERE `; // inicia con where para concatenar
            if (payload.local !== "_") { // verifica que el local sea general o no
                innerJoin += `INNER JOIN ventas ON venta_detalles.ventasId = ventas.id`;
                where += ` ventas.localesId = ${payload.local}`;
            }
            if (!!payload.searchText) { // verifica que exista una busqueda
                if (payload.local !== "_") {
                    where += ` AND `; // para unir el where de locales con busquedas
                }
                // busqueda de producto
                where += `(
                    productos.codigo LIKE "%${payload.searchText}%" ||
                    productos.nombre LIKE "%${payload.searchText}%" ||
                    productos.marca LIKE "%${payload.searchText}%" ||
                    productos.color LIKE "%${payload.searchText}%" ||
                    productos.talla LIKE "%${payload.searchText}%"
                )`;
            }
        }

        const query:string = `
            SELECT
                Sum(venta_detalles.cantidad_venta) as cantidad_venta,
                productos.id as id,
                productos.codigo as codigo,
                productos.nombre as nombre,
                productos.marca as marca,
                productos.color as color,
                productos.talla as talla
            FROM productos
            INNER JOIN venta_detalles ON productos.id = venta_detalles.productosId
            ${innerJoin}
            ${where}
            GROUP BY id, codigo, nombre, marca, color, talla
            ORDER BY cantidad_venta ${payload.ordenar}
        `;

        const queryTotalItems:string = `
            SELECT COUNT(1) AS total
            FROM (
                SELECT sum(venta_detalles.cantidad_venta) as cantidad
                FROM productos
                INNER JOIN venta_detalles
                ON venta_detalles.productosId = productos.id
                ${innerJoin}
                ${where}
                group by productosId
            ) AS UNO
        `;

        return await paginacionQuery(payload.pagina, query, queryTotalItems);

    }


    async topProductosSinVentas(payload:any){

        let where:string = "";

        if (!!payload.searchText) {
            where = `
                AND 
                    productos.codigo LIKE "%${payload.searchText}%" ||
                    productos.nombre LIKE "%${payload.searchText}%" ||
                    productos.marca LIKE "%${payload.searchText}%" ||
                    productos.color LIKE "%${payload.searchText}%" ||
                    productos.talla LIKE "%${payload.searchText}%"
            `;
        }

        const query:string = `
            SELECT 
                productos.id as id,
                productos.codigo as codigo,
                productos.nombre as nombre,
                productos.marca as marca,
                productos.color as color,
                productos.talla as talla
            FROM productos
            WHERE id not in (
                SELECT productosId 
                FROM venta_detalles
            )
            ${where}
        `;

        return await paginacionQuery(payload.pagina, query);

    }


    
    // SELECT
    //     Sum(venta_detalles.cantidad_venta) as cantidad_venta,
    //     productos.codigo as codigo,
    //     productos.nombre as nombre,
    //     productos.marca as marca,
    //     productos.color as color,
    //     productos.talla as talla
    // FROM productos 
    //     INNER JOIN venta_detalles ON productos.id = venta_detalles.productosId
    //     INNER JOIN ventas ON venta_detalles.ventasId = ventas.id
    // WHERE
    //     ventas.localesId = 3
    // group by 
    //     codigo, nombre, marca, color, talla
    // ORDER BY cantidad_venta desc


    
    // async topProductosVendidos(options:IPaginationOptions):Promise<any> {

    //     const entityManager = getManager();

    //     const queryBuilder:any = await entityManager.createQueryBuilder()
    //         .select([
    //         'SUM(ventaDetalles.cantidad_venta) as cantidadVenta',
    //         'productos.codigo as codigo',
    //         'productos.nombre as nombre',
    //         'productos.marca as marca',
    //         'productos.color as color',
    //         'productos.talla as talla'
    //     ])
    //         .from(VentaDetalles, "ventaDetalles")
    //         .innerJoin(Productos, "productos")
    //         .where("ventaDetalles.productosId = productos.id")
    //         .groupBy("codigo")
    //         .addGroupBy("nombre")
    //         .addGroupBy("marca")
    //         .addGroupBy("color")
    //         .addGroupBy("talla")
    //         .orderBy('cantidadVenta', 'DESC')
    //         .getRawMany()





    //     // .orWhere("productos.id between 100 and 120")
            

    //     // const user = await createQueryBuilder("user")
    //     //     .leftJoinAndSelect("user.photos", "photo")
    //     //     .where("user.name = :name", { name: "Timber" })
    //     //     .andWhere("photo.isRemoved = :isRemoved", { isRemoved: false })
    //     //     .getOne()


    //     // await entityManager
    //     //     .createQueryBuilder(VentaDetalles, "ventaDetalles")
    //     //     .select(['ventaDetalles.cantidad_venta as username', 'productos.nombre as orderTime'])
    //     //     .innerJoin(Productos, "productos")
    //     //     .getMany()


    //     console.log(queryBuilder);
    //     return queryBuilder;
        

    //     // const paginacion:any = await paginate<any>(queryBuilder, options);

    //     // console.log(paginacion);        

    //     // return paginacion;
    // }
    

}

