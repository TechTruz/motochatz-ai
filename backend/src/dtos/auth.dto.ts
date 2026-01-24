import type { UserDocument } from '@models/user.js';
import type { GarageDocument } from '@models/garage.js';

export class RegisterDataDTO {
    userId: string;
    email: string;
    firstName: string;
    lastName?: string | null;
    garageId: string;
    garageName: string;
    createdAt: string;
    updatedAt: string;

    constructor(user: UserDocument, garage: GarageDocument) {
        this.userId = user._id.toString();
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName ?? null;
        this.garageId = garage._id.toString();
        this.garageName = garage.name;
        this.createdAt = user.createdAt.toISOString();
        this.updatedAt = user.updatedAt.toISOString();
    }

    getObject() {
        return {
            userId: this.userId,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName || null,
            garageId: this.garageId,
            garageName: this.garageName,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
