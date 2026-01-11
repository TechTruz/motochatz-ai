import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { CustomError } from '@errors/CustomError.js';
import BadRequestError from '@errors/BadRequestError.js';
import Logger from '@utils/logger.js';

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
            Logger.debug(
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

    Logger.error(err);
    res.status(500).send({
        errors: [
            {
                message: 'Something went wrong',
            },
        ],
    });
};
