// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

// export const generateToken = (payload) => {
//   return jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };

// export const verifyToken = (token) => {
//   return jwt.verify(token, process.env.JWT_SECRET);
// };


import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ;
const COOKIE_NAME = "token";

// Generate JWT
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify JWT
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// Cookie options
export const cookieOptions = {
  httpOnly: true,        // cannot be accessed by JS → protects against XSS
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "strict",    // protects against CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: "/",
};

export { COOKIE_NAME };