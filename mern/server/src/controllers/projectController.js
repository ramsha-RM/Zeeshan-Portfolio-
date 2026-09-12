import Project from '../models/Project.js';

const fallbackProjects = [
  { slug: 'strida', name: 'Strida', tags: ['portfolio', 'sidebar'], image: '', order: 1, published: true },
  { slug: 'bravo', name: 'Bravo', tags: ['UI/UX', 'App'], image: '', order: 2, published: true },
  { slug: 'nitro', name: 'Nitro', tags: ['Design System', 'Web'], image: '', order: 3, published: true },
  { slug: 'fargo', name: 'Fargo', tags: ['SaaS', 'Web'], image: '', order: 4, published: true },
  { slug: 'atlas', name: 'Atlas', tags: ['Branding', 'Platform'], image: '', order: 5, published: true },
  { slug: 'solace', name: 'Solace', tags: ['Product', 'Mobile'], image: '', order: 6, published: true }
];

export const listProjects = async (_req, res, next) => {
  try {
    const projects = await Project.find({ published: true })
      .sort({ order: 1 })
      .select('-__v');

    res.json(projects);
  } catch (err) {
    console.error('Project list error:', err.message);
    res.status(503).json(fallbackProjects);
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
    console.error('Project lookup error:', err.message);
    res.status(503).json({ message: 'Database unavailable' });
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);

    res.status(201).json(project);
  } catch (err) {
    console.error('Create project error:', err.message);
    res.status(503).json({ message: 'Database unavailable' });
  }
};