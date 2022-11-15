import { getManager } from "typeorm";

export const timezone = async () => { 
    const entityManager = getManager();
    await entityManager.query(`SET time_zone = '-05:00'`);
}