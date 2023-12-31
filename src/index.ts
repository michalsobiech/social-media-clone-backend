import mongoose from "mongoose";
import dotenv from "dotenv";
import { createApp } from "./app.js";

dotenv.config();

const PORT = process.env.PORT;

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log("Connected to the database");
    });

    const app = createApp();

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();
