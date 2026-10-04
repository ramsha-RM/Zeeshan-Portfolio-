import mongoose from 'mongoose';
import Project from '../models/Project.js';
import { isAdmin } from '../middleware/adminAuth.js';

const fallbackProjects = [
  { slug: 'strida', name: 'Strida', tags: ['portfolio', 'sidebar'], image: '', order: 1, published: true },
  { slug: 'bravo', name: 'Bravo', tags: ['UI/UX', 'App'], image: '', order: 2, published: true },
  { slug: 'nitro', name: 'Nitro', tags: ['Design System', 'Web'], image: '', order: 3, published: true },
  { slug: 'fargo', name: 'Fargo', tags: ['SaaS', 'Web'], image: '', order: 4, published: true },
  { slug: 'atlas', name: 'Atlas', tags: ['Branding', 'Platform'], image: '', order: 5, published: true },
  { slug: 'solace', name: 'Solace', tags: ['Product', 'Mobile'], image: '', order: 6, published: true }
];

const fallbackProjectMap = new Map(fallbackProjects.map((project) => [project.slug, project]));

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const cleanBody = (body = {}) => {
  const { _id, __v, createdAt, updatedAt, ...rest } = body;
  if (rest.slug !== undefined || rest.name) {
    rest.slug = slugify(rest.slug || rest.name);
  }
  return rest;
};

const sendError = (res, err, label) => {
  console.error(label, err.message);
  if (err.code === 11000) {
    return res.status(409).json({ message: 'A project with this slug already exists' });
  }
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: err.message });
  }
  return res.status(503).json({ message: 'Database unavailable' });
};

export const listProjects = async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json(fallbackProjects);
  }

  try {
    const projects = await Project.find({ published: true })
      .sort({ order: 1 })
      .select('slug name tags image order published');

    res.json(projects);
  } catch (err) {
    console.error('Project list error:', err.message);
    res.status(503).json(fallbackProjects);
  }
};

export const listAllProjects = async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'Database is not connected' });
  }

  try {
    const projects = await Project.find().sort({ order: 1 }).select('-__v');
    res.json(projects);
  } catch (err) {
    sendError(res, err, 'Admin list error:');
  }
};

export const getProject = async (req, res) => {
  const slug = String(req.params.slug || '').toLowerCase();

  if (mongoose.connection.readyState !== 1) {
    const fallbackProject = fallbackProjectMap.get(slug);
    if (!fallbackProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    return res.json(fallbackProject);
  }

  try {
    const filter = { slug };
    if (!isAdmin(req)) filter.published = true;

    const project = await Project.findOne(filter).select('-__v');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    console.error('Project lookup error:', err.message);
    res.status(503).json({ message: 'Database unavailable' });
  }
};

export const createProject = async (req, res) => {
  try {
    const body = cleanBody(req.body);
    if (body.order === undefined) {
      body.order = (await Project.countDocuments()) + 1;
    }
    const project = await Project.create(body);
    res.status(201).json(project);
  } catch (err) {
    sendError(res, err, 'Create project error:');
  }
};

export const updateProject = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project id' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.set(cleanBody(req.body));
    await project.save();
    res.json(project);
  } catch (err) {
    sendError(res, err, 'Update project error:');
  }
};

export const deleteProject = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project id' });
    }

    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ ok: true });
  } catch (err) {
    sendError(res, err, 'Delete project error:');
  }
};