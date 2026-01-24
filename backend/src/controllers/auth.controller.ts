import type { Request, Response } from 'express';
import { RegisterSchema } from '@schemas/auth.schema.js';
import AuthService from '@services/auth.service.js';
import validateData from '@utils/validator.js';
import { ResponsePayloadDTO } from '@dtos/api.dto.js';
import { RegisterDataDTO } from '@dtos/auth.dto.js';

export const registerController = async (req: Request, res: Response) => {
    const data = validateData(RegisterSchema, req.body);
    const { user, garage } = await AuthService.register(data);

    const registerResponseData = new RegisterDataDTO(user, garage);
    const responsePayload = new ResponsePayloadDTO(
        registerResponseData.getObject()
    );

    return res.status(201).json(responsePayload.getObject());
};
