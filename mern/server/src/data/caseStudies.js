/**
 * Starter case studies (placeholder copy based on the CV).
 * Shared by: seed/seed.js, seed/addCaseStudies.js and the controller's
 * read-only fallback list (used only while the database is unreachable).
 * Images are left empty on purpose — upload them from /admin.
 */

const outcome = (items) => ({
  eyebrow: 'The Outcome',
  heading: 'Three things shaped the design.',
  items: items.map(([title, body]) => ({ title, body }))
});

const screens = {
  eyebrow: 'Every Screen',
  heading: 'Designed beyond the desktop.',
  desktop: '',
  mobile: '',
  thankYou: 'Thank you for scrolling'
};

const fonts = [{ name: 'Inter', sample: 'Aa' }];

const process = (cs) => [
  { eyebrow: 'The Process', heading: cs.process[0], body: cs.process[1], image: '', caption: 'User flows & wireframes', captionRight: cs.name, side: 'auto' },
  { eyebrow: 'The Structure', heading: cs.structure[0], body: cs.structure[1], image: '', caption: 'Information architecture', captionRight: cs.name, side: 'auto' },
  { eyebrow: 'The Solution', heading: cs.solution[0], body: cs.solution[1], image: '', caption: 'High-fidelity screens', captionRight: cs.name, side: 'auto' }
];

const build = (cs, order) => ({
  slug: cs.slug,
  name: cs.name,
  tags: cs.tags,
  image: '',
  order,
  published: true,
  details: {
    eyebrow: 'Selected Project',
    title: 'Project Case Study',
    role: 'Product & UI/UX Designer',
    client: cs.kind,
    discipline: cs.discipline,
    year: '',
    heroImage: '',
    heroLabel: cs.name,
    heroCaption: cs.caption,
    intro: { eyebrow: 'The Challenge', heading: cs.challenge[0], paragraphs: cs.challenge.slice(1), image: '' },
    colors: cs.colors.map(([name, hex]) => ({ name, hex })),
    fonts,
    sections: process(cs),
    highlights: outcome(cs.outcome),
    screens
  }
});

