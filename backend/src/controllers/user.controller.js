import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model.js";


export const UserController = {
  async getProfile(req, res, next) {
    try {
      
      const user = await UserModel.findById(req.user.id);
     
    
      if (!user) return res.status(404).json({ message: "User not found" ,success:false});

       return res.status(200).json(
        {
          success:true,
          message:"User fetch successfully",
          user

        }
       )
    } catch (error) {
      next(error);
    }
  },

  async getAllUsers(req, res, next) {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, role, password } = req.body;

      // Regular user can only update own profile; admin can update anyone
      if (req.user.role !== "admin" && req.user.id !== Number(id)) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const user = await UserModel.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Only admin can change role
      const newRole = req.user.role === "admin" ? role || user.role : user.role;

      const updated = await UserModel.update(id, {
        name: name || user.name,
        email: email || user.email,
        role: newRole,
      });

      if (password) {
        const hashed = await bcrypt.hash(password, 10);
        // Optional: update password helper
      }

      res.json({ message: "User updated successfully", user: updated });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const user = await UserModel.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      await UserModel.delete(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};