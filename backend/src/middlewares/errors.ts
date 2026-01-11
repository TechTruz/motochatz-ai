import { CustomError } from '@/errors/CustomError.js';
import type { NextFunction, Request, Response } from 'express';

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof CustomError) {
        const { statusCode, errors, logging } = err;

        if (logging) {
            console.error(
                JSON.stringify(
                    {
                        code: err.statusCode,
                        errors: err.errors,
                        stack: err.stack,
                    },
                    null,
                    2
                )
            );
        }

        return res.status(statusCode).send({ errors });
    }

    console.error(err);
    res.status(500).send({
        errors: [
            {
                message: 'Something went wrong',
            },
        ],
    });
};
