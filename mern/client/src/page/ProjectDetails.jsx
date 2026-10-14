import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Contact from '../components/Contact.jsx';
import ProjectCaseStudy from '../components/project-details/ProjectCaseStudy.jsx';
import useReveal from '../hooks/useReveal.js';
import { api } from '../lib/api.js';
import '../components/project-details/ProjectDetails.css';

const withDefaults = (p) => {
  const d = p.details || {};
  const intro = { eyebrow: '', heading: '', paragraphs: [], image: '', ...d.intro };
  const highlights = { eyebrow: '', heading: '', items: [], ...d.highlights };
  intro.paragraphs = d.intro?.paragraphs || [];
  highlights.items = d.highlights?.items || [];
  return {
    ...p,
    details: {
      eyebrow: '',
      title: p.name,
      role: '',
      client: '',
      discipline: '',
      year: '',
      heroImage: '',
      heroLabel: '',
      heroCaption: '',
      ...d,
      colors: d.colors || [],
      fonts: d.fonts || [],
      sections: d.sections || [],
      intro,
      highlights,
      screens: { eyebrow: '', heading: '', desktop: '', mobile: '', thankYou: '', ...d.screens }
    }
  };
};

export default function ProjectDetails() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: 'loading', project: null });

  useEffect(() => {
    let live = true;
    setState({ status: 'loading', project: null });
    window.scrollTo({ top: 0, behavior: 'instant' });

    api(`/api/projects/${encodeURIComponent(slug)}`)
      .then((data) => {
        if (live) setState({ status: 'ready', project: withDefaults(data) });
      })
      .catch((err) => {
        if (live) setState({ status: err.status === 404 ? 'missing' : 'error', project: null });
      });

    return () => {
      live = false;
    };
  }, [slug]);

  useEffect(() => {
    if (state.project) document.title = `${state.project.name} — Case Study`;
  }, [state.project]);

  useReveal([state.status, slug]);

  return (
    <>
      <Navbar />

      <main className="pd">
        {state.status === 'ready' && (
          <ProjectCaseStudy project={state.project} />
        )}

        {state.status === 'loading' && <p className="pd__state">Loading project…</p>}

        {(state.status === 'missing' || state.status === 'error') && (
          <div className="pd__state">
            <p>
              {state.status === 'missing'
                ? 'This project could not be found.'
                : 'The project could not be loaded right now.'}
            </p>
            <Link to="/">Back to home</Link>
          </div>
        )}
      </main>

      <Contact />
    </>
  );
}
