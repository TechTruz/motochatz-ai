import {
    model,
    Schema,
    type InferSchemaType,
    type HydratedDocument,
} from 'mongoose';

const documentSchema = new Schema(
    {
        garage: {
            type: Schema.Types.ObjectId,
            ref: 'Garage',
        },
        fileName: {
            type: String,
            required: true,
        },
        fileType: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
            required: true,
        },
        documentUrl: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['UPLOADING', 'UPLOADED', 'INDEXED'],
            required: true,
            default: 'UPLOADING',
        },
    },
    {
        timestamps: true,
    }
);

export type IDocument = InferSchemaType<typeof documentSchema>;
export type DocumentDocument = HydratedDocument<IDocument>;

const Document = model('Document', documentSchema);

export default Document;
