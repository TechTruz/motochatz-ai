import { Schema, model } from 'mongoose';

const messageSchema = new Schema(
    {
        chat: {
            type: Schema.Types.ObjectId,
            ref: 'chat',
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: false,
        },
        content: {
            type: String,
            required: true,
        },
        referencedDocuments: [{ type: Schema.Types.ObjectId, ref: 'document' }],
    },
    {
        timestamps: true,
    }
);

const Message = model('Message', messageSchema);

export default Message;
