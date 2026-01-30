import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';
import { startSession } from 'mongoose';
import type { Request } from 'express';
import User from '@models/user.js';
import Garage from '@models/garage.js';
import RefreshToken from '@models/refreshToken.js';
import AccessToken from '@models/accessToken.js';
import type { LoginPayload, RegisterPayload } from '@schemas/auth.schema.js';
import UnauthorizedError from '@errors/UnauthorizedError.js';
import NotFoundError from '@errors/NotFoundError.js';
import { signToken } from '@utils/jwt.js';

class AuthService {
    static async register(payload: RegisterPayload) {
        const session = await startSession();

        // https://dev.to/sarwarasik/mongodb-transactions-error-transaction-numbers-are-only-allowed-on-a-replica-set-member-or-mongos-4083
        // https://medium.com/workleap/the-only-local-mongodb-replica-set-with-docker-compose-guide-youll-ever-need-2f0b74dd8384
        const { user, garage } = await session.withTransaction(async () => {
            const user = new User({
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName ?? null,
            });

            const hashedPassword = await bcrypt.hash(payload.password, 10);
            user.hashedPassword = hashedPassword;

            await user.save({ session });

            const garage = await new Garage({
                name: payload.garageName,
                owner: user._id,
            }).save({ session });

            return {
                user,
                garage,
            };
        });

        await session.endSession();

        return { user, garage };
    }

    static async login(payload: LoginPayload, req: Request) {
        const user = await User.findOne({
            email: payload.email,
        });

        if (
            !user ||
            !(await bcrypt.compare(
                payload.password,
                user.hashedPassword as string
            ))
        ) {
            throw new UnauthorizedError({
                message: 'Incorrect email or password',
            });
        }

        const garage = await Garage.findOne({
            owner: user._id,
        });

        if (!garage) {
            throw new NotFoundError({
                message: 'Garage does not exist',
            });
        }

        const hostname = `${req.protocol}://${req.get('host')}`;
        const accessToken = signToken(user, garage, hostname);

        const refreshToken = uuidv4();
        const hashedRefreshToken = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        await RefreshToken.create({
            _id: hashedRefreshToken,
            owner: user._id,
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    static async rotateRefreshToken(
        refreshTokenId: string,
        userId: string,
        protocol: string,
        hostname: string
    ) {
        const session = await startSession();

        const { accessToken, refreshToken } = await session.withTransaction(
            async () => {
                await RefreshToken.deleteOne({
                    _id: refreshTokenId,
                });

                const user = await User.findById(userId);

                if (!user) {
                    throw new NotFoundError({
                        message: 'User does not exist',
                    });
                }

                const garage = await Garage.findOne({
                    owner: user._id,
                });

                if (!garage) {
                    throw new NotFoundError({
                        message: 'Garage does not exist',
                    });
                }

                const host = `${protocol}://${hostname}`;
                const accessToken = signToken(user, garage, host);

                const refreshToken = uuidv4();
                const hashedRefreshToken = crypto
                    .createHash('sha256')
                    .update(refreshToken)
                    .digest('hex');

                await RefreshToken.create({
                    _id: hashedRefreshToken,
                    owner: user._id,
                });

                return {
                    accessToken,
                    refreshToken,
                };
            }
        );

        await session.endSession();

        return {
            accessToken,
            refreshToken,
        };
    }

    static async revokeTokens(
        refreshTokenId: string,
        accessToken: string,
        jti: string,
        exp: number
    ) {
        const session = await startSession();

        await session.withTransaction(async () => {
            await RefreshToken.deleteOne({
                _id: refreshTokenId,
            });

            await AccessToken.insertOne({
                _id: jti,
                token: accessToken,
                expireAt: new Date(exp * 1000),
            });
        });

        await session.endSession();
    }
}

export default AuthService;
