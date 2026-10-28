/** Every string, colour-per-chip and row of the page. Edit copy here only. */

const socials = [
  { name: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/zeeshan-munawar-uiux/' },
  { name: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/mshanm80/' },
  { name: 'x', label: 'Twitter', href: 'https://x.com/Mrzeesh19117365' }
];

export const nav = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experts', label: 'Expertise' },
  { id: 'contact', label: 'Contact' }
];

export const hero = {
  script: 'Meet the',
  headline: 'Product Designer',
  portraitAlt: 'Zeeshan Munawar, product designer, seated on a leather sofa',
  stats: [
    { value: 2, suffix: '+', label: 'Years' },
    { value: 20, suffix: '+', label: 'Products' }
  ]
};

export const capabilities = {
  eyebrow: 'Hello!',
  statement:
    'I turn complex business workflows into simple, clear web and mobile products that people enjoy using',
  left: [
    { label: 'Design systems', color: '#FF9F55', icon: 'grid' },
    { label: 'Dashboards', color: '#3F3F3F', icon: 'cross' },
    { label: 'User flows', color: '#14AEFB', icon: 'search' }
  ],
  right: [
    { label: 'Wireframing', color: '#4CD685', icon: 'play' },
    { label: 'Prototyping', color: '#FF45AB', icon: 'frame' },
    { label: 'Dev handoff', color: '#FFC531', icon: 'bars' }
  ]
};

/** Fallback list — replaced at runtime by GET /api/projects when the API is up. */
export const projects = [
  { slug: 'flujo', name: 'Flujo', tags: ['Healthcare', 'Web & Mobile'], image: '' },
  { slug: 'aces-awards', name: 'ACES Awards', tags: ['Events', 'Dashboard'], image: '' },
  { slug: 'deut', name: 'DEUT', tags: ['Enterprise', 'ERP'], image: '' },
  { slug: 'wepaak', name: 'Wepaak', tags: ['Logistics', 'Web'], image: '' }
];

export const about = {
  eyebrow: 'About Me',
  heading: ['Designing products', 'since 2024'],
  name: 'Zeeshan Munawar',
  role: 'UI/UX & Product Designer',
  bio:
    'I’m a UI/UX and product designer who turns complex workflows into clear, usable interfaces. I design web apps, dashboards and mobile products end to end — from user flows and wireframes to high-fidelity prototypes, design systems and developer handoff — and work closely with engineering so what ships matches what was designed.',
  experience: [
    { role: 'Associate Product & UI/UX Designer', company: 'Mercury Sols', from: 'Mar 2025', to: 'Now' },
    { role: 'UI/UX Designer (Project-based)', company: 'Sledge', from: 'Mar 2026', to: 'Jun 2026' },
    { role: 'UI/UX Designer', company: 'DevFor', from: 'Jul 2024', to: 'Feb 2025' }
  ],
  socials
};

export const contact = {
  eyebrow: 'Open to remote & on-site roles',
  heading: ["Let's", 'Connect'],
  lines: [
    'Have a product to design or a role to fill?',
    'I’m available for new projects, full-time roles, or just a chat.'
  ],
  cta: 'Send Message',
  email: 'mmzeeshanm8082@gmail.com',
  footerChip: '© Zeeshan Munawar, 2026',
  socials
};
