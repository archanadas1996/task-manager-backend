const commentService = require("../service/commentService");

// CREATE COMMENT
const createComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content, user_id } = req.body;

    if (!content || !user_id) {
      return res.status(400).json({
        message: "Content and user_id are required",
      });
    }

    const exists = await commentService.taskExists(taskId);

    if (!exists) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const comment = await commentService.createComment({
      content,
      taskId,
      user_id,
    });

    res.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    console.error("Create comment error:", error);

    res.status(500).json({
      message: "Failed to create comment",
    });
  }
};

// GET COMMENTS FOR TASK
const getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    const exists = await commentService.taskExists(taskId);

    if (!exists) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const comments = await commentService.getTaskComments(taskId);

    res.status(200).json(comments);
  } catch (error) {
    console.error("Get comments error:", error);

    res.status(500).json({
      message: "Failed to fetch comments",
    });
  }
};

// DELETE COMMENT
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await commentService.deleteComment(id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    res.status(500).json({
      message: "Failed to delete comment",
    });
  }
};

module.exports = {
  createComment,
  getTaskComments,
  deleteComment,
};
