import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from "express";
import { getManager } from "typeorm";

@Injectable()
export class TimeZoneMiddleware implements NestMiddleware{
    async use(req: Request, res: Response, next: NextFunction) {
        
        const entityManager = getManager();
        await entityManager.query(`SET time_zone = '-05:00'`);

        next();
    }
}