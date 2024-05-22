import { BAD_REQUEST, SUCCESS } from "@/constants/HttpStatusCodes.js";
import User from "@/models/User.js";
import APIError from "@/utils/APIError.js";
import bcrypt from "bcrypt";
import { type NextFunction, type Request, type Response } from "express";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new APIError({
        status: BAD_REQUEST,
        title: "Missing data",
        detail: "Missing required fields",
      });
    }

    if (!isNaN(parseFloat(email)) || !isNaN(parseFloat(password))) {
      throw new APIError({
        status: BAD_REQUEST,
        title: "Invalid data",
        detail: "The data does not meet the requirements",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new APIError({
        status: BAD_REQUEST,
        title: "Invalid credentials",
        detail: "Credentials are invalid",
      });
    }

    const bcryptResult = await bcrypt.compare(password, user.hashedPassword);

    if (!bcryptResult) {
      throw new APIError({
        status: BAD_REQUEST,
        title: "Invalid credentials",
        detail: "Credentials are invalid",
      });
    }

    if (req.session.userId) {
      throw new APIError({
        status: BAD_REQUEST,
        title: "Already authenticated",
        detail: "You are already authenticated",
      });
    } else {
      req.session.regenerate((err: any) => {
        if (err) return next(err);

        req.session.userId = user.id;
        res.cookie("userId", user.id, { httpOnly: false, signed: false });

        req.session.save((err: any) => {
          if (err) return next(err);

          res.status(SUCCESS).send({ message: "Authenticated successfully" });
        });
      });
    }
  } catch (error) {
    next(error);
  }
}
