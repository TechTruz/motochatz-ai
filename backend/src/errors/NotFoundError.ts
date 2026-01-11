import { CustomError } from '@errors/CustomError.js';

export default class NotFoundError extends CustomError {
    private static readonly _statusCode = 404;
    private readonly _code: number;
    private readonly _logging: boolean;

    constructor(params?: {
        code?: number;
        message?: string;
        logging?: boolean;
    }) {
        const { code, message, logging } = params || {};

        super(message || 'Not Found');
        this._code = code || NotFoundError._statusCode;
        this._logging = logging || false;

        Object.setPrototypeOf(this, NotFoundError.prototype);
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
