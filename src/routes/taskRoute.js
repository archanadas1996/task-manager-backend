const express = require("express");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authorizeRoles("ADMIN", "USER"), getTasks);

router.get("/:id", authorizeRoles("ADMIN", "USER"), getTaskById);

router.post("/", authorizeRoles("ADMIN", "USER"), createTask);

router.put("/:id", authorizeRoles("ADMIN"), updateTask);

router.patch(
  "/:id/status",

  authorizeRoles("ADMIN", "USER"),
  updateTaskStatus,
);

router.delete("/:id", authorizeRoles("ADMIN"), deleteTask);

module.exports = router;
