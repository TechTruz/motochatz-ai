import type { NextFunction, Request, Response } from 'express';
import * as z from 'zod';
import { mongo } from 'mongoose';
import jwt from 'jsonwebtoken';
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

    if (err instanceof z.ZodError) {
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

    // I have to catch this manually cus apparently Mongoose do not consider
    // unique constraint validation on application layer worth implementing,
    // instead they just pass it to the database layer and let the DB driver
    // throw the error >:(
    if (err instanceof mongo.MongoServerError) {
        if (err.code === 11000) {
            const duplicateKey = Object.keys(err.keyPattern)[0];

            return res.status(409).send({
                errors: [
                    {
                        message: `${duplicateKey} is already exist with the same value`,
                        context: {
                            path: [duplicateKey],
                        },
                    },
                ],
            });
        }
    }

    if (err instanceof SyntaxError) {
        return res.status(400).send({
            errors: [
                {
                    message: err.message,
                },
            ],
        });
    }

    if (
        err instanceof jwt.TokenExpiredError ||
        err instanceof jwt.JsonWebTokenError
    ) {
        return res.status(401).send({
            errors: [
                {
                    message: err.message,
                },
            ],
        });
    }

    Logger.error('Name: ' + err.name);
    Logger.error('Message: ' + err.message);
    Logger.error('Cause: ' + err.cause);
    Logger.error('Stack: ' + err.stack);

    res.status(500).send({
        errors: [
            {
                message: 'Something went wrong',
            },
        ],
    });
};
