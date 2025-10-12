import mongoose from "mongoose";
import env from "../constant/env.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.DATABASE_URI);
    console.log("DataBase Connected Successfully");
  } catch (e) {
    console.log("error agaya", e, "error agaya");
  }
}
