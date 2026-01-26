import {
    Schema,
    model,
    type HydratedDocument,
    type InferSchemaType,
} from 'mongoose';

const refreshTokenSchema = new Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        createdAt: {
            type: Date,
            expires: 60 * 60 * 24 * 7,
        },
    },
    {
        timestamps: true,
    }
);

type IRefreshToken = InferSchemaType<typeof refreshTokenSchema>;
export type RefreshTokenDocument = HydratedDocument<IRefreshToken>;

const RefreshToken = model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
