import path from 'path';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', 'config.env') });
import app from './app';

const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!
);

mongoose.connect(DB).then(() => console.log('DB connected!'));

const port = process.env.PORT ? +process.env.PORT : 8080;

app.listen(port, '127.0.0.1', () => {
  console.log('Server app & running....');
  console.log('Listening on port 8080');
});
