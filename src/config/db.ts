import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables from .env file
dotenv.config();

const mongodb_Url = process.env.MONGODB_URI;

if (!mongodb_Url) {
  throw new Error("One or more connection strings are missing.");
}

const db_connect = async () => {
  try {
    await mongoose.connect(mongodb_Url, {});
    console.log("Database connected successfully!");
  } catch (err: any) {
    console.log("Error connecting to database:", err.message);
  }
};

export default db_connect;
