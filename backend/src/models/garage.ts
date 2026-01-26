import {
    model,
    Schema,
    type InferSchemaType,
    type HydratedDocument,
} from 'mongoose';

const garageSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

type IGarage = InferSchemaType<typeof garageSchema>;
export type GarageDocument = HydratedDocument<IGarage>;

const Garage = model('Garage', garageSchema);

export default Garage;
