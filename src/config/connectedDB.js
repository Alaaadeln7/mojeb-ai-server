import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let mongoURI;

    if (process.env.NODE_ENV === "development") {
      mongoURI = process.env.DEVELOPMENT_DATABASE_URL;
    } else if (process.env.NODE_ENV === "testing") {
      mongoURI = process.env.TESTING_DATABASE_URL;
    } else {
      mongoURI = process.env.PRODUCTION_DATABASE_URL;
    }
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected successfully`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
