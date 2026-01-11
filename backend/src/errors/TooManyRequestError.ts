import { CustomError } from '@errors/CustomError.js';

export default class TooManyRequestError extends CustomError {
    private static readonly _statusCode = 429;
    private readonly _code: number;
    private readonly _logging: boolean;

    constructor(params?: {
        code?: number;
        message?: string;
        logging?: boolean;
    }) {
        const { code, message, logging } = params || {};

        super(message || 'Too Many Request');
        this._code = code || TooManyRequestError._statusCode;
        this._logging = logging || false;

        Object.setPrototypeOf(this, TooManyRequestError.prototype);
    }

    get errors() {
        return [{ message: this.message }];
    }

    get statusCode() {
        return this._code;
    }

    get logging() {
        return this._logging;
    }
}
