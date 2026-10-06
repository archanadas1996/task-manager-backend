const express = require("express");

const {
  createComment,
  getTaskComments,
  deleteComment,
} = require("../controllers/commentController");

const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/tasks/:taskId/comments",
  authorizeRoles("ADMIN", "USER"),
  createComment,
);

router.get(
  "/tasks/:taskId/comments",
  authorizeRoles("ADMIN", "USER"),
  getTaskComments,
);

router.delete("/comments/:id", authorizeRoles("ADMIN"), deleteComment);

module.exports = router;
