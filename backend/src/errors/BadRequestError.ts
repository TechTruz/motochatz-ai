import { CustomError, type CustomErrorContent } from '@errors/CustomError.js';

export default class BadRequestError extends CustomError {
    private static readonly _statusCode = 400;
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

        super(message || 'Bad Request');
        this._code = code || BadRequestError._statusCode;
        this._logging = logging || false;

        if (errors) {
            this._errors = errors;
        } else {
            this._errors = [{ message: this.message, context: context || {} }];
        }

        Object.setPrototypeOf(this, BadRequestError.prototype);
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
