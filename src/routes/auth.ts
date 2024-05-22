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
import * as authController from "@/controllers/auth.controller.js";

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/me", authController.me);

export default router;
