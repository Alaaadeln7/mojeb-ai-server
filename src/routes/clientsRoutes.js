import express from "express";
import {
  createClient,
  deleteClient,
  getClients,
  getSingleClient,
  searchClient,
  updateClient,
} from "../controllers/clientController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { checkAdminRole } from "../middlewares/checkUserRole.js";

const router = express.Router();

router.post("/create", protectRoute, checkAdminRole, createClient);
router.get("/", protectRoute, checkAdminRole, getClients);
router.get("/search/:search", protectRoute, checkAdminRole, searchClient);
router.delete("/:id", protectRoute, checkAdminRole, deleteClient);
router.get("/:id", protectRoute, getSingleClient);
router.put("/:id", protectRoute, checkAdminRole, updateClient);

export default router;
