import { CustomError, type CustomErrorContent } from '@errors/CustomError.js';

export default class NotFoundError extends CustomError {
    private static readonly _statusCode = 404;
    private readonly _code: number;
    private readonly _logging: boolean;
    private readonly _errors: CustomErrorContent[];

    constructor(params?: {
        code?: number;
        message?: string;
        logging?: boolean;
        context?: { [key: string]: any };
        errors?: CustomErrorContent[];
    }) {
        const { code, message, logging, context, errors } = params || {};

        super(message || 'Not Found');
        this._code = code || NotFoundError._statusCode;
        this._logging = logging || false;

        if (errors) {
            this._errors = errors;
        } else {
            this._errors = [{ message: this.message, context: context || {} }];
        }

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    get errors() {
        return this._errors;
    }

    get statusCode() {
        return this._code;
    }

    get logging() {
        return this._logging;
    }
}
