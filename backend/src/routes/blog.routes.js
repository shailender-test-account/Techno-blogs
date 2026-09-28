import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.js";
import { BlogController } from "../controllers/blogs.controller.js";

const blogrouter=express.Router();

blogrouter.post("/addblog",authMiddleware,authorize("admin"),upload.single("image"),BlogController.createBlog)
blogrouter.get("/allblogs",BlogController.getAllBlogs);
blogrouter.put("/editblog/:id",authMiddleware,authorize("admin"),BlogController.updateBlog)
blogrouter.delete("/delete/:id",authMiddleware,authorize("admin"),BlogController.deleteBlog)

export default blogrouter;