import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model.js";
import {
  generateToken,
  cookieOptions,
  COOKIE_NAME,
} from "../utils/jwt.js";

export const AuthController = {
  // ============ REGISTER ============
  async register(req, res, next) {
    try {

      const { name, email, password, role } = req.body;
      console.log(req.body)

      if (!name || !email || !password || !role) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const existing = await UserModel.findByEmail(email);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userId = await UserModel.create({
        name,
        email,
        password: hashedPassword,
      });

      const user = await UserModel.findById(userId);
      const token = generateToken({ id: user.id, role: user.role });

      const cookieOptions = {
        httpOnly: true,        
        secure: process.env.NODE_ENV === "production", 
        sameSite: "none",    
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7
      
      };

      // ✅ Set token in HTTP-only cookie
        res.cookie("token", token, cookieOptions);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        token


      });
    } catch (error) {
      next(error);
    }
  },

  // ============ LOGIN ============
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password required",
        });
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const token = generateToken({ id: user.id, email: user.email, role: user.role });

      const cookieOptions = {
        httpOnly: true,        // cannot be accessed by JS → protects against XSS
        secure: process.env.NODE_ENV === "production", // HTTPS only in prod
        sameSite: "none",    // protects against CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      
      };



      res.cookie("token",token,cookieOptions)

     

      //   delete user.password;

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user,
        token,
      });
    } catch (error) {
      next(error);
    }
  },

  // ============ LOGOUT ============
  async logout(req, res, next) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  // ============ GET ME (current user) ============
  async getMe(req, res, next) {
    try {
      // req.user is set by authMiddleware
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      return res.json({ success: true, user });
    } catch (error) {
      next(error);
    }
  },
};