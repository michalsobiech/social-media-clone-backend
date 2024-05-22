import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import { BAD_REQUEST, CONFLICT, CREATED } from "@/constants/HttpStatusCodes.js";
import User from "@/models/User.js";
import APIError from "@/utils/APIError.js";
import {
  isEmailValid,
  isPasswordValid,
  isValidISO,
} from "@/utils/validation.js";
import { bodyHasAllRequiredParameters } from "./validators.js";

type RegisterBody = Object & {
  [key: string]: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  gender: string;
};

interface RegisterRequest extends Request {
  body: RegisterBody;
}

export default async function (
  req: RegisterRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { firstName, lastName, email, password, birthDate, gender } =
      req.body;

    bodyHasAllRequiredParameters(req.body);

    if (
      !isNaN(parseFloat(firstName)) ||
      !isNaN(parseFloat(lastName)) ||
      !isNaN(parseFloat(email)) ||
      !isNaN(parseFloat(password)) ||
      !isValidISO(birthDate) ||
      !isNaN(parseFloat(gender))
    ) {
      throw new APIError({
        status: BAD_REQUEST,
        title: "Invalid type",
        detail: "Invalid data type",
        invalidParams: [
          {
            name: "firstName",
            reason: "must be a string",
          },
        ],
      });
    }

    if (!isEmailValid(email) || !isPasswordValid(password)) {
      throw new APIError({
        status: BAD_REQUEST,
        title: "Invalid data",
        detail: "User input is invalid",
      });
    }

    if (await User.exists({ email })) {
      throw new APIError({
        status: CONFLICT,
        title: "Email taken",
        detail: "The email address you want to use is already taken",
      });
    }

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
}
