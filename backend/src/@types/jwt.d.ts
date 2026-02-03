import type { JwtPayload } from 'jsonwebtoken';

export type JwtClaim = JwtPayload & {
    name?: string;
    garageId?: string;
    garageName?: string;
};
