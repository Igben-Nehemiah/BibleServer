/* eslint-disable @typescript-eslint/no-unused-vars */

import { type NextFunction, type Request, type Response } from 'express';
import { HttpException } from '../common/errors/custom-error';
import { NotOk } from '../common/responses';

const errorHandlerMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof HttpException) {
    res.status(err.statusCode).send(new NotOk(err.statusCode, err.message));
  }
  res.status(500).send(new NotOk(500));
};

export default errorHandlerMiddleware;
