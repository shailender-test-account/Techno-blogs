import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userrouter from "./routes/auth.route.js";
import merouter from "./routes/user.routes.js";
import blogrouter from "./routes/blog.routes.js";
import planrouter from "./routes/plan.routes.js";
import paymentrouter from "./routes/payment.routes.js";

// import authRoutes from "./routes/auth.routes.js";
// import userRoutes from "./routes/user.routes.js";
// import blogRoutes from "./routes/blog.routes.js";
// import likeRoutes from "./routes/like.routes.js";

// import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://techno-blogs-three.vercel.app" 
];
app.use(cors({
    origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// app.get("/", (req, res) => res.json({ message: "Blog API running 🚀" }));

// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/blogs", blogRoutes);
// app.use("/api/likes", likeRoutes);

// app.use(notFound);
// app.use(errorHandler);

app.use("/api/auth",userrouter)
app.use("/api/user",merouter)
app.use("/api/blog",blogrouter)
app.use("/api/plan",planrouter)
app.use("/api/payment",paymentrouter)



export default app;