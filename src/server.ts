import path from 'path';
import mongoose from 'mongoose';

process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);

  // after an uncaught exception the node process must be killed, because it's into a unclean state
  process.exit(1);
});

import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', 'config.env') });
import app from './app';

const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!
);

mongoose.connect(DB).then(() => console.log('DB connected!'));

const port = process.env.PORT ? +process.env.PORT : 8080;

const server = app.listen(port, '127.0.0.1', () => {
  console.log('Server app & running....');
  console.log('Listening on port 8080');
});

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLER REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
