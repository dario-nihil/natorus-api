import path from 'path';
import express from 'express';
import morgan from 'morgan';

import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;
