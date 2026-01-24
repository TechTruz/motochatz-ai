import { CustomError } from '@errors/CustomError.js';

export default class UnsupportedMediaTypeError extends CustomError {
    private static readonly _statusCode = 415;
    private readonly _code: number;
    private readonly _logging: boolean;

    constructor(params?: {
        code?: number;
        message?: string;
        logging?: boolean;
    }) {
        const { code, message, logging } = params || {};

        super(message || 'Unsupported Media Type');
        this._code = code || UnsupportedMediaTypeError._statusCode;
        this._logging = logging || false;

        Object.setPrototypeOf(this, UnsupportedMediaTypeError.prototype);
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
