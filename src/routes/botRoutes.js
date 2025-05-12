import express from 'express';
import {
  createTask,
  getAllTasks,
  updateTaskStatus,
  deleteTask,
} from '../controllers/botController.js';

const router = express.Router();

router.post('/create', createTask);
router.get('/', getAllTasks);
router.patch('/:id', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;