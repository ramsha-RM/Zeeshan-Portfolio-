/** Every string, colour-per-chip and row of the page. Edit copy here only. */

export const nav = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experts', label: 'Experts' },
  { id: 'contact', label: 'Contact' }
];

export const hero = {
  script: 'Meet the',
  headline: 'Product Designer',
  portraitAlt: 'The designer seated on a brown leather chesterfield sofa',
  stats: [
    { value: 3, suffix: '+', label: 'Years' },
    { value: 20, suffix: '+', label: 'Clients' }
  ]
};

export const capabilities = {
  eyebrow: 'Hello!',
  statement:
    'We help startups and enterprise to establish an emotional connection between their products and happy engaged customers',
  left: [
    { label: 'Design systems', color: '#FF9F55', icon: 'grid' },
    { label: 'UI/UX', color: '#3F3F3F', icon: 'cross' },
    { label: 'Research', color: '#14AEFB', icon: 'search' }
  ],
  right: [
    { label: 'Animation', color: '#4CD685', icon: 'play' },
    { label: 'Prototyping', color: '#FF45AB', icon: 'frame' },
    { label: 'Strategy', color: '#FFC531', icon: 'bars' }
  ]
};

/** Fallback list — replaced at runtime by GET /api/projects when the API is up. */
export const projects = [
  { slug: 'strida', name: 'Strida', tags: ['portfolio', 'sidebar'], image: '' },
  { slug: 'bravo', name: 'Bravo', tags: ['UI/UX', 'App'], image: '' },
  { slug: 'nitro', name: 'Nitro', tags: ['Design System', 'Web'], image: '' },
  { slug: 'fargo', name: 'Fargo', tags: ['SaaS', 'Web'], image: '' }
];

export const about = {
  eyebrow: 'About Me',
  heading: ['Pushing boundaries', 'since 2011'],
  name: 'Zeeshan Munawar',
  role: 'Product & UI-UX design',
  bio:
    'Zeeshan Munawar is a product designer known for his minimalist, expressive digital work. He helps startups and studios create clean interfaces and strong branding. Based in Utrecht, he blends function with emotion — and often spends his free time cycling or exploring generative art.',
  experience: [
    { role: 'Freelance Practice', company: 'Hanzo Co.', from: '2011', to: 'Now' },
    { role: 'Design Lead', company: 'Google', from: '2024', to: 'Now' },
    { role: 'Senior Designer', company: 'PayPal', from: '2019', to: '2024' },
    { role: 'Product Designer', company: 'Meta', from: '2016', to: '2019' }
  ],
  socials: ['instagram', 'linkedin', 'x']
};

export const contact = {
  eyebrow: '2 spots available',
  heading: ["Let's", 'Connect'],
  lines: [
    'Feel free to contact me if having any questions.',
    "I'm available for new projects or just for chatting."
  ],
  cta: 'Book a free intro call',
  footerChip: '✦ Hanzo Studio, 2025',
  socials: ['threads', 'x', 'linkedin', 'instagram']
};
