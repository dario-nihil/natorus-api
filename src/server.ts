import path from 'path';

import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', 'config.env') });
import app from './app';

const port = process.env.PORT ? +process.env.PORT : 8080;

app.listen(port, '127.0.0.1', () => {
  console.log('Server app & running....');
  console.log('Listening on port 8080');
});
