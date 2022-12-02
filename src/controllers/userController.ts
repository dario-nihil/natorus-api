import { Request, Response, NextFunction } from 'express';

import catchAsync from '../utils/catchAsync';
import User from '../models/userModel';

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
