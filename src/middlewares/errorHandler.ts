import { type NextFunction, type Request, type Response } from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/HttpStatusCodes.js";
import APIError, { type APIErrorType } from "../utils/APIError.js";

const errorHandler = (
  error: APIError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!(error instanceof APIError)) {
    const error: APIErrorType = {
      status: INTERNAL_SERVER_ERROR,
      title: "Internal Server Error",
      detail: "An error occurred on the server",
    };

    return res.status(error.status).send({ error: error });
  }

  return res.status(error.status).send({ error: error.error });
};

export default errorHandler;
