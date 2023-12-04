import bcrypt from "bcrypt";
import express from "express";
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  SUCCESS,
  UNAUTHORIZED,
} from "../constants/HttpStatusCodes.js";
import User from "../models/User.js";
import APIError from "../utils/APIError.js";
import {
  isEmailValid,
  isPasswordValid,
  isValidISO,
} from "../utils/validation.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    let { firstName, lastName, email, password, birthDate, gender } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !birthDate ||
      !gender
    ) {
      throw new APIError(BAD_REQUEST, "Missing required fields");
    }

    if (
      !isNaN(parseFloat(firstName)) ||
      !isNaN(parseFloat(lastName)) ||
      !isNaN(parseFloat(email)) ||
      !isNaN(parseFloat(password)) ||
      !isValidISO(birthDate)
    ) {
      throw new APIError(BAD_REQUEST, "Invalid data type");
    }

    if (!isEmailValid(email) || !isPasswordValid(password)) {
      throw new APIError(BAD_REQUEST, "User input is invalid");
    }

    if (await User.exists({ email })) {
      throw new APIError(CONFLICT, "Email is taken");
    }

    birthDate = new Date(birthDate);

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({
      firstName,
      lastName,
      email,
      hashedPassword,
      birthDate,
      gender,
    });

    res.status(CREATED).send({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new APIError(BAD_REQUEST, "Missing required fields");
    }

    if (!isNaN(parseFloat(email)) || !isNaN(parseFloat(password))) {
      throw new APIError(BAD_REQUEST, "Invalid data type");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new APIError(BAD_REQUEST, "Credentials are invalid");
    }

    const bcryptResult = await bcrypt.compare(password, user.hashedPassword);

    if (!bcryptResult) {
      throw new APIError(BAD_REQUEST, "Credentials are invalid");
    }

    if (req.session.userId) {
      throw new APIError(BAD_REQUEST, "Already authenticated");
    } else {
      req.session.regenerate((err) => {
        if (err) return next(err);

        req.session.userId = user.id;

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
      throw new APIError(BAD_REQUEST, "No session");
    }

    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.status(SUCCESS).send({ message: "Logged out successfully" });
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/me", async (req, res, next) => {
  try {
    if (!req.session.userId) {
      throw new APIError(UNAUTHORIZED, "Unauthenticated");
    }

    res.status(SUCCESS).send({ message: "Authenticated" });
  } catch (error) {
    next(error);
  }
});

export default router;
