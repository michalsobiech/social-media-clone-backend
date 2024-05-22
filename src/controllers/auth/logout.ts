import { SUCCESS, UNAUTHORIZED } from "@/constants/HttpStatusCodes.js";
import APIError from "@/utils/APIError.js";
import { type NextFunction, type Request, type Response } from "express";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.session.userId) {
      throw new APIError({
        status: UNAUTHORIZED,
        title: "No session",
        detail: "No session cookie",
      });
    }

    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.clearCookie("sid", { path: "/" });
        res.clearCookie("userId", { path: "/" });
        res.status(SUCCESS).send({ message: "Logged out successfully" });
      }
    });
  } catch (error) {
    next(error);
  }
}
