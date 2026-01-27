import type { Request, Response } from 'express';
import { LoginSchema, RegisterSchema } from '@schemas/auth.schema.js';
import AuthService from '@services/auth.service.js';
import validateData from '@utils/validator.js';
import { ResponsePayloadDTO } from '@dtos/api.dto.js';
import { RegisterDataDTO, LoginDataDTO } from '@dtos/auth.dto.js';

export async function registerController(req: Request, res: Response) {
    const data = validateData(RegisterSchema, req.body);

    const { user, garage } = await AuthService.register(data);

    const registerResponseData = new RegisterDataDTO(user, garage);
    const responsePayload = new ResponsePayloadDTO(
        registerResponseData.getObject()
    );

    return res.status(201).json(responsePayload.getObject());
}

export async function loginController(req: Request, res: Response) {
    const data = validateData(LoginSchema, req.body);

    const { accessToken, refreshToken } = await AuthService.login(data, req);

    const loginResponseData = new LoginDataDTO(accessToken);
    const responsePayload = new ResponsePayloadDTO(
        loginResponseData.getObject()
    );

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/api/auth',
        sameSite: 'strict',
    });
    return res.status(201).json(responsePayload.getObject());
}

export async function refreshController(req: Request, res: Response) {
    return res.status(201).json({});
}
