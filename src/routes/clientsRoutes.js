import express from "express";
import {
  createClient,
  deleteClient,
  getClients,
  getSingleClient,
  searchClient,
  toggleEmailNotification,
  togglePerformanceReports,
  togglePlanUsageAlert,
  toggleTicketEscalationAlert,
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
router.put("/:id/update-client", protectRoute, updateClient);
router.post("/:id/email-notification", protectRoute, toggleEmailNotification);
router.post("/:id/plan-usage-alert", protectRoute, togglePlanUsageAlert);
router.post("/:id/performance-reports", protectRoute, togglePerformanceReports);
router.post(
  "/:id/ticket-escalation-alert",
  protectRoute,
  toggleTicketEscalationAlert
);
export default router;
