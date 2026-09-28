import { pool } from "../config/db.js";

export const UserModel = {
  async create({ name, email, password, role = "user" }) {
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, role]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  async findAll() {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC"
    );
    return rows;
  },

  async update(id, { name, email, role }) {
    await pool.query(
      "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
      [name, email, role, id]
    );
    return this.findById(id);
  },

  async delete(id) {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
  },
};