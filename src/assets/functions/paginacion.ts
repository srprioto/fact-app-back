import { consulta } from "./queryBuilder";

// IMPORTANTE:
// el alias del conteo se llame total
// la busquedas deben aplicarse al query de data y al de conteo total de registros

export async function paginacionQuery(pagina:number, query:any, queryTotal?:any, maximopp:number = 10) {
    const offset:number = maximopp * (pagina - 1);
    const paginate:string = `LIMIT ${maximopp} OFFSET ${offset}`
    
    let queryAddTotal:string = "";

    if (!queryTotal) {
        queryAddTotal = `
            SELECT COUNT(1) AS total
            FROM ( ${ query } ) AS UNO
        `;
    } else {
        queryAddTotal = queryTotal;
    }

    const data:any = await consulta(query + paginate);
    const totalItems:number = Number((await consulta(queryAddTotal))[0].total);

    const totalPaginas:number = Math.ceil(totalItems / maximopp);

    return {
        data: data,
        meta: {
            totalItems: totalItems,
            totalPaginas: totalPaginas,
            paginasRestantes: totalPaginas - pagina
        }
    }

}


// consulta ejem:

// const queryTotalItems:string = `
//     SELECT COUNT(1) AS total
//     FROM (
//         SELECT sum(venta_detalles.cantidad_venta) as cantidad
//         FROM venta_detalles
//         group by productosId
//     ) AS UNO
// `;