import fs, { appendFileSync } from 'fs';
import path from 'path';
import express from 'express';

import ITours from './models/itours';

const app = express();

app.use(express.json());

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

app.get('/api/v1/tours/:id', (req, res) => {
  const tour = tours.find((tour) => tour.id === +req.params.id);

  if(!tour) {
    return res.status(404).json({ status: 'fail', message: `Unable to find tour with id: ${req.params.id}` );  
  }
  res.status(200).json({ status: 'success', data: { tour } });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    path.join(__dirname, '..', '/dev-data/data/tours-simple.json'),
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 'error', message: 'Internal Server Error' });
      }

      res.status(201).json({ status: 'success', data: { newTour } });
    }
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const tour = tours.find((tour) => tour.id === +req.params.id);

  if(!tour) {
    return res.status(404).json({ status: 'fail', message: `Unable to find tour with id: ${req.params.id}` );  
  }

  res.status(200).json({ status: 'success', data: { tour: '<Updated tour here...'}});
});

app.delete('/api/v1/tours/:id', (req, res) => {
  const tour = tours.find((tour) => tour.id === +req.params.id);

  if(!tour) {
    return res.status(404).json({ status: 'fail', message: `Unable to find tour with id: ${req.params.id}` );  
  }

  res.status(204).json({ status: 'success', data: null });
});

app.listen(8080, '127.0.0.1', () => {
  console.log('Server app & running....');
  console.log('Listening on port 8080');
});
