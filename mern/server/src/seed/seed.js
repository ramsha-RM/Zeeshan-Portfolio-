import mongoose from 'mongoose';

import connectDB from '../config/db.js';
import Project from '../models/Project.js';

const projects = [
  {
    slug: 'strida',
    name: 'Strida',
    tags: ['Portfolio', 'Sidebar'],
    order: 1,
    details: {
      eyebrow: 'Selected Project',
      title: 'Project Case Study',
      role: 'Lead Product Designer',
      client: 'Strida Mobility Design',
      discipline: 'UX / UI / Hardware Companion',
      year: '2025',
      heroLabel: 'Baby Sitter Project',
      heroCaption: 'Physical companion tablet screens in editorial studio setting',
      intro: {
        eyebrow: 'The Challenge',
        heading: 'Designing a clearer digital experience.',
        paragraphs: [
          "Strida's iconic folding architecture radically altered micro-mobility, yet the accompanying digital companion app fractured user attention with excessive telemetric noise and fragmented device pairing flows.",
          'Commuters required immediate vehicle status in bright sunlight, seamless fleet switching, and an interface that mirrored the physical bike\'s minimalist Swiss engineering.'
        ]
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
        heading: 'Designed beyond the desktop.'
      }
    }
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