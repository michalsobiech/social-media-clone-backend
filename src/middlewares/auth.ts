import { type Request, type Response, type NextFunction } from "express";
import APIError from "../utils/APIError.js";
import { UNAUTHORIZED } from "../constants/HttpStatusCodes.js";

async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.session.userId) {
      next();
    } else {
      throw new APIError({
        status: UNAUTHORIZED,
        title: "Unauthorized access",
        detail: "Please login first",
      });
    }
  } catch (error) {
    next(error);
  }
}

export default auth;
