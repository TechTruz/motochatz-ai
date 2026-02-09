import * as z from 'zod';
import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import RefreshToken from '@models/refreshToken.js';
import AccessToken from '@models/accessToken.js';
import UnauthorizedError from '@errors/UnauthorizedError.js';
import { verifyToken } from '@utils/jwt.js';
import type { JwtClaim } from '@/@types/jwt.js';
import ForbiddenError from '@errors/ForbiddenError.js';

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
    return next();
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

    if (await AccessToken.findById(tokenPayload.jti)) {
        throw new UnauthorizedError({
            message: 'Invalid or expired access token',
        });
    }

    req.accessToken = accessToken;
    req.tokenPayload = tokenPayload as JwtClaim;
    return next();
}

export function authorize({ ownerQueryParam }: { ownerQueryParam?: string }) {
    return async function (req: Request, _res: Response, next: NextFunction) {
        if (
            ownerQueryParam &&
            req.query?.[ownerQueryParam] &&
            req.tokenPayload?.[ownerQueryParam] === req.query[ownerQueryParam]
        ) {
            return next();
        }

        throw new ForbiddenError({
            message: 'You do not have permission to access these document',
        });
    };
}
