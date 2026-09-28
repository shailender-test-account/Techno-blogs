import express from "express";
import { AuthController } from "../controllers/auth.controller.js";

const userrouter=express.Router();

userrouter.post("/register",AuthController.register);
userrouter.post("/login",AuthController.login);
userrouter.post("/logout",AuthController.logout)

export default userrouter;