import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Contact from '../components/Contact.jsx';
import ProjectHero from '../components/project-details/ProjectHero.jsx';
import ProjectIntro from '../components/project-details/ProjectIntro.jsx';
import ProjectSections from '../components/project-details/ProjectSections.jsx';
import ProjectHighlights from '../components/project-details/ProjectHighlights.jsx';
import ProjectScreens from '../components/project-details/ProjectScreens.jsx';
import useReveal from '../hooks/useReveal.js';
import { api } from '../lib/api.js';
import '../components/project-details/ProjectDetails.css';

const withDefaults = (p) => {
  const d = p.details || {};
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
      colors: [],
      fonts: [],
      sections: [],
      ...d,
      intro: { eyebrow: '', heading: '', paragraphs: [], image: '', ...d.intro },
      highlights: { eyebrow: '', heading: '', items: [], ...d.highlights },
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
          <>
            <ProjectHero project={state.project} />
            <ProjectIntro project={state.project} />
            <ProjectSections project={state.project} />
            <ProjectHighlights project={state.project} />
            <ProjectScreens project={state.project} />
          </>
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
