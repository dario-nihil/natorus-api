"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(message) {
        super(message);
        this._isOperational = true;
        // Set prototype explicitly.
        Object.setPrototypeOf(this, CustomError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
    set status(status) {
        this._status = status;
    }
    get status() {
        return this._status;
    }
    set statusCode(statusCode) {
        this._statusCode = statusCode;
        this._status = (statusCode === null || statusCode === void 0 ? void 0 : statusCode.toString().startsWith('4')) ? 'fail' : 'error';
    }
    get statusCode() {
        return this._statusCode;
    }
    set path(path) {
        this._path = path;
    }
    get path() {
        return this._path;
    }
    set value(value) {
        this._value = value;
    }
    get value() {
        return this._value;
    }
    set code(code) {
        this._code = code;
    }
    get code() {
        return this._code;
    }
    set errors(errors) {
        this._errors = errors;
    }
    get errors() {
        return this._errors;
    }
    get isOperational() {
        return this._isOperational;
    }
}
exports.default = CustomError;
