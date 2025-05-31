import express from "express";
import { createPlan, getAllPlans } from "../controllers/plansController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { checkAdminRole } from "../middlewares/checkUserRole.js";

const router = express.Router();

router.post("/create", protectRoute, checkAdminRole, createPlan);
router.get("/", protectRoute, checkAdminRole, getAllPlans);
export default router;
