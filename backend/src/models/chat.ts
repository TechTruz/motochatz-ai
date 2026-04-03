import {
    model,
    Schema,
    type HydratedDocument,
    type InferSchemaType,
} from 'mongoose';

const chatSchema = new Schema(
    {
        garage: {
            type: Schema.Types.ObjectId,
            ref: 'garage',
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        status: {
            type: String,
            enum: ['ONGOING', 'ENDED'],
            required: true,
            default: 'ONGOING',
        },
        remainingQuota: {
            type: Number,
            required: true,
            default: 10,
        },
    },
    {
        timestamps: true,
    }
);

export type IChat = InferSchemaType<typeof chatSchema>;
export type ChatDocument = HydratedDocument<IChat>;

const Chat = model('Chat', chatSchema);

export default Chat;
