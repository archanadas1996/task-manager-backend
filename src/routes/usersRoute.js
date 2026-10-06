const express = require("express");

const { getUsers, createUser } = require("../controllers/userController");

const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", authorizeRoles("ADMIN"), getUsers);

router.post("/", authorizeRoles("ADMIN"), createUser);

module.exports = router;
