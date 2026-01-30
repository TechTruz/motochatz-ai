import * as z from 'zod';
import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import RefreshToken from '@models/refreshToken.js';
import UnauthorizedError from '@errors/UnauthorizedError.js';
import { verifyToken } from '@utils/jwt.js';

export async function requireRefreshToken(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const { refreshToken: acquiredRefreshToken } = req.cookies;

    if (
        !acquiredRefreshToken ||
        z.uuidv4().safeParse(acquiredRefreshToken).error
    ) {
        throw new UnauthorizedError();
    }

    const hashedAcquiredRefreshToken = crypto
        .createHash('sha256')
        .update(acquiredRefreshToken)
        .digest('hex');

    const refreshToken = await RefreshToken.findById(
        hashedAcquiredRefreshToken
    );

    if (!refreshToken) {
        throw new UnauthorizedError({
            message: 'Invalid or expired refresh token',
        });
    }

    req.refreshTokenId = hashedAcquiredRefreshToken;
    req.userId = refreshToken.owner.toString();
    next();
}

export async function requireAccessToken(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const accessToken = req.headers.authorization?.includes('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : null;

    if (!accessToken) {
        throw new UnauthorizedError({
            message: 'Invalid or expired access token',
        });
    }

    const hostname = `${req.protocol}://${req.get('host')}`;
    const tokenPayload = verifyToken(accessToken, hostname) as JwtPayload;

    req.accessToken = accessToken;
    req.tokenPayload = tokenPayload;
    next();
}
