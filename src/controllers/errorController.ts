import { Request, Response, NextFunction } from 'express';

import CustomError from '../utils/customError';

const handleCastErrorDB = (err: CustomError) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  const error = new CustomError(message);
  error.statusCode = 400;

  return error;
};

const handleDuplicateFieldsDB = (err: CustomError, msg: string) => {
  const value = msg.match(/(["'])(\\?.)*?\1/)![0];
  const message = `Duplicate field value ${value}. Please use another value!`;
  const error = new CustomError(message);
  error.statusCode = 400;

  return error;
};

const handleValidationErrorDB = (err: CustomError) => {
  const errors = Object.values(err.errors!).map((elm) => elm.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  const error = new CustomError(message);
  error.statusCode = 400;

  return error;
};

const sendErrorProd = (res: Response, err: CustomError) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res
      .status(err.statusCode as number)
      .json({ status: err.status, message: err.message });
  }

  // Programming or other unknown error: don't leak error detail
  console.error('ERROR 💥', err);
  res.status(500).json({ status: 'error', message: 'Something went wrong!' });
};

const sendErrorDev = (res: Response, err: CustomError) => {
  res.status(err.statusCode as number).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

export default (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(res, err);
  }

  if (process.env.NODE_ENV === 'production') {
    // Because CustomError extends Error there is a trouble in getting its prototype
    // so with the call to Object.getPrototypeOf I can access the value name that contains info about the name of the error
    const proto = Object.getPrototypeOf(err);
    let error = { ...err } as CustomError;

    if (proto.name === 'CastError') error = handleCastErrorDB(error);
    if (proto.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.code === 11000)
      error = handleDuplicateFieldsDB(error, err.message);

    sendErrorProd(res, error);
  }
};
