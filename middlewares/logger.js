import express from "express";
import { createLogger, format, transports } from "winston";
import APIError from "../utils/APIError.js";

const customFormat = format.printf(
  ({ level, message, label, timestamp, statusCode, url }) => {
    return `${timestamp} ${url}\n${level}: [${label}] (${statusCode}) ${message}`;
  }
);

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    customFormat
  ),
  transports: [new transports.Console()],
});

/**
 * @param {APIError} error
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export default function (error, req, res, next) {
  if (process.env.NODE_ENV !== "production") {
    console.log(error);
    next(error);
    return;
  }

  const url = `${req.protocol}://${req.hostname}${req.originalUrl}`;
  const info = {
    statusCode: error.statusCode,
    message: error.message,
    label: error.statusCode < 500 ? "API Error" : "Server Error",
    url: url,
  };

  if (error.statusCode < 500) {
    logger.info(info);
  } else {
    logger.error(info);
  }

  next(error);
}
