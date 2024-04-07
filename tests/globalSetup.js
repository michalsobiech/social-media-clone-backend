import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createApp } from "../dist/app.js";

export default async function () {
  try {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    globalThis.__MONGOD__ = mongod;
    process.env.MONGO_URI = uri + "test";

    await mongoose.connect(process.env.MONGO_URI);

    const app = createApp();
    globalThis.__SERVER__ = app.listen(5000);
    process.env.API_URL = `http://localhost:5000/api`;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
