import { getManager } from "typeorm";

export const consulta = async (query:string) => { 
    const entityManager = getManager();
    const respuesta:any = await entityManager.query(query);
    return respuesta;
}