const raw = [
  {
    slug: 'flujo',
    name: 'Flujo',
    tags: ['Healthcare', 'Web & Mobile'],
    kind: 'Healthcare management platform',
    discipline: 'UX / UI · Web & Mobile',
    caption: 'Patient app and clinic dashboard',
    challenge: [
      'Bringing care into one clear flow.',
      'Clinics were juggling appointments, treatments and payments across disconnected tools, and patients had no single place to book, follow and pay for their care.',
      'Staff needed to see the day at a glance; patients needed booking and payment to feel effortless on a phone.',
      'The goal: one product family — a patient app and a staff dashboard — built on the same flows and the same components.'
    ],
    colors: [['Teal', '#0F766E'], ['Mint', '#E6F4F1'], ['Ink', '#1F2937'], ['Amber', '#F59E0B']],
    process: ['Mapping every patient moment.', 'I mapped the patient, appointment, treatment and payment journeys end to end with the clinic team, marking where people waited, repeated information or dropped off.'],
    structure: ['Two products, one system.', 'The patient mobile app and the staff admin dashboard share one component library, so a booking looks and behaves the same wherever it appears.'],
    solution: ['Simple steps, clear status.', 'Booking and payment became short step-by-step flows with clear progress. The dashboard opens on today’s schedule and surfaces what needs action first.'],
    outcome: [
      ['One place for care', 'Appointments, treatments and payments live in a single patient journey instead of separate tools.'],
      ['Built for clinic staff', 'The admin dashboard puts today’s schedule and pending actions first, so staff spend less time searching.'],
      ['One design system', 'Shared components keep the web dashboard and mobile app consistent and quicker to build.']
    ]
  },
  {
    slug: 'aces-awards',
    name: 'ACES Awards',
    tags: ['Events', 'Dashboard'],
    kind: 'Guest and event management platform',
    discipline: 'UX / UI · Web Dashboard',
    caption: 'Event command centre',
    challenge: [
      'Running an awards night from one dashboard.',
      'Registration, seating, accommodation and the award ceremony itself were managed across spreadsheets and email threads.',
      'Organisers needed to know who was coming, where they were sitting and where they were staying — without cross-checking five files.',
      'The goal: bring every event task into one clear dashboard that works from the first invite to the final award.'
    ],
    colors: [['Night', '#111827'], ['Gold', '#C8A24A'], ['Ivory', '#F6F2EA'], ['Slate', '#6B7280']],
    process: ['Following the event lifecycle.', 'I mapped the full lifecycle of an event — invites, registration, seating, rooms, ceremony night — and grouped every task under the stage where organisers actually do it.'],
    structure: ['A dashboard organised by stage.', 'Navigation follows the event timeline, so organisers always land on the work that matters right now, with guest status visible everywhere.'],
    solution: ['Seating and guests at a glance.', 'A visual seating planner, live guest status and accommodation views replace spreadsheets, with the ceremony running order in the same place.'],
    outcome: [
      ['One source of truth', 'Registration, seating, rooms and awards share one guest record instead of separate lists.'],
      ['Visual seating', 'Tables and seats are planned visually, so changes are made in seconds, not spreadsheet rows.'],
      ['Ready for the night', 'The ceremony view keeps the running order, nominees and winners in one calm screen.']
    ]
  },
  {
    slug: 'deut',
    name: 'DEUT',
    tags: ['Enterprise', 'ERP'],
    kind: 'Enterprise resource platform',
    discipline: 'UX / UI · Enterprise Web',
    caption: 'Inventory, budgets and approvals',
    challenge: [
      'Making data-heavy work feel manageable.',
      'DEUT covers inventory, budgeting, procurement and asset management — four modules full of dense tables and multi-step approvals.',
      'Teams needed to find a record, understand its status and act on it without wading through every column.',
      'The goal: a consistent table and approval pattern that works across all four modules.'
    ],
    colors: [['Navy', '#1E3A8A'], ['Mist', '#EEF2FF'], ['Ink', '#0F172A'], ['Green', '#22C55E']],
    process: ['Untangling the approval chains.', 'I mapped each module’s approval flow — who requests, who reviews, who signs off — and found the steps the modules had in common.'],
    structure: ['One pattern, four modules.', 'Every module uses the same table layout, filters and record panel, so learning one module means knowing them all.'],
    solution: ['Tables you can actually scan.', 'Smart defaults, saved filters and clear status chips make large tables readable, and approvals move through a visible step-by-step tracker.'],
    outcome: [
      ['Consistent modules', 'Inventory, budgeting, procurement and assets share one layout and component set.'],
      ['Readable data', 'Status chips, column priorities and saved filters cut long tables down to what matters.'],
      ['Visible approvals', 'Multi-step approvals show who has signed off and what is waiting, at every stage.']
    ]
  },
  {
    slug: 'wepaak',
    name: 'Wepaak',
    tags: ['Logistics', 'Web'],
    kind: 'Logistics and shipment platform',
    discipline: 'UX / UI · Web App',
    caption: 'Courier, import and export operations',
    challenge: [
      'Tracking every shipment without the noise.',
      'Wepaak’s teams manage courier, import and export shipments every day, each with its own documents, stages and exceptions.',
      'Operators needed to see what was moving, what was stuck and what needed them — the moment they opened the app.',
      'The goal: daily operations screens that make shipment status obvious and the next action one click away.'
    ],
    colors: [['Orange', '#EA580C'], ['Cream', '#FFF7ED'], ['Charcoal', '#1C1917'], ['Stone', '#A8A29E']],
    process: ['Shadowing a working day.', 'I mapped how operators move through a typical day — new bookings, status updates, customs and delivery exceptions — and designed around those moments.'],
    structure: ['Three flows, one tracker.', 'Courier, import and export each keep their own flow, but share one shipment tracker and timeline so status reads the same everywhere.'],
    solution: ['Status first, details on demand.', 'A daily operations view highlights exceptions first; each shipment opens to a clear timeline with documents and actions alongside.'],
    outcome: [
      ['Status at a glance', 'A single tracker shows where every shipment is and flags the ones that need attention.'],
      ['Shared timeline', 'Courier, import and export use the same timeline pattern, so teams switch flows easily.'],
      ['Built for daily use', 'Operations screens are tuned for repeated, fast actions rather than occasional browsing.']
    ]
  }
];

export const caseStudies = raw.map((cs, i) => build(cs, i + 1));

/** Template projects from the original starter, hidden (never deleted) by addCaseStudies.js. */
export const templateSlugs = ['strida', 'bravo', 'nitro', 'fargo', 'atlas', 'solace', 'project-five', 'project-six'];
