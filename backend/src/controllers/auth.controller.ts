import type { Request, Response } from 'express';
import validateData from '@schemas/validator.js';
import { RegisterSchema } from '@schemas/auth.schema.js';
import type { RegisterBody } from '@schemas/auth.schema.js';

/**
 * @todo Implement this controller
 * 1. Create DTO instance from request data
 * 2. Pass the instance as argument to the service function
 * 3. Take returned data object from service and transform it into DTO response instance
 * 4. Return the response
 */
export const registerController = async (
    req: Request<unknown, unknown, RegisterBody>,
    res: Response
) => {
    const data = validateData(RegisterSchema, req.body);

    console.log(typeof data);
    console.log(data);
    res.status(201).json(data);
};
