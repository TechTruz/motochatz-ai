import * as z from 'zod';
import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import RefreshToken from '@models/refreshToken.js';
import UnauthorizedError from '@errors/UnauthorizedError.js';

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
