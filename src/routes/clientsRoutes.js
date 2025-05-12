import express from "express";
import { createClient, deleteClient, getClients, getSingleClient, updateClient } from "../controllers/clientController.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();


router.post("/create", protectRoute, createClient);
router.get("/", protectRoute, getClients)
router.delete("/:id", protectRoute, deleteClient);
router.get("/:id", protectRoute, getSingleClient);
router.put("/:id", protectRoute, updateClient);

export default router;