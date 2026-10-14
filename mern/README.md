# Portfolio — MERN Stack

Editorial-minimal portfolio landing page. Front end is React (Vite), back end is
Express + MongoDB (Mongoose). No CSS framework, no animation library.

## Structure

    mern/
    ├── client/                      React front end
    │   ├── index.html               the ONE place the Google Fonts are loaded
    │   ├── vite.config.js           /api proxied to :5000
    │   └── src/
    │       ├── main.jsx             entry — mounts <App/>, imports global CSS
    │       ├── App.jsx              page composition (section order lives here)
    │       ├── data/site.js         ALL copy, chip colours, projects, CV rows
    │       ├── styles/
    │       │   ├── tokens.css       design tokens — colour, type, radii, easing
    │       │   ├── base.css         reset, shared type, .shell, .pill
    │       │   └── animations.css   @keyframes + every reveal/entrance class
    │       ├── hooks/               one hook per behaviour (table below)
    │       ├── components/          Name.jsx + Name.css side by side
    │       │   └── ui/              Icon, Eyebrow, PillButton, Chip, SocialRow
    │       └── assets/hero-portrait.png
    └── server/                      Express API
        └── src/
            ├── index.js             app bootstrap
            ├── config/db.js         Mongo connection
            ├── models/              Project, Lead
            ├── controllers/         request handlers
            ├── routes/              /api/projects, /api/leads
            ├── middleware/          404 + error handler
            └── seed/seed.js         loads the four case studies

## Run

    # server
    cd server && cp .env.example .env && npm i && npm run seed && npm run dev   # :5000
    # client
    cd client && npm i && npm run dev                                          # :5173

Or from `mern/`: `npm i && npm run dev` (runs both).

## Fonts

Loaded once in `client/index.html`, aliased in `styles/tokens.css`:

| Token | Family | Used for |
|---|---|---|
| `--font-display` | Anton | the one giant hero headline |
| `--font-ui` | Inter | section headings, bio prose, stat numbers, footer headline |
| `--font-geo` | Jost | body default — buttons, chips, statement, meta, CV |
| `--font-serif` | Instrument Serif | italic eyebrows above sections |
| `--font-script` | Ms Madi | the "Meet the" line only |

Change a family in `tokens.css`, never in a component.

## Colour

All eleven page colours plus the six chip colours are tokens in `tokens.css`.
`--accent` (lime `#c4cd1c`) is used exactly twice: the "Meet the" script line and
the showreel cursor glow.

## Animations — where each one lives

| Behaviour | File |
|---|---|
| Hero load sequence: script → headline mask wipe → portrait → stats | `hooks/useLoadSequence.js` + `[data-load]` in `animations.css` |
| Headline fitted to one unwrapped line at any width | `hooks/useHeadlineFit.js` |
| Scroll reveals (`data-reveal`, `left`/`right`, `--d` stagger) | `hooks/useReveal.js` |
| Word-by-word heading rise out of a clipped edge | `hooks/useSplitText.js` + `.word` |
| Capsules flying in off-screen, then floating | `hooks/useFlyIn.js` + `.chip[data-fly]` |
| Stat count-up (0→3, 0→20) | `hooks/useCountUp.js` |
| Hero parallax | `hooks/useParallax.js` |
| Magnetic buttons (nav CTA, reel disc, contact button) | `hooks/useMagnetic.js` |
| Project-grid "View →" cursor follower | `hooks/useCursorFollower.js` |
| Showreel tile stagger + lime cursor glow | `components/Showreel.jsx` |
| Frosted header past 24px | `hooks/useStickyHeader.js` |
| Active menu link | `hooks/useScrollSpy.js` |

Every transition uses `var(--ease)`. `prefers-reduced-motion: reduce` is honoured
in `animations.css` and early-returns inside each hook.

## Navigation

The header holds only the logo, a **Menu** hamburger pill and the **Let's Talk**
pill — same shape, same badge. The hamburger's two bars cross into an X and a
frosted panel drops under the bar with the five links staggered in. It closes on
link click, outside click and Escape. Markup: `components/Navbar.jsx`.

## API

| Method | Route | Notes |
|---|---|---|
| GET | `/api/health` | liveness |
| GET | `/api/projects` | published case studies, ordered |
| GET | `/api/projects/:slug` | one case study |
| POST | `/api/projects` | create (admin session required) |
| POST | `/api/leads` | contact form submissions |

`Projects.jsx` fetches `/api/projects` and silently falls back to the static list
in `data/site.js`, so the front end runs with the API off.

## Admin access

Set `ADMIN_KEY` and `ADMIN_SESSION_SECRET` in `server/.env` (and in the
production server's secret settings). Generate two independent random secrets
with:

    node -e "const c=require('crypto'); console.log('ADMIN_KEY='+c.randomBytes(32).toString('base64url')); console.log('ADMIN_SESSION_SECRET='+c.randomBytes(32).toString('base64url'))"

Both values must be at least 32 characters. Do not commit `.env`, expose either
value in client-side code, or reuse the same value for both settings. After
sign-in, the server issues a 30-minute HttpOnly session cookie; the browser
does not retain or resend the admin key. Production deployments must configure
`CLIENT_ORIGINS` to the exact frontend origin(s), and the API must be served
over HTTPS.

## Still to do

- Drop the four case-study images into `client/src/assets/` and set `image` on each
  project (seed or API).
- Add the about portrait at `client/src/assets/portrait.jpg` and swap
  `.about__photoInner` for an `<img>`.
- Wire the "Book a free intro call" button to `POST /api/leads`.
