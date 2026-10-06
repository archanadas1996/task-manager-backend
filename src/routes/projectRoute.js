const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authorizeRoles("ADMIN", "USER"), getProjects);

router.get("/:id", authorizeRoles("ADMIN", "USER"), getProjectById);

router.post("/", authorizeRoles("ADMIN", "USER"), createProject);

router.put("/:id", authorizeRoles("ADMIN", "USER"), updateProject);

router.delete("/:id", authorizeRoles("ADMIN"), deleteProject);

module.exports = router;
