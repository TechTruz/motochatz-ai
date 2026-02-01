import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import type { GarageDocument } from '@models/garage.js';
import type { UserDocument } from '@models/user.js';

const JWT_SECRET = process.env.JWT_SECRET;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

export function signToken(
    user: UserDocument,
    garage: GarageDocument,
    hostname: string
) {
    return jwt.sign(
        {
            jti: uuidv4(),
            sub: user._id.toString(),
            name: `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`,
            role: user.role,
            garageId: garage._id.toString(),
            garageName: garage.name,
            iss: hostname,
            aud: CORS_ORIGIN?.split(',') ?? '*',
        },
        JWT_SECRET,
        { expiresIn: '15m' }
    );
}

export function verifyToken(token: string, hostname: string) {
    const audience = CORS_ORIGIN
        ? (CORS_ORIGIN.split(',') as [string, ...string[]])
        : '*';

    return jwt.verify(token, JWT_SECRET, {
        audience,
        issuer: hostname,
    });
}
