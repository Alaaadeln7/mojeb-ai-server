import asyncHandler from "../middlewares/asyncHandler.js";
import Task from "../models/TaskModel.js";
import responseHandler from "../utils/response.js";

export const createTask = asyncHandler(async (req, res) => {
  const { name, description, scheduledAt } = req.body;
  const task = new Task({ name, description, scheduledAt });
  await task.save();
  return responseHandler(res, 201, 'Task created successfully');
});

export const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find();
  responseHandler(res, 200, 'Tasks retrieved successfully', tasks);
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
  return responseHandler(res, 200, 'Task status updated successfully', task);
})

export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  return responseHandler(res, 200, 'Task deleted successfully');
})