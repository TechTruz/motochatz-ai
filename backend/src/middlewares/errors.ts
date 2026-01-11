import type { NextFunction, Request, Response } from 'express';
import { CustomError } from '@errors/CustomError.js';
import { ZodError } from 'zod';
import BadRequestError from '@errors/BadRequestError.js';

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    let customError: Error = err;

    if (err instanceof ZodError) {
        const errorContents = err.issues.map((issue) => ({
            message: issue.message,
            context: { path: issue.path },
        }));

        customError = new BadRequestError({
            errors: errorContents,
            logging: false,
        });
    }

    if (customError instanceof CustomError) {
        const { statusCode, errors, logging } = customError;

        if (logging) {
            console.error(
                JSON.stringify(
                    {
                        code: customError.statusCode,
                        errors: customError.errors,
                        stack: customError.stack,
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
