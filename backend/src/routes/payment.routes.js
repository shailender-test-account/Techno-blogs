import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentcontroller.js";

const paymentrouter=express.Router();

paymentrouter.post("/create-order",createOrder)
paymentrouter.post("/verify-payment",verifyPayment)

export default paymentrouter