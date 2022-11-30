import { Request, Response, NextFunction } from 'express';

import APIFeatures from '../utils/apiFeatures';

import Tour from '../models/tourModel';

export const aliasTopTours = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

export const getAllTours = async (req: Request, res: Response) => {
  try {
    const features = new APIFeatures(Tour.find(), req)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

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

export const getTourStats = async (req: Request, res: Response) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);

    res.status(200).json({ status: 'success', data: { stats } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

export const getMonthlyPlan = async (req: Request, res: Response) => {
  try {
    const year = +req.params.year;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
    ]);

    res.status(200).json({ status: 'success', data: { plan } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};
