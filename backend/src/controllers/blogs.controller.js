import { BlogModel } from "../models/blog.model.js";
import { deleteCloudinaryImage } from "../middlewares/upload.js";
import Op from "sequelize"

/* ---------- Helpers ---------- */
const isOwnerOrAdmin = (blog, user) =>
  user?.role === "admin" || blog.user_id === user?.id;

const pickImageFromReq = (file) => ({
  image: file?.path || file?.secure_url || null,
  imagePublicId: file?.filename || file?.public_id || null,
});

/* ---------- Controllers ---------- */
export const BlogController = {

  async createBlog(req, res, next) {
    try {
      const {
        title,
        category,
        tags,
        excerpt,
        content,
        status,
        published_at,
      } = req.body;

      // Validate required fields
      const missing = [];
      if (!title?.trim()) missing.push("title");
      if (!category?.trim()) missing.push("category");
      if (!content?.trim()) missing.push("content");
      if (!req.file) missing.push("image");

      if (missing.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missing.join(", ")}`,
        });
      }

      // Auto-set published_at if status is published and no date given
      const finalStatus = status || "draft";
      let finalPublishedAt = published_at || null;
      if (finalStatus === "published" && !finalPublishedAt) {
        finalPublishedAt = new Date();
      }

      const { image, imagePublicId } = pickImageFromReq(req.file);

      const id = await BlogModel.create({
        title: title.trim(),
        category: category.trim(),
        tags: tags?.trim() || null,
        excerpt: excerpt?.trim() || null,
        content: content.trim(),
        image,
        imagePublicId,
        status: finalStatus,
        publishedAt: finalPublishedAt,
        userId: req.user.id,
      });

      const blog = await BlogModel.findById(id);
      res.status(201).json({ success: true, message: "Blog created", blog });
    } catch (error) {
      next(error);
    }
  },


  async getAllBlogs(req, res, next) {
    try {
      // Pass req.query directly to the model's findAll method
      const blogs = await BlogModel.findAll(req.query);

      return res.json({
        success: true,
        count: blogs.length,
        blogs
      });
    } catch (error) {
      next(error);
    }
  },


  async getblogbycategory(req, res, next) {
    try {
      const blogs = await BlogModel.findByCategory();
      return res.json({ success: true, blogs });
    } catch (error) {
      next(error);
    }
  },




  /**
   * GET /api/blogs/published
   */
  async getPublishedBlogs(req, res, next) {
    try {
      const blogs = await BlogModel.findPublished();
      return res.json({ success: true, blogs });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/blogs/user/:userId
   */
  async getBlogsByUser(req, res, next) {
    try {
      const blogs = await BlogModel.findByUser(req.params.userId);
      res.json({ success: true, blogs });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/blogs/:id
   */
  async getBlogById(req, res, next) {
    try {
      const blog = await BlogModel.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ success: false, message: "Blog not found" });
      }
      res.json({ success: true, blog });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/blogs/:id
   * Supports partial updates. If new image is uploaded, old one is removed from Cloudinary.
   */
  async updateBlog(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await BlogModel.findById(id);

      if (!existing) {
        return res.status(404).json({ success: false, message: "Blog not found" });
      }

      if (!isOwnerOrAdmin(existing, req.user)) {
        return res.status(403).json({ success: false, message: "Not authorized" });
      }

      // Build updates object (only fields present in body)
      const updates = {};
      const textFields = ["title", "category", "tags", "excerpt", "content", "status"];
      textFields.forEach((f) => {
        if (req.body[f] !== undefined) updates[f] = req.body[f];
      });
      if (req.body.published_at !== undefined) {
        updates.publishedAt = req.body.published_at || null;
      }

      // If new image was uploaded, delete old one from Cloudinary first
      if (req.file) {
        if (existing.image_public_id) {
          await deleteCloudinaryImage(existing.image_public_id);
        }
        const { image, imagePublicId } = pickImageFromReq(req.file);
        updates.image = image;
        updates.imagePublicId = imagePublicId;
      }

      // If transitioning to published and no date set, stamp it now
      if (
        updates.status === "published" &&
        !existing.published_at &&
        !updates.publishedAt
      ) {
        updates.publishedAt = new Date();
      }

      const updated = await BlogModel.update(id, updates);
      res.json({ success: true, message: "Blog updated", blog: updated });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/blogs/:id
   * Also removes the image from Cloudinary.
   */
  async deleteBlog(req, res, next) {
    try {
      const { id } = req.params;
      const blog = await BlogModel.findById(id);

      if (!blog) {
        return res.status(404).json({ success: false, message: "Blog not found" });
      }

      if (!isOwnerOrAdmin(blog, req.user)) {
        return res.status(403).json({ success: false, message: "Not authorized" });
      }

      // Delete from Cloudinary first (best-effort)
      if (blog.image_public_id) {
        await deleteCloudinaryImage(blog.image_public_id);
      }

      await BlogModel.delete(id);
      res.json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};