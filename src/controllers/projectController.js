const projectService = require("../service/projectService");

const getProjects = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const created_by = req.query.created_by;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: "Page and limit must be greater than 0",
      });
    }

    const offset = (page - 1) * limit;

    const result = await projectService.getProjects({
      limit,
      offset,
      created_by,
    });

    const totalPages = Math.ceil(result.total / limit);

    res.status(200).json({
      page,
      limit,
      created_by: created_by || null,
      totalProjects: result.total,
      totalPages,
      projects: result.projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await projectService.getProjectById(id);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Get project error:", error);

    res.status(500).json({
      message: "Failed to fetch project",
    });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description, created_by } = req.body;

    if (!name || !created_by) {
      return res.status(400).json({
        message: "Name and created_by are required",
      });
    }

    const result = await projectService.createProject(
      name,
      description,
      created_by,
    );

    res.status(201).json({
      message: "Project created successfully",
      project: result,
    });
  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      message: "Failed to create project",
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const result = await projectService.updateProject(name, description, id);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project updated successfully",
      project: result[0],
    });
  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      message: "Failed to update project",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const result = projectService.deleteProject(id);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      message: "Failed to delete project",
    });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
