import mongoose from 'mongoose';
import { isDbConnected } from '../config/db.js';
import Project from '../models/Project.js';
import { isAdmin } from '../middleware/adminAuth.js';
import { publishProjectChange } from '../projectEvents.js';

const fallbackProjects = [
  {
    _id: 'fallback-strida',
    slug: 'strida',
    name: 'Strida',
    tags: ['portfolio', 'sidebar'],
    image: '',
    order: 1,
    published: true,
    details: {
      eyebrow: 'Selected Project',
      title: 'Project Case Study',
      role: 'Lead Product Designer',
      client: 'Strida Mobility Design',
      discipline: 'UX / UI / Hardware Companion',
      year: '2025',
      heroImage: '',
      heroLabel: 'Baby Sitter Project',
      heroCaption: 'Physical companion tablet screens in editorial studio setting',
      intro: {
        eyebrow: 'The Challenge',
        heading: 'Designing a clearer digital experience.',
        paragraphs: [
          "Strida's iconic folding architecture radically altered micro-mobility, yet the accompanying digital companion app fractured user attention with excessive telemetric noise and fragmented device pairing flows.",
          'Commuters required immediate vehicle status in bright sunlight, seamless fleet switching, and an interface that mirrored the physical bike\'s minimalist Swiss engineering.'
        ],
        image: ''
      },
      colors: [
        { name: 'Ink', hex: '#0C0D0E' },
        { name: 'Paper', hex: '#F7F7F6' },
        { name: 'Lime', hex: '#C4CD1C' }
      ],
      fonts: [
        { name: 'Anton', sample: 'Aa' },
        { name: 'Inter', sample: 'Aa' }
      ],
      sections: [
        {
          eyebrow: 'The Challenge',
          heading: 'Designing a clearer digital experience.',
          body: "Strida's iconic folding architecture radically altered micro-mobility, yet the accompanying digital companion app fractured user attention.",
          caption: 'Early structural exploration - iteration 04',
          captionRight: 'Wild layout logic',
          side: 'auto'
        }
      ],
      highlights: {
        eyebrow: 'The Challenge',
        heading: 'Three things changed the direction.',
        items: [
          { title: 'Simplify the journey', body: 'Dismantle the traditional 6-step catalog journey.' },
          { title: 'Simplify the journey', body: 'Users should arrive at any model\'s specifications.' },
          { title: 'Simplify the journey', body: 'Geometry comparisons within two taps.' }
        ]
      },
      screens: {
        eyebrow: 'Every Screen',
        heading: 'Designed beyond the desktop.',
        desktop: '',
        mobile: '',
        thankYou: ''
      }
    }
  },
  { _id: 'fallback-bravo', slug: 'bravo', name: 'Bravo', tags: ['UI/UX', 'App'], image: '', order: 2, published: true },
  { _id: 'fallback-nitro', slug: 'nitro', name: 'Nitro', tags: ['Design System', 'Web'], image: '', order: 3, published: true },
  { _id: 'fallback-fargo', slug: 'fargo', name: 'Fargo', tags: ['SaaS', 'Web'], image: '', order: 4, published: true },
  { _id: 'fallback-atlas', slug: 'atlas', name: 'Atlas', tags: ['Branding', 'Platform'], image: '', order: 5, published: true },
  { _id: 'fallback-solace', slug: 'solace', name: 'Solace', tags: ['Product', 'Mobile'], image: '', order: 6, published: true }
];

const orderProjects = (items) => [...items].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

// Read-only placeholder list used ONLY for public reads while the database is
// unavailable, so the public site still renders. Admin writes never touch it.
const publicFallback = () => orderProjects(fallbackProjects).filter((project) => project.published !== false);

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

class InputError extends Error {}

const cleanTags = (tags) => {
  if (!Array.isArray(tags)) throw new InputError('Tags must be a list');
  return tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 20);
};

