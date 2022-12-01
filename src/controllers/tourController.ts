import { Request, Response, NextFunction } from 'express';

import APIFeatures from '../utils/apiFeatures';
import Tour from '../models/tourModel';
import catchAsync from '../utils/catchAsync';
import CustomError from '../utils/customError';

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

export const getAllTours = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const features = new APIFeatures(Tour.find(), req)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res
      .status(200)
      .json({ status: 'success', data: { tours }, results: tours.length });
  }
);

export const getTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      const error = new CustomError('No tour found with that ID');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ status: 'success', data: { tour } });
  }
);

export const createTour = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const newTour = await Tour.create(req.body);

    res.status(201).json({ status: 'success', data: { newTour } });
  }
);

export const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      const error = new CustomError('No tour found with that ID');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ status: 'success', data: { tour } });
  }
);

export const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      const error = new CustomError('No tour found with that ID');
      error.statusCode = 404;
      return next(error);
    }

    res.status(204).json({ status: 'success' });
  }
);

export const getTourStats = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
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
  }
);

export const getMonthlyPlan = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
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
  }
);
