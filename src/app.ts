import fs from 'fs';
import path from 'path';
import express from 'express';

import ITours from './models/itours';

const app = express();

const tours: ITours[] = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', '/dev-data/data/tours-simple.json'),
    'utf-8'
  )
);

app.get('/api/v1/tours', (req, res) => {
  res
    .status(200)
    .json({ status: 'success', data: { tours }, results: tours.length });
});

app.listen(8080, '127.0.0.1', () => {
  console.log('Server app & running....');
  console.log('Listening on port 8080');
});
