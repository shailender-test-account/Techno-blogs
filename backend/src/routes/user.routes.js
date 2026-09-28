import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { UserController } from "../controllers/user.controller.js";

const merouter=express.Router();

merouter.get("/me",authMiddleware,UserController.getProfile)
export default merouter;