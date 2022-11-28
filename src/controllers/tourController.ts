import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

import ITours from '../models/itours';

const tours: ITours[] = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', '..', '/dev-data/data/tours-simple.json'),
    'utf-8'
  )
);

export const checkID = (req: Request, res: Response, next: NextFunction) => {
  const tour = tours.find((tour) => tour.id === +req.params.id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: `Unable to find tour with id: ${req.params.id}`,
    });
  }

  next();
};

export const checkBody = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Missing name or price' });
  }

  next();
};

export const getAllTours = (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: 'success', data: { tours }, results: tours.length });
};

export const getTour = (req: Request, res: Response) => {
  const tour = tours.find((tour) => tour.id === +req.params.id);

  res.status(200).json({ status: 'success', data: { tour } });
};

export const createTour = (req: Request, res: Response) => {
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
};

export const updateTour = (req: Request, res: Response) => {
  const tour = tours.find((tour) => tour.id === +req.params.id);

  res
    .status(200)
    .json({ status: 'success', data: { tour: '<Updated tour here...' } });
};

export const deleteTour = (req: Request, res: Response) => {
  res.status(204).json({ status: 'success', data: null });
};
