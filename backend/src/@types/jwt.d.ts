import type { JwtPayload } from 'jsonwebtoken';
import type { UUIDTypes } from 'uuid';

export type JwtClaims = JwtPayload & {
    jti: UUIDTypes;
    sub: string;
    name: string;
    role: 'ADMIN' | 'USER';
    garageId: string;
    iss: string;
    aud: string;
    iat: number;
    exp: number;
};
