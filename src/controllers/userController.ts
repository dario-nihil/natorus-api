import { Request, Response, NextFunction, RequestHandler } from 'express';

import catchAsync from '../utils/catchAsync';
import User from '../models/userModel';
import CustomError from '../utils/customError';

interface IBodyObj {
  [x: string]: string;
}

const filterObj = (body: IBodyObj, ...allowedFileds: string[]) => {
  const newObj: IBodyObj = {};
  Object.keys(body).forEach((el) => {
    if (allowedFileds.includes(el)) newObj[el] = body[el];
  });

  return newObj;
};

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find();

  res
    .status(200)
    .json({ status: 'success', data: { users }, results: users.length });
});

export const createUser = (req: Request, res: Response) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined!' });
};

export const getUser = (req: Request, res: Response) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined!' });
};

export const updateUser = (req: Request, res: Response) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined!' });
};

export const deleteUser = (req: Request, res: Response) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined!' });
};

export const updateMe: RequestHandler = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.confirmPassword) {
    const error = new CustomError(
      'This route is not for password updates. Please use /updateMyPassword'
    );
    error.statusCode = 400;

    return next(error);
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

export const deleteMe: RequestHandler = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'success', data: null });
});
