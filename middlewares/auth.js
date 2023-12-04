import express from "express";
import CustomError from "../utils/CustomError.js";
import { UNAUTHORIZED } from "../constants/HttpStatusCodes.js";

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function auth(req, res, next) {
  try {
    if (req.session.userId) {
      next();
    } else {
      throw new CustomError(UNAUTHORIZED, "Unauthorized access");
    }
  } catch (error) {
    next(error);
  }
}

export default auth;
