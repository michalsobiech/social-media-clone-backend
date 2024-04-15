import bcrypt from "bcrypt";
import express, {
  type Response,
  type NextFunction,
  type Request,
} from "express";
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  SUCCESS,
  UNAUTHORIZED,
} from "../constants/HttpStatusCodes.js";
import User from "../models/User.js";
import APIError from "../utils/APIError.js";
import registerController from "@/controllers/register/controller.js";

const router = express.Router();

router.post("/register", registerController);

router.post("/login", async (req, res, next) => {
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
      req.session.regenerate((err) => {
        if (err) return next(err);

        req.session.userId = user.id;
        res.cookie("userId", user.id, { httpOnly: false, signed: false });

        req.session.save((err) => {
          if (err) return next(err);

          res.status(SUCCESS).send({ message: "Authenticated successfully" });
        });
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
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
});

router.post("/me", async (req: Request, res: Response, next: NextFunction) => {
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
});

export default router;
