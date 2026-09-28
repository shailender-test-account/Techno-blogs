import { pool } from "../config/db.js";

export const BlogModel = {
  /**
   * Create a new blog post
   */
  async create({
    title,
    category,
    tags = null,
    excerpt = null,
    content,
    image,
    status = 'draft',
    publishedAt = null,
    userId,
  }) {
    const [result] = await pool.query(
      `INSERT INTO blogs
        (title, category, tags, excerpt, content, image, status, published_at, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, category, tags, excerpt, content, image, status, publishedAt, userId]
    );
    return result.insertId;
  },

  /**
   * Get all blogs with author + like/dislike counts
   */
  async findAll(queryParams = {}) {
  const { title, category, status } = queryParams;

  // Base query with your joins and subqueries
  let query = `
    SELECT
      b.id, b.title, b.category, b.tags, b.excerpt, b.content,
      b.image, b.status, b.published_at,
      b.user_id, b.created_at, b.updated_at,
      u.name AS author_name,
      (SELECT COUNT(*) FROM likes WHERE blog_id = b.id AND type = 'like')    AS likes,
      (SELECT COUNT(*) FROM likes WHERE blog_id = b.id AND type = 'dislike') AS dislikes
    FROM blogs b
    JOIN users u ON u.id = b.user_id
  `;

  const conditions = [];
  const values = [];

  // Dynamically add filters if they exist in req.query
  if (title) {
    conditions.push('b.title LIKE ?');
    values.push(`%${title}%`); // Partial match for title
  }
  if (category) {
    conditions.push('b.category = ?');
    values.push(category); // Exact match for category
  }
  if (status) {
    conditions.push('b.status = ?');
    values.push(status); // Exact match for status
  }

  // If filters are present, append the WHERE clause
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  // Add the sorting back at the end
  query += ` ORDER BY b.created_at DESC`;

  // Execute query safely with values array to prevent SQL injection
  const [rows] = await pool.query(query, values);
  return rows;
},

  /**
   * Get a single blog by ID
   */
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT
        b.*,
        u.name AS author_name,
        (SELECT COUNT(*) FROM likes WHERE blog_id = b.id AND type = 'like')    AS likes,
        (SELECT COUNT(*) FROM likes WHERE blog_id = b.id AND type = 'dislike') AS dislikes
       FROM blogs b
       JOIN users u ON u.id = b.user_id
       WHERE b.id = ?`,
      [id]
    );
    return rows[0];
  },

  /**
   * Update a blog post (partial update supported)
   * Pass only the fields you want to change.
   */
  async update(id, fields) {
    const allowed = {
      title: 'title',
      category: 'category',
      tags: 'tags',
      excerpt: 'excerpt',
      content: 'content',
      image: 'image',
      status: 'status',
      published_at: 'published_at',
    };

    const sets = [];
    const values = [];

    for (const [key, column] of Object.entries(allowed)) {
      if (fields[key] !== undefined) {
        sets.push(`${column} = ?`);
        values.push(fields[key]);
      }
    }

    if (sets.length === 0) return this.findById(id);

    values.push(id);
    await pool.query(
      `UPDATE blogs SET ${sets.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  },

  /**
   * Delete a blog by ID
   */
  async delete(id) {
    await pool.query("DELETE FROM blogs WHERE id = ?", [id]);
  },

  /**
   * Get all blogs by a specific user
   */
  async findByUser(userId) {
    const [rows] = await pool.query(
      `SELECT
        b.id, b.title, b.category, b.tags, b.excerpt, b.content,
        b.image, b.status, b.published_at,
        b.user_id, b.created_at, b.updated_at
       FROM blogs b
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [userId]
    );
    return rows;
  },

  /**
   * Get only published blogs (useful for public blog list)
   */
  async findPublished() {
    const [rows] = await pool.query(`
      SELECT
        b.id, b.title, b.category, b.tags, b.excerpt, b.image,
        b.published_at, b.created_at,
        u.name AS author_name
      FROM blogs b
      JOIN users u ON u.id = b.user_id
      WHERE b.status = 'published'
      ORDER BY b.published_at DESC, b.created_at DESC
    `);
    return rows;
  },

  /**
   * Get blogs filtered by category
   */
  async findByCategory(category) {
    const [rows] = await pool.query(
      `SELECT
        b.id, b.title, b.category, b.tags, b.excerpt, b.image,
        b.published_at, b.created_at,
        u.name AS author_name
       FROM blogs b
       JOIN users u ON u.id = b.user_id
       WHERE b.category = ? AND b.status = 'published'
       ORDER BY b.published_at DESC`,
      [category]
    );
    return rows;
  },
};