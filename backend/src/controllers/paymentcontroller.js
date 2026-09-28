import crypto from "crypto"
import { pool } from "../config/db.js";
import razorpay from "../config/razorpay.js";

export const createOrder = async (req, res) => {
  try {
    const { planKey, planName, amount, userId } = req.body;

    // Validation
    if (!planKey || !amount || !userId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Verify user exists
    const [users] = await pool.query("SELECT id, name, email FROM users WHERE id = ?", [userId]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = users[0];

    // Razorpay expects amount in paise (1 INR = 100 paise)
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        planKey,
        planName,
        userId: String(userId),
      },
    };

    const order = await razorpay.orders.create(options);

    // Save order to DB
    await pool.query(
      `INSERT INTO subscriptions 
       (user_id, plan_key, plan_name, amount, currency, status, razorpay_order_id) 
       VALUES (?, ?, ?, ?, ?, 'created', ?)`,
      [userId, planKey, planName, amount, "INR", order.id]
    );

    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      key: process.env.RAZ_API_KEY,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ success: false, message: "Failed to create order" });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZ_API_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await pool.query(
        `UPDATE subscriptions SET status = 'failed' WHERE razorpay_order_id = ?`,
        [razorpay_order_id]
      );
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const [rows] = await pool.query(
      `SELECT plan_key FROM subscriptions WHERE razorpay_order_id = ?`,
      [razorpay_order_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const planKey = rows[0].plan_key;

    // ✅ Pull duration from plans table (no more hardcoded mismatch)
    const [planRows] = await pool.query(
      `SELECT duration_days FROM plans WHERE plan_key = ? LIMIT 1`,
      [planKey]
    );

    const fallback = {
      "1_month": 30, "1-month": 30,
      "3_months": 90, "3-months": 90,
      "6_months": 180, "6-months": 180,
      "1_year": 365, "1-year": 365,
    };

    const days = planRows[0]?.duration_days || fallback[planKey] || 30;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    await pool.query(
      `UPDATE subscriptions 
       SET status = 'paid',
           razorpay_payment_id = ?,
           razorpay_signature = ?,
           start_date = ?,
           end_date = ?
       WHERE razorpay_order_id = ?`,
      [razorpay_payment_id, razorpay_signature, startDate, endDate, razorpay_order_id]
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      subscription: { startDate, endDate },
    });
  } catch (err) {
    console.error("verifyPayment error:", err);
    return res.status(500).json({ success: false, message: "Verification failed" });
  }
};


export const webhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ status: "invalid signature" });
    }

    const event = req.body.event;
    const payload = req.body.payload.payment.entity;

    if (event === "payment.captured") {
      await pool.query(
        `UPDATE subscriptions 
         SET status = 'paid', razorpay_payment_id = ? 
         WHERE razorpay_order_id = ?`,
        [payload.id, payload.order_id]
      );
    }

    if (event === "payment.failed") {
      await pool.query(
        `UPDATE subscriptions SET status = 'failed' WHERE razorpay_order_id = ?`,
        [payload.order_id]
      );
    }

    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("webhook error:", err);
    res.status(500).json({ status: "error" });
  }
};


export const getUserSubscriptions = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(
      `SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    res.json({ success: true, subscriptions: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};