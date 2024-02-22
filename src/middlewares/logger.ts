import { type Request, type Response, type NextFunction } from "express";
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

export default function (
  error: APIError,
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (process.env.NODE_ENV === "test") {
    next(error);
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(error);
    next(error);
    return;
  }

  const url = `${req.protocol}://${req.hostname}${req.originalUrl}`;
  const info = {
    statusCode: error.status,
    message: error.error.title,
    label: error.status < 500 ? "API Error" : "Server Error",
    url: url,
  };

  if (error.status < 500) {
    logger.info(info);
  } else {
    logger.error(info);
  }

  next(error);
}
