import express from "express";
import { createPlan, getAllPlans } from "../controllers/planController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { checkAdminRole } from "../middlewares/checkAdminRole.js";

const router = express.Router();

router.post("/create" , protectRoute , checkAdminRole, createPlan);

export default router;
