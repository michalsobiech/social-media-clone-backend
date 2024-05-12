import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import express, {
  type Request,
  type Response,
  type Application,
  type NextFunction,
} from "express";
import session from "express-session";
import errorHandler from "./middlewares/errorHandler.js";
import authRouter from "@/routes/auth.js";
import mongoose from "mongoose";
import cors from "cors";
import { NOT_FOUND } from "./constants/HttpStatusCodes.js";
import logger from "./middlewares/logger.js";
import APIError from "./utils/APIError.js";

dotenv.config();

export function createApp() {
  const app: Application = express();

  app.disable("x-powered-by");
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieparser());
  app.use(
    session({
      store: MongoStore.create({
        clientPromise: mongoose.connection
          .asPromise()
          .then((conn) => conn.getClient()),
        collectionName: "sessions",
        autoRemove: "interval",
        autoRemoveInterval: 10,
      }),
      secret: process.env.SECRET,
      name: "sid",
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: "/",
        secure: false || process.env.NODE_ENV === "production",
        httpOnly: true,
        // maxAge: 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );

  app.use("/api/auth", authRouter);

  app.use((req: Request, res: Response, next: NextFunction) => {
    next(
      new APIError({
        status: NOT_FOUND,
        title: "Route not found",
        detail: "The route you want to access is no existing",
      })
    );
  });

  app.use(logger, errorHandler);

  return app;
}
