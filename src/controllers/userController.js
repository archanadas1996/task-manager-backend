const userService = require("../service/userService");

const getUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: "Page and limit must be greater than 0",
      });
    }

    const offset = (page - 1) * limit;

    const result = await userService.getUsers({
      limit,
      offset,
    });

    const totalPages = Math.ceil(result.total / limit);

    res.status(200).json({
      page,
      limit,
      totalUsers: result.total,
      totalPages,
      users: result.users,
    });
  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

const getUserByID = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if ((!name, !password, !email)) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }
    const user = await userService.createUser(name, email, password);

    res.status(201).json({ message: "user created successfully", user });
  } catch (error) {}
};

module.exports = {
  getUsers,
  getUserByID,
  createUser,
};
