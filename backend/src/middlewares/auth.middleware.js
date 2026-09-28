import { verifyToken} from "../utils/jwt.js";


export const authMiddleware = (req, res, next) => {
  try {
    let token = null;

    // 1. Cookie
    if (req.cookies && req.cookies["token"]) {
      token = req.cookies["token"];
    }

    // 2. Bearer header
    const authHeader = req.headers.authorization;
    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please log in.",
      });
    }


    console.log("my token is",token)

    // Verify
    const decoded = verifyToken(token);
    req.user = { id: decoded.id, role: decoded.role };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient permissions",
      });
    }
    next();
  };
};