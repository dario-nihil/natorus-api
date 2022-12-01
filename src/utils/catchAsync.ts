import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

// This construct allows to reduce the amount of work inside the action controller (now not handle the error on its own)
// and concentrate onthe work it's supposed to do
export default (fn: {
  (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void>;
  (
    arg0: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    arg1: Response<any, Record<string, any>>,
    arg2: NextFunction
  ): Promise<any>;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
