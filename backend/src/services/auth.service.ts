import bcrypt from 'bcrypt';
import User from '@models/user.js';
import type { RegisterPayload } from '@schemas/auth.schema.js';
import Garage from '@models/garage.js';

class AuthService {
    static async register(payload: RegisterPayload) {
        const user = new User({
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName ?? null,
        });

        const hashedPassword = await bcrypt.hash(payload.password, 10);
        user.hashedPassword = hashedPassword;

        await user.save();

        const garage = await Garage.create({
            name: payload.garageName,
            owner: user._id,
        });

        return { user, garage };
    }
}

export default AuthService;
