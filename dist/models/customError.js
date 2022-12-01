"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(message) {
        super(message);
        // Set prototype explicitly.
        Object.setPrototypeOf(this, CustomError.prototype);
    }
    set status(status) {
        this._status = status;
    }
    get status() {
        return this._status;
    }
    set statusCode(statusCode) {
        this._statusCode = statusCode;
    }
    get statusCode() {
        return this._statusCode;
    }
}
exports.default = CustomError;
