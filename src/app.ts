import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import session from "express-session";
import errorHandler from "./middlewares/errorHandler.js";
import authRouter from "./routes/authRouter.js";
import mongoose from "mongoose";
import cors from "cors";
import { NOT_FOUND } from "./constants/HttpStatusCodes.js";
import logger from "./middlewares/logger.js";

dotenv.config();

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
      client: mongoose.connection.getClient(),
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

app.use((req: Request, res: Response) => {
  res.status(NOT_FOUND);
  res.json({ message: "Route not found" });
});

app.use(logger, errorHandler);

export default app;
