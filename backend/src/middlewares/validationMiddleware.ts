import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateData = (
    schema: z.ZodObject<any, any>,
    paramName: 'body' | 'query' | 'params'
) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        schema.parse(req[paramName]);
        next();
    };
};
