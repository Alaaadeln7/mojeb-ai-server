import express from 'express';
import { createCall, getAllCalls, getCall } from '../controllers/callsController.js';
import { protectRoute } from '../middlewares/protectRoute.js';
const router = express.Router();
router.get('/calls', protectRoute, getAllCalls);
router.post('/calls', protectRoute, createCall);
router.get('/calls/:id', protectRoute, getCall);
export default router;