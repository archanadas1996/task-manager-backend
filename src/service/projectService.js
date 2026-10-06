const pool = require("../config/db");

const getProjects = async ({ limit, offset, created_by }) => {
  let dataQuery = `
        SELECT
            p.id,
            p.name,
            p.description,
            p.created_by,
            u.name AS created_by_name,
            p.created_at
        FROM projects p
        LEFT JOIN users u
            ON p.created_by = u.id
    `;

  let countQuery = `
        SELECT COUNT(*) AS total
        FROM projects p
    `;

  const values = [];
  const conditions = [];

  // Filter projects by user
  if (created_by) {
    values.push(created_by);

    conditions.push(`p.created_by = $${values.length}`);
  }

  console.log("values", values);
  console.log("conditions", conditions);

  // Add WHERE to data query
  if (conditions.length > 0) {
    dataQuery += ` WHERE ${conditions.join(" AND ")}`;
    countQuery += ` WHERE ${conditions.join(" AND ")}`;
  }

  console.log("dataQuery1", dataQuery);
  dataQuery += `
        ORDER BY p.id
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
    `;
  console.log("dataQuery2", dataQuery);
  const dataValues = [...values, limit, offset];
  console.log("dataValues", dataValues);
  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, dataValues),
    pool.query(countQuery, values),
  ]);

  return {
    projects: dataResult.rows,
    total: Number(countResult.rows[0].total),
  };
};

const getProjectById = async (id) => {
  const result = await pool.query(
    `SELECT
                p.id,
                p.name,
                p.description,
                p.created_by,
                u.name AS created_by_name,
                p.created_at
             FROM projects p
             LEFT JOIN users u
                ON p.created_by = u.id
             WHERE p.id = $1`,
    [id],
  );

  return result.rows;
};

const createProject = async (name, description, created_by) => {
  const result = await pool.query(
    `INSERT INTO projects (name, description, created_by)
             VALUES ($1, $2, $3)
             RETURNING *`,
    [name, description || null, created_by],
  );

  return result.rows[0];
};

const updateProject = async (name, description, id) => {
  const result = await pool.query(
    `UPDATE projects
             SET name = $1,
                 description = $2
             WHERE id = $3
             RETURNING *`,
    [name, description || null, id],
  );

  return result.rows;
};

const deleteProject = async (id) => {
  const result = await pool.query(
    `DELETE FROM projects
             WHERE id = $1
             RETURNING *`,
    [id],
  );

  return result.rows;
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
