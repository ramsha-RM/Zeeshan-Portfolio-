import mongoose from 'mongoose';

import connectDB from '../config/db.js';
import Project from '../models/Project.js';

const projects = [
  {
    slug: 'strida',
    name: 'Strida',
    tags: ['Portfolio', 'Sidebar'],
    order: 1,
  },
  {
    slug: 'bravo',
    name: 'Bravo',
    tags: ['UI/UX', 'App'],
    order: 2,
  },
  {
    slug: 'nitro',
    name: 'Nitro',
    tags: ['Design System', 'Web'],
    order: 3,
  },
  {
    slug: 'fargo',
    name: 'Fargo',
    tags: ['SaaS', 'Web'],
    order: 4,
  },
  {
    slug: 'project-five',
    name: 'Project Five',
    tags: ['React', 'GSAP'],
    order: 5,
  },
  {
    slug: 'project-six',
    name: 'Project Six',
    tags: ['MERN', 'Web'],
    order: 6,
  },
];
await connectDB();

await Project.deleteMany({});
await Project.insertMany(projects);

console.log('Seeded ' + projects.length + ' projects');

console.log('Database:', mongoose.connection.name);
console.log('Collection:', Project.collection.name);
console.log('Count:', await Project.countDocuments());

await mongoose.disconnect();
// try {
//   await connectDB();

//   await Project.deleteMany({});
//   await Project.insertMany(projects);

//   console.log(`Seeded ${projects.length} projects`);
// } catch (error) {
//   console.error('Seed error:', error);
// } finally {
//   await mongoose.disconnect();
// }