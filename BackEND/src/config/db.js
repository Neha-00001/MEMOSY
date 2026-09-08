import mongoose from "mongoose";
import dns from "dns";

// This DNS fix helps on some local Windows setups but can break
// DNS resolution inside Vercel's serverless environment, so we
// only apply it when NOT running on Vercel.
if (!process.env.VERCEL) {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 15000,
    });
    isConnected = true;
    console.log("MONGODB connected Successfully");
  } catch (error) {
    isConnected = false;
    console.error("Error connecting to MongoDB", error);
    throw error;
  }
};