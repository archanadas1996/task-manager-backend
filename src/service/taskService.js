const pool = require("../config/db");

// CREATE TASK
const createTask = async ({
  title,
  description,
  status,
  project_id,
  assigned_to,
}) => {
  const result = await pool.query(
    `INSERT INTO tasks
            (title, description, status, project_id, assigned_to)
         VALUES
            ($1, $2, $3, $4, $5)
         RETURNING *`,
    [title, description || null, status, project_id, assigned_to || null],
  );

  return result.rows[0];
};

// GET ALL TASKS
const getTasks = async ({ limit, offset, project_id, status }) => {
  let dataQuery = `
        SELECT
            t.id,
            t.title,
            t.description,
            t.status,
            t.project_id,
            p.name AS project_name,
            t.assigned_to,
            u.name AS assigned_user_name,
            t.created_at
        FROM tasks t
        LEFT JOIN projects p
            ON t.project_id = p.id
        LEFT JOIN users u
            ON t.assigned_to = u.id
    `;

  let countQuery = `
        SELECT COUNT(*) AS total
        FROM tasks t
    `;

  const values = [];
  const conditions = [];

  // Filter by project
  if (project_id) {
    values.push(project_id);

    conditions.push(`t.project_id = $${values.length}`);
  }

  // Filter by status
  if (status) {
    values.push(status);

    conditions.push(`t.status = $${values.length}`);
  }

  if (conditions.length > 0) {
    dataQuery += ` WHERE ${conditions.join(" AND ")}`;
    countQuery += ` WHERE ${conditions.join(" AND ")}`;
  }

  dataQuery += `
        ORDER BY t.id
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
    `;

  const dataValues = [...values, limit, offset];

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, dataValues),
    pool.query(countQuery, values),
  ]);

  return {
    tasks: dataResult.rows,
    total: Number(countResult.rows[0].total),
  };
};

// GET TASK BY ID
const getTaskById = async (id) => {
  const result = await pool.query(
    `SELECT
            t.id,
            t.title,
            t.description,
            t.status,
            t.project_id,
            p.name AS project_name,
            t.assigned_to,
            u.name AS assigned_user_name,
            t.created_at
         FROM tasks t
         LEFT JOIN projects p
            ON t.project_id = p.id
         LEFT JOIN users u
            ON t.assigned_to = u.id
         WHERE t.id = $1`,
    [id],
  );

  return result.rows[0];
};

// UPDATE TASK
const updateTask = async (
  id,
  { title, description, status, project_id, assigned_to },
) => {
  const result = await pool.query(
    `UPDATE tasks
         SET
            title = $1,
            description = $2,
            status = $3,
            project_id = $4,
            assigned_to = $5
         WHERE id = $6
         RETURNING *`,
    [title, description || null, status, project_id, assigned_to || null, id],
  );

  return result.rows[0];
};

// UPDATE TASK STATUS
const updateTaskStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE tasks
         SET status = $1
         WHERE id = $2
         RETURNING *`,
    [status, id],
  );

  return result.rows[0];
};

// DELETE TASK
const deleteTask = async (id) => {
  const result = await pool.query(
    `DELETE FROM tasks
         WHERE id = $1
         RETURNING *`,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
