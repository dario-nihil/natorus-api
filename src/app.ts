import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';
import CustomError from './utils/customError';

import globalErrorHandler from './controllers/errorController';
import { IUser } from './models/userModel';

declare module 'express-serve-static-core' {
  interface Request {
    requestTime?: string;
    user: IUser;
  }
}

const app = express();

// Global Middleware

// Set Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization aganist NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
// xss-clean doesn't provide d.ts definitions

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Serving Static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Testing Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  const err = new CustomError(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 400;

  next(err);
});

app.use(globalErrorHandler);

export default app;
