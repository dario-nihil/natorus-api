import { Request, Response, NextFunction } from 'express';

import Tour from '../models/tourModel';

export const getAllTours = async (req: Request, res: Response) => {
  try {
    const tours = await Tour.find();

    res
      .status(200)
      .json({ status: 'success', data: { tours }, results: tours.length });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

export const getTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({ status: 'success', data: { tour } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

export const createTour = async (req: Request, res: Response) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({ status: 'success', data: { newTour } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

export const updateTour = async (req: Request, res: Response) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ status: 'success', data: { tour } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

export const deleteTour = async (req: Request, res: Response) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({ status: 'success' });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};
