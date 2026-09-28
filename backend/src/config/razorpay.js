import Razorpay from "razorpay"
import dotenv from "dotenv"
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZ_API_KEY,
  key_secret: process.env.RAZ_API_SECRET,
});

export default razorpay;