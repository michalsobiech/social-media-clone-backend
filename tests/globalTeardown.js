import mongoose from "mongoose";

export default async function () {
  try {
    await globalThis.__SERVER__.close();
    await mongoose.disconnect();
    await globalThis.__MONGOD__.stop();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
