import { getManager } from "typeorm";

export const setTimezone = async ():Promise<void> => { 
    const entityManager = getManager();
    await entityManager.query(`SET time_zone = '-05:00'`);
}


