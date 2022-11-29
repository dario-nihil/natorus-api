import { Request, Response, NextFunction } from 'express';

import Tour from '../models/tourModel';

export const aliasTopTours = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

export const getAllTours = async (req: Request, res: Response) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((elm) => delete queryObj[elm]);
  // const { page, sort, limit, fields, ...queryObj} = req.query;
  // This is a more dynamic solution
  // const filteredObj = Object.keys(queryObj)
  //   .filter((query) => !excludedFields.includes(query))
  //   .reduce<{ [x: string]: string | any }>((obj, key) => {
  //     obj[key] = queryObj[key];
  //     return obj;
  //   }, {});

  try {
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //Field limiting
    if (req.query.fields) {
      const fields = (req.query.fields as string).split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //Pagiination
    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 100);
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();

      if (skip >= numTours) throw new Error('This page does not exist');
    }

    const tours = await query;

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
