const express = require("express");

const app = express();

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/usersRoute");
const projectRoutes = require("./routes/projectRoute");
const taskRoutes = require("./routes/taskRoute");
const commentRoutes = require("./routes/commentRoute");

const logger = require("./middleware/logger");

app.use(express.json());

app.use(logger);
const authenticate = require("./middleware/authMiddleware");

app.use("/api/auth", authRoute);

app.use(authenticate);

app.use("/api/users", userRoute);
app.use("/api/projects", projectRoutes);
app.use("/api/task", taskRoutes);
app.use("/api", commentRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "task manager api is running",
  });
});

module.exports = app;
