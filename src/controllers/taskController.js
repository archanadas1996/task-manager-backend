const taskService = require("../service/taskService");

const { ALLOWED_STATUSES } = require("../constants/taskConstants");

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const { title, description, status, project_id, assigned_to } = req.body;

    if (!title || !project_id) {
      return res.status(400).json({
        message: "Title and project_id are required",
      });
    }

    const taskStatus = status || "TODO";

    if (!ALLOWED_STATUSES.includes(taskStatus)) {
      return res.status(400).json({
        message: "Invalid task status",
        allowedStatuses: ALLOWED_STATUSES,
      });
    }

    const task = await taskService.createTask({
      title,
      description,
      status: taskStatus,
      project_id,
      assigned_to,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      message: "Failed to create task",
    });
  }
};

// GET ALL TASKS
const getTasks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const { project_id, status } = req.query;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: "Page and limit must be greater than 0",
      });
    }

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
        allowedStatuses: ALLOWED_STATUSES,
      });
    }

    const offset = (page - 1) * limit;

    const result = await taskService.getTasks({
      limit,
      offset,
      project_id,
      status,
    });

    const totalPages = Math.ceil(result.total / limit);

    res.status(200).json({
      page,
      limit,
      project_id: project_id || null,
      status: status || null,
      totalTasks: result.total,
      totalPages,
      tasks: result.tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};

// GET TASK BY ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await taskService.getTaskById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Get task error:", error);

    res.status(500).json({
      message: "Failed to fetch task",
    });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, status, project_id, assigned_to } = req.body;

    if (!title || !project_id || !status) {
      return res.status(400).json({
        message: "Title, status and project_id are required",
      });
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
        allowedStatuses: ALLOWED_STATUSES,
      });
    }

    const task = await taskService.updateTask(id, {
      title,
      description,
      status,
      project_id,
      assigned_to,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      message: "Failed to update task",
    });
  }
};

// UPDATE TASK STATUS
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
        allowedStatuses: ALLOWED_STATUSES,
      });
    }

    const task = await taskService.updateTaskStatus(id, status);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task status error:", error);

    res.status(500).json({
      message: "Failed to update task status",
    });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await taskService.deleteTask(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      message: "Failed to delete task",
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
