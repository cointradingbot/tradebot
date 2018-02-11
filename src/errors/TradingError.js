export class TradingError extends Error {
    constructor(message, errorPlatform) {
        super(message);
        this.name = this.constructor.name
        this.errorPlatform = errorPlatform
        this.message = message
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor)
        } else {
            this.stack = (new Error(message)).stack
        }
    }
}