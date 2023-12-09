import { type NextFunction, type Request, type Response } from 'express';
import { INTERNAL_SERVER_ERROR } from '../constants/HttpStatusCodes.js';
import APIError from '../utils/APIError.js';

const errorHandler = (
  error: APIError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!(error instanceof APIError)) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Internal Server Error' });
  }

  return res.status(error.statusCode).send({ message: error.message });
};

export default errorHandler;
