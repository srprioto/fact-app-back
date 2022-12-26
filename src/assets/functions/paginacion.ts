import { consulta } from "./queryBuilder";

// es importante que el alias del conteo se llame total

export async function paginacionQuery(pagina:number, query:any, queryTotal:any, maximopp:number = 10) {
    const offset:number = maximopp * (pagina - 1);
    const paginate:string = `LIMIT ${maximopp} OFFSET ${offset}`
    const data:any = await consulta(query + paginate);

    const totalItems:number = Number((await consulta(queryTotal))[0].total); 
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