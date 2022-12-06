import { promisify } from 'util';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

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
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role,
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
    const error = new Error();

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

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined = undefined;

    if (
      req.headers.authorization ||
      req.headers.authorization?.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const error = new CustomError(
        'You are not logged in! Please log in to get access.'
      );
      error.statusCode = 401;

      return next(error);
    }

    const decoded: JwtPayload = await promisify<string, string, any>(
      jwt.verify
    )(token, process.env.JWT_SECRET as string);

    const currenthUser = await User.findById(decoded.id);

    if (!currenthUser) {
      const error = new CustomError(
        'The user belonging to this token no longer exists.'
      );
      error.statusCode = 401;

      return next(error);
    }

    if (currenthUser.changePasswordAfter(decoded.iat)) {
      const error = new CustomError(
        'User recently changed password! Please log in again.'
      );
      error.statusCode = 498;

      return next(error);
    }

    req.user = currenthUser;
    next();
  }
);

export const restrictTo =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role as string)) {
      const error = new CustomError(
        'You do not have permission to perform this action'
      );
      error.statusCode = 403;

      next(error);
    }

    next();
  };
