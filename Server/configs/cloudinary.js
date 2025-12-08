import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Directly connect using the URI from .env
    await mongoose.connect(process.env.MONGODB_URI);

    console.log(" MongoDB Connected Successfully");
  } catch (error) {
    console.error(" MongoDB Connection Error:", error.message);
    process.exit(1); // stop server if DB fails
  }
};

export default connectDB;
