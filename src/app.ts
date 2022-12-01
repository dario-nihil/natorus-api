import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';
import CustomError from './utils/customError';

import globalErrorHandler from './controllers/errorController';

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  const err = new CustomError(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 400;

  next(err);
});

app.use(globalErrorHandler);

export default app;
