const pool = require("../config/db");
const getUsers = async ({ limit, offset }) => {
  const dataQuery = `
        SELECT
            id,
            name,
            email,
            created_at
        FROM users
        ORDER BY id
        LIMIT $1 OFFSET $2
    `;

  const countQuery = `
        SELECT COUNT(*) AS total
        FROM users
    `;

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, [limit, offset]),
    pool.query(countQuery),
  ]);

  return {
    users: dataResult.rows,
    total: Number(countResult.rows[0].total),
  };
};

const getUserById = async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

const createUser = async (name, email, password) => {
  const user = await pool.query(
    `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, created_at`,
    [name, email, password],
  );
  return user.rows[0];
};

module.exports = { getUsers, getUserById, createUser };
