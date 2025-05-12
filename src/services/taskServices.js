import Task from "../models/TaskModel.js";

export const executePendingTasks = async () => {
  try {
    const now = new Date();
    const tasks = await Task.find({
      status: 'pending',
      scheduledAt: { $lte: now },
    });

    for (const task of tasks) {
      console.log(`Executing Task: ${task.name}`);
      task.status = 'completed';
      await task.save();
    }
  } catch (error) {
    console.error('Error executing pending tasks:', error);
  }
};

setInterval(executePendingTasks, 60000);