/** Full document for POST: fills defaults for anything missing. */
export const sanitizeCreate = (body = {}) => {
  const name = String(body.name ?? '').trim();
  if (!name) throw new InputError('Project name is required');
  const slug = slugify(body.slug || name);
  if (!slug) throw new InputError('Project URL must contain letters or numbers');

  return {
    name,
    slug,
    tags: body.tags === undefined ? [] : cleanTags(body.tags),
    image: typeof body.image === 'string' ? body.image.trim() : '',
    order: Number(body.order) || 0,
    published: body.published !== false,
    details: isPlainObject(body.details) ? body.details : {}
  };
};

/**
 * Partial update for PUT: only fields present in the request are changed, so a
 * request that sends `{ name }` can no longer wipe tags, images or details.
 */
export const sanitizeUpdate = (body = {}) => {
  const has = (key) => Object.prototype.hasOwnProperty.call(body, key);
  const next = {};

  if (has('name')) {
    next.name = String(body.name ?? '').trim();
    if (!next.name) throw new InputError('Project name cannot be empty');
  }
  if (has('slug')) {
    next.slug = slugify(body.slug || next.name);
    if (!next.slug) throw new InputError('Project URL must contain letters or numbers');
  }
  if (has('tags')) next.tags = cleanTags(body.tags);
  if (has('image')) next.image = typeof body.image === 'string' ? body.image.trim() : '';
  if (has('order')) next.order = Number(body.order) || 0;
  if (has('published')) next.published = body.published !== false;
  if (has('details')) {
    if (!isPlainObject(body.details)) throw new InputError('Details must be an object');
    next.details = body.details;
  }

  return next;
};

const sendError = (res, err, label) => {
  if (err instanceof InputError) {
    return res.status(400).json({ message: err.message });
  }
  console.error(label, err.message);
  if (err.code === 11000) {
    return res.status(409).json({ message: 'A project with this URL already exists' });
  }
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ message: 'Some project fields are invalid. Please check and try again.' });
  }
  return res.status(503).json({ message: 'The database is temporarily unavailable. Your changes were not saved.' });
};

export const listProjects = async (_req, res) => {
  if (!isDbConnected()) {
    res.set('X-Data-Source', 'fallback');
    return res.json(publicFallback());
  }

  try {
    const projects = await Project.find({ published: true })
      .sort({ order: 1 })
      .select('slug name tags image order published');

    return res.json(projects);
  } catch (err) {
    console.error('Project list error:', err.message);
    res.set('X-Data-Source', 'fallback');
    return res.json(publicFallback());
  }
};

// Admin routes below are mounted behind requireDb, so they never operate on
// placeholder data.
export const listAllProjects = async (_req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1 }).select('-__v');
    return res.json(projects);
  } catch (err) {
    return sendError(res, err, 'Admin list error:');
  }
};

export const getProject = async (req, res) => {
  const slug = String(req.params.slug || '').toLowerCase();

  if (!isDbConnected()) {
    const project = publicFallback().find((item) => item.slug === slug);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.set('X-Data-Source', 'fallback');
    return res.json(project);
  }

  try {
    const filter = { slug };
    if (!isAdmin(req)) filter.published = true;

    const project = await Project.findOne(filter).select('-__v');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json(project);
  } catch (err) {
    console.error('Project lookup error:', err.message);
    return res.status(503).json({ message: 'The project could not be loaded right now' });
  }
};

export const createProject = async (req, res) => {
  try {
    const body = sanitizeCreate(req.body);
    if (!body.order) {
      body.order = (await Project.countDocuments()) + 1;
    }
    const project = await Project.create(body);
    publishProjectChange();
    return res.status(201).json(project);
  } catch (err) {
    return sendError(res, err, 'Create project error:');
  }
};

export const updateProject = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project id' });
    }

    const changes = sanitizeUpdate(req.body);
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.set(changes);
    await project.save();
    publishProjectChange();
    return res.json(project);
  } catch (err) {
    return sendError(res, err, 'Update project error:');
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

    publishProjectChange();
    return res.json({ ok: true });
  } catch (err) {
    return sendError(res, err, 'Delete project error:');
  }
};
