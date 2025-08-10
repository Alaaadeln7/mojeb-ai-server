import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { createTicket, getTickets } from "../controllers/ticket.controller.js";
const router = express.Router();

router.post("/create", protectRoute, createTicket);
router.get("/", protectRoute, getTickets);
export default router;
