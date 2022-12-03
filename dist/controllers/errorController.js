"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = __importDefault(require("../utils/customError"));
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    const error = new customError_1.default(message);
    error.statusCode = 400;
    return error;
};
const handleDuplicateFieldsDB = (msg) => {
    const value = msg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value ${value}. Please use another value!`;
    const error = new customError_1.default(message);
    error.statusCode = 400;
    return error;
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((elm) => elm.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    const error = new customError_1.default(message);
    error.statusCode = 400;
    return error;
};
const handleJwtError = () => {
    const error = new customError_1.default('Invalid token. Please log in again');
    error.statusCode = 401;
    return error;
};
const handleJwtExpiredError = () => {
    const error = new customError_1.default('Your token has expired! Please log in again.');
    error.statusCode = 401;
    return error;
};
const handleInvalidTokenError = (msg) => {
    const error = new customError_1.default(msg);
    error.statusCode = 401;
    return error;
};
const sendErrorProd = (res, err) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        return res
            .status(err.statusCode)
            .json({ status: err.status, message: err.message });
    }
    // Programming or other unknown error: don't leak error detail
    console.error('ERROR 💥', err);
    res.status(500).json({ status: 'error', message: 'Something went wrong!' });
};
const sendErrorDev = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};
exports.default = (err, _req, res, _next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(res, err);
    }
    if (process.env.NODE_ENV === 'production') {
        // Because CustomError extends Error there is a trouble in getting its prototype
        // so with the call to Object.getPrototypeOf I can access the value name that contains info about the name of the error
        const proto = Object.getPrototypeOf(err);
        let error = Object.assign({}, err);
        if (proto.name === 'CastError')
            error = handleCastErrorDB(error);
        if (proto.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError')
            error = handleJwtError();
        if (error.name === 'TokenExpiredError')
            error = handleJwtExpiredError();
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(err.message);
        if (err.statusCode === 498)
            error = handleInvalidTokenError(err.message);
        sendErrorProd(res, error);
    }
};
