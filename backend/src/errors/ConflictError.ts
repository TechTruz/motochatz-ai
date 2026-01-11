import { CustomError } from '@errors/CustomError.js';

export default class ConflictError extends CustomError {
    private static readonly _statusCode = 409;
    private readonly _code: number;
    private readonly _logging: boolean;

    constructor(params?: {
        code?: number;
        message?: string;
        logging?: boolean;
    }) {
        const { code, message, logging } = params || {};

        super(message || 'Conflict');
        this._code = code || ConflictError._statusCode;
        this._logging = logging || false;

        Object.setPrototypeOf(this, ConflictError.prototype);
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
