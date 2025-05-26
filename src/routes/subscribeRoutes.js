import express from "express";
import { checkClientRole } from "../middlewares/checkUserRole.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  cancelSubscription,
  makeSubscription,
} from "../controllers/subscribeController.js";

const router = express.Router();

router.post("/", protectRoute, checkClientRole, makeSubscription);
router.delete("/cancel", protectRoute, checkClientRole, cancelSubscription);

export default router;
