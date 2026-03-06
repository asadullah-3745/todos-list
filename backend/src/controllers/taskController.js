const taskService = require('../services/taskService');
const logger = require('../utils/logger');

/**
 * Get all tasks for the authenticated user
 */
const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const tasks = await taskService.getAllTasks(userId);
    logger.info(`Retrieved ${tasks.length} tasks for user ${userId}`);

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single task by ID (user can only view their own tasks)
 */
const getTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const task = await taskService.getTaskById(taskId, userId);

    if (!task) {
      logger.warn(`Task not found: ${taskId} for user ${userId}`);
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new task for the authenticated user
 */
const createTask = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const newTask = await taskService.createTask(req.body, userId);

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a task (user can only update their own tasks)
 */
const updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updatedTask = await taskService.updateTask(taskId, req.body, userId);

    if (!updatedTask) {
      logger.warn(`Task not found: ${taskId} for user ${userId}`);
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a task (user can only delete their own tasks)
 */
const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const isDeleted = await taskService.deleteTask(taskId, userId);

    if (!isDeleted) {
      logger.warn(`Task not found: ${taskId} for user ${userId}`);
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};

