import { SUCCESS, UNAUTHORIZED } from "@/constants/HttpStatusCodes.js";
import APIError from "@/utils/APIError.js";
import { type Request, type Response, type NextFunction } from "express";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const hasCookies = req.session.userId && req.cookies.userId;
    const isIdMatching = req.session.userId == req.cookies.userId;

    if (!hasCookies || !isIdMatching) {
      throw new APIError({
        status: UNAUTHORIZED,
        title: "Unauthenticated",
        detail: "Unauthenticated",
      });
    }

    res.status(SUCCESS).send({ message: "Authenticated" });
  } catch (error) {
    next(error);
  }
}
