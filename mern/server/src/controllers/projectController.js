import Project from '../models/Project.js';

export const listProjects = async (_req, res, next) => {
  try {
    const projects = await Project.find({ published: true })
      .sort({ order: 1 })
      .select('-__v');

    res.json(projects);
  } catch (err) {
    next(err);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug
    });

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);

    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};