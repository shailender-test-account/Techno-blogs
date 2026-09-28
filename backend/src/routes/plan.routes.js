import express  from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { createPlan, getPlans} from "../controllers/plan.controller.js";

const planrouter=express.Router();
planrouter.get("/allplans",getPlans)
planrouter.post("/createplan",authMiddleware,authorize("admin"),createPlan)

export default planrouter;