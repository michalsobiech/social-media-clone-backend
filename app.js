import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import errorHandler from "./middlewares/errorHandler.js";
import authRouter from "./routes/authRouter.js";
import mongoose from "mongoose";
import cors from "cors";
import { NOT_FOUND } from "./constants/HttpStatusCodes.js";
import logger from "./middlewares/logger.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.disable("x-powered-by");
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI,
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

app.use((req, res) => {
  res.status(NOT_FOUND);
  res.json({ message: "Route not found" });
});

app.use(logger, errorHandler);

app.listen(port);

export default app;
