import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Contact from '../components/Contact.jsx';
import ProjectCaseStudy from '../components/project-details/ProjectCaseStudy.jsx';
import useReveal from '../hooks/useReveal.js';
import { api, apiBase } from '../lib/api.js';
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
    let refreshing = false;
    let refreshPending = false;
    let hasLoaded = false;
    let errorLogged = false;
    setState({ status: 'loading', project: null });
    window.scrollTo({ top: 0, behavior: 'instant' });

    const refresh = async () => {
      if (!live || document.hidden) return;
      if (refreshing) {
        refreshPending = true;
        return;
      }
      refreshing = true;
      try {
        const data = await api(`/api/projects/${encodeURIComponent(slug)}`);
        hasLoaded = true;
        errorLogged = false;
        if (live) setState({ status: 'ready', project: withDefaults(data) });
      } catch (err) {
        if (!live) return;
        if (err.status === 404) {
          hasLoaded = true;
          setState({ status: 'missing', project: null });
        } else {
          if (!hasLoaded) setState({ status: 'error', project: null });
          if (!errorLogged) {
            console.error('Could not refresh project case study:', err);
            errorLogged = true;
          }
        }
      } finally {
        refreshing = false;
        if (refreshPending && live && !document.hidden) {
          refreshPending = false;
          refresh();
        }
      }
    };

    const refreshWhenVisible = () => {
      if (!document.hidden) refresh();
    };

    const events = new EventSource(`${apiBase}/api/projects/events`, { withCredentials: true });
    events.addEventListener('projects-changed', refreshWhenVisible);
    refresh();
    const interval = window.setInterval(refresh, 30000);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    window.addEventListener('focus', refreshWhenVisible);

    return () => {
      live = false;
      events.close();
      window.clearInterval(interval);
      events.removeEventListener('projects-changed', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      window.removeEventListener('focus', refreshWhenVisible);
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
