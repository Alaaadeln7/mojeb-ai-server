import express from "express";
import {
  createClient,
  deleteClient,
  getClients,
  getSingleClient,
  updateClient,
} from "../controllers/clientController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { checkAdminRole } from "../middlewares/checkUserRole.js";

const router = express.Router();

router.post("/create", protectRoute, checkAdminRole, createClient);
router.get("/", protectRoute, checkAdminRole, getClients);
router.delete("/:id", protectRoute, checkAdminRole, deleteClient);
router.get("/:id", protectRoute, checkAdminRole, getSingleClient);
router.put("/:id", protectRoute, checkAdminRole, updateClient);

export default router;
