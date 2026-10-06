const pool = require("../config/db");

// CHECK WHETHER TASK EXISTS
const taskExists = async (taskId) => {
  const result = await pool.query(
    `SELECT id
         FROM tasks
         WHERE id = $1`,
    [taskId],
  );

  return result.rows.length > 0;
};

// CREATE COMMENT
const createComment = async ({ content, taskId, user_id }) => {
  const result = await pool.query(
    `INSERT INTO comments
            (content, task_id, user_id)
         VALUES
            ($1, $2, $3)
         RETURNING *`,
    [content, taskId, user_id],
  );

  return result.rows[0];
};

// GET COMMENTS FOR A TASK
const getTaskComments = async (taskId) => {
  const result = await pool.query(
    `SELECT
            c.id,
            c.content,
            c.task_id,
            c.user_id,
            u.name AS user_name,
            c.created_at
         FROM comments c
         LEFT JOIN users u
            ON c.user_id = u.id
         WHERE c.task_id = $1
         ORDER BY c.id`,
    [taskId],
  );

  return result.rows;
};

// DELETE COMMENT
const deleteComment = async (id) => {
  const result = await pool.query(
    `DELETE FROM comments
         WHERE id = $1
         RETURNING *`,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  taskExists,
  createComment,
  getTaskComments,
  deleteComment,
};
