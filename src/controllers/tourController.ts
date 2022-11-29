import { Request, Response, NextFunction } from 'express';

import ITours from '../models/itours';
import Tour from '../models/tourModel';

export const getAllTours = (req: Request, res: Response) => {
  // res
  //   .status(200)
  //   .json({ status: 'success', data: { tours }, results: tours.length });
};

export const getTour = (req: Request, res: Response) => {
  // const tour = tours.find((tour) => tour.id === +req.params.id);
  // res.status(200).json({ status: 'success', data: { tour } });
};

export const createTour = async (req: Request, res: Response) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(200).json({ status: 'success', data: { newTour } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: 'Invalid data sent!' });
  }
};

export const updateTour = (req: Request, res: Response) => {
  // const tour = tours.find((tour) => tour.id === +req.params.id);
  // res
  //   .status(200)
  //   .json({ status: 'success', data: { tour: '<Updated tour here...' } });
};

export const deleteTour = (req: Request, res: Response) => {
  res.status(204).json({ status: 'success', data: null });
};
