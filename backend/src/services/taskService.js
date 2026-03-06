const db = require("../models");
const Task = db.Task;

/**
 * Get all tasks for logged-in user
 */
const getAllTasks = async (userId) => {
  return await Task.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
};

/**
 * Get single task (user restricted)
 */
const getTaskById = async (taskId, userId) => {
  return await Task.findOne({
    where: {
      id: taskId,
      userId,
    },
  });
};

/**
 * Create task
 */
const createTask = async (data, userId) => {
  return await Task.create({
    title: data.title,
    description: data.description,
    userId,
  });
};

/**
 * Update task (user restricted)
 */
const updateTask = async (taskId, data, userId) => {
  const task = await Task.findOne({
    where: { id: taskId, userId },
  });

  if (!task) return null;

  return await task.update(data);
};

/**
 * Delete task (user restricted)
 */
const deleteTask = async (taskId, userId) => {
  const deleted = await Task.destroy({
    where: { id: taskId, userId },
  });

  return deleted > 0;
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};