import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!
);

mongoose.connect(DB).then(() => console.log('DB connected!'));
