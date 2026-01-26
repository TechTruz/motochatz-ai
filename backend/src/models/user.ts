import {
    model,
    Schema,
    type InferSchemaType,
    type HydratedDocument,
} from 'mongoose';
import * as z from 'zod';

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (v: string) {
                    return z.email().safeParse(v).success;
                },
            },
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: String,
        hashedPassword: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            default: 'ADMIN',
        },
    },
    {
        timestamps: true,
    }
);

type IUser = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<IUser>;

const User = model('User', userSchema);

export default User;
