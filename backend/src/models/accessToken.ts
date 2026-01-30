import {
    Schema,
    model,
    type HydratedDocument,
    type InferSchemaType,
} from 'mongoose';

const accessTokenSchema = new Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        expireAt: {
            type: Date,
            expires: 0,
        },
    },
    {
        timestamps: true,
    }
);

type IAccessToken = InferSchemaType<typeof accessTokenSchema>;
export type AccessTokenDocument = HydratedDocument<IAccessToken>;

const AccessToken = model('AccessToken', accessTokenSchema);

export default AccessToken;
