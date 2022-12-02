import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import catchAsync from '../utils/catchAsync';
import User, { IUser } from '../models/userModel';
import CustomError from '../utils/customError';

const signToken = (id: object) =>
  jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new CustomError('Please provide email and password');
      error.statusCode = 400;

      return next(error);
    }

    const user = await User.findOne<IUser>({ email }).select('+password');

    if (
      !user ||
      !(await user.correctPassword(password as string, user.password as string))
    ) {
      const error = new CustomError('Incorrect email or password');
      error.statusCode = 401;

      return next(error);
    }

    const token = signToken(user._id);

    res.status(200).json({ status: 'success', token });
  }
);
