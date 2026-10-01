import express  from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { createPlan, deletePlan, getPlans, updatePlan} from "../controllers/plan.controller.js";

const planrouter=express.Router();
planrouter.get("/allplans",getPlans)
planrouter.post("/createplan",authMiddleware,authorize("admin"),createPlan)
planrouter.put("/updateplan/:id",authMiddleware,authorize("admin"),updatePlan)
planrouter.delete("/deleteplan/:id",authMiddleware,authorize("admin"),deletePlan)

export default planrouter;