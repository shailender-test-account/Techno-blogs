import { pool } from "../config/db.js";

export const PlanModel = {
  /**
   * Create a new plan
   */
  async create({
    plan_key,
    plan_name,
    tag_label = null,
    tag_color = null,
    title,
    price,
    price_display,
    period = null,
    original_price = null,
    popular = 0,
    duration_days,
    currency = 'INR',
    features = null,
    is_active = 1,
  }) {
    const [result] = await pool.query(
      `INSERT INTO plans
        (plan_key, plan_name, tag_label, tag_color, title, price, price_display,
         period, original_price, popular, duration_days, currency, features, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        plan_key,
        plan_name,
        tag_label,
        tag_color,
        title,
        price,
        price_display,
        period,
        original_price,
        popular ? 1 : 0,
        duration_days,
        currency,
        features ? JSON.stringify(features) : null,
        is_active ? 1 : 0,
      ]
    );
    return result.insertId;
  },

  /**
   * Get all plans
   */
  async findAll() {
    const [rows] = await pool.query(`
      SELECT *
      FROM plans
      ORDER BY price ASC
    `);
    return rows.map(this._parse);
  },

  /**
   * Get only active plans (useful for public pricing page)
   */
  async findActive() {
    const [rows] = await pool.query(`
      SELECT *
      FROM plans
      WHERE is_active = 1
      ORDER BY price ASC
    `);
    return rows.map(this._parse);
  },

  /**
   * Get a single plan by ID
   */
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM plans WHERE id = ?`,
      [id]
    );
    return rows[0] ? this._parse(rows[0]) : null;
  },

  /**
   * Get a single plan by unique plan_key
   */
  async findByKey(plan_key) {
    const [rows] = await pool.query(
      `SELECT * FROM plans WHERE plan_key = ?`,
      [plan_key]
    );
    return rows[0] ? this._parse(rows[0]) : null;
  },

  /**
   * Get popular plans only
   */
  async findPopular() {
    const [rows] = await pool.query(`
      SELECT *
      FROM plans
      WHERE popular = 1 AND is_active = 1
      ORDER BY price ASC
    `);
    return rows.map(this._parse);
  },

  /**
   * Update a plan (partial update supported)
   * Pass only the fields you want to change.
   */
  async update(id, fields) {
    const allowed = {
      plan_key: 'plan_key',
      plan_name: 'plan_name',
      tag_label: 'tag_label',
      tag_color: 'tag_color',
      title: 'title',
      price: 'price',
      price_display: 'price_display',
      period: 'period',
      original_price: 'original_price',
      popular: 'popular',
      duration_days: 'duration_days',
      currency: 'currency',
      features: 'features',
      is_active: 'is_active',
    };

    const sets = [];
    const values = [];

    for (const [key, column] of Object.entries(allowed)) {
      if (fields[key] !== undefined) {
        sets.push(`${column} = ?`);

        if (key === 'features') {
          values.push(fields[key] ? JSON.stringify(fields[key]) : null);
        } else if (key === 'popular' || key === 'is_active') {
          values.push(fields[key] ? 1 : 0);
        } else {
          values.push(fields[key]);
        }
      }
    }

    if (sets.length === 0) return this.findById(id);

    values.push(id);
    await pool.query(
      `UPDATE plans SET ${sets.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  },

  /**
   * Delete a plan by ID
   */
  async delete(id) {
    await pool.query("DELETE FROM plans WHERE id = ?", [id]);
  },

  /**
   * Toggle active status
   */
  async setActive(id, isActive) {
    await pool.query(
      "UPDATE plans SET is_active = ? WHERE id = ?",
      [isActive ? 1 : 0, id]
    );
    return this.findById(id);
  },

  /**
   * Parse JSON `features` and cast TINYINT booleans
   */
  _parse(row) {
    if (row.features && typeof row.features === 'string') {
      try {
        row.features = JSON.parse(row.features);
      } catch {
        row.features = [];
      }
    }
    row.popular = !!row.popular;
    row.is_active = !!row.is_active;
    return row;
  },
};