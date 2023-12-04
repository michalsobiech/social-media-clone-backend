import express from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/HttpStatusCodes.js";
import APIError from "../utils/APIError.js";

/**
 * @param {APIError} error
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const errorHandler = (error, req, res, next) => {
  if (!(error instanceof APIError)) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "Internal Server Error" });
  }

  return res.status(error.statusCode).send({ message: error.message });
};

export default errorHandler;
