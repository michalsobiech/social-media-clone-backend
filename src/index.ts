import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to the database");

    const { default: app } = await import("./app.js");

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();
