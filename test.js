import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
mongoose.connect(uri)
  .then(() => console.log("Connected!"))
  .catch(err => console.error("Connection error:", err));
