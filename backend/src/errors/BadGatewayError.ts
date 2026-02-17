import { CustomError, type CustomErrorContent } from '@errors/CustomError.js';

export default class BadGatewayError extends CustomError {
    private static readonly _statusCode = 502;
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

        super(message || 'Bad Gateway');
        this._code = code || BadGatewayError._statusCode;
        this._logging = logging || false;

        this._errors = errors ?? [
            {
                message: this.message,
                ...(context && { context: context }),
            },
        ];
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
