// import { useCallback, useEffect, useRef, useState } from 'react';
// import Navbar from '../components/Navbar.jsx';
// import Contact from '../components/Contact.jsx';
// import ProjectCaseStudy from '../components/project-details/ProjectCaseStudy.jsx';
// import { EditableImage, EditableText } from '../components/project-details/InlineEdit.jsx';
// import { api } from '../lib/api.js';
// import useReveal from '../hooks/useReveal.js';
// import '../components/project-details/ProjectDetails.css';
// import './Admin.css';

// const blankProject = () => ({
//   name: '',
//   slug: '',
//   tags: [],
//   image: '',
//   order: 0,
//   published: false,
//   details: {
//     eyebrow: 'Selected Project',
//     title: 'Project Case Study',
//     role: '',
//     client: '',
//     discipline: '',
//     year: '',
//     heroImage: '',
//     heroLabel: '',
//     heroCaption: '',
//     intro: { eyebrow: 'The Challenge', heading: '', paragraphs: [], image: '' },
//     colors: [],
//     fonts: [],
//     sections: [],
//     highlights: { eyebrow: 'The Challenge', heading: '', items: [] },
//     screens: { eyebrow: 'Every Screen', heading: '', desktop: '', mobile: '', thankYou: '' }
//   }
// });

// const withDefaults = (project) => {
//   const blank = blankProject();
//   const details = project.details || {};
//   return {
//     ...blank,
//     ...project,
//     tags: project.tags || [],
//     details: {
//       ...blank.details,
//       ...details,
//       intro: {
//         ...blank.details.intro,
//         ...details.intro,
//         paragraphs: details.intro?.paragraphs || []
//       },
//       colors: details.colors || [],
//       fonts: details.fonts || [],
//       sections: details.sections || [],
//       highlights: {
//         ...blank.details.highlights,
//         ...details.highlights,
//         items: details.highlights?.items || []
//       },
//       screens: { ...blank.details.screens, ...details.screens }
//     }
//   };
// };

// const setPath = (source, path, value) => {
//   const [key, ...rest] = path.split('.');
//   const copy = Array.isArray(source) ? [...source] : { ...source };
//   if (!rest.length) {
//     copy[key] = value;
//     return copy;
//   }
//   copy[key] = setPath(source?.[key] ?? (Array.isArray(source) ? [] : {}), rest.join('.'), value);
//   return copy;
// };

// const changeAt = (project, path, value) => {
//   const next = setPath(project, path, value);
//   if (path === 'details.title' && (!project.name || project.name === project.details.title)) {
//     next.name = value;
//   }
//   return next;
// };

// const updateListAt = (project, path, transform) => {
//   const current = path.split('.').reduce((value, key) => value?.[key], project);
//   return setPath(project, path, transform(Array.isArray(current) ? current : []));
// };

// function AdminGate({ onSubmit, error }) {
//   const [key, setKey] = useState('');
//   const [busy, setBusy] = useState(false);

//   async function submit(event) {
//     event.preventDefault();
//     setBusy(true);
//     try {
//       await onSubmit(key);
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <div className="adm adm--gate">
//       <form className="adm__gate" onSubmit={submit}>
//         <h1>Admin</h1>
//         <p>Sign in to edit the project case studies.</p>
//         <label htmlFor="admin-key" className="adm__label">Admin key</label>
//         <input
//           id="admin-key"
//           type="password"
//           autoComplete="current-password"
//           aria-invalid={error ? true : undefined}
//           aria-describedby={error ? 'admin-key-error' : undefined}
//           autoFocus
//           required
//           value={key}
//           onChange={(event) => setKey(event.target.value)}
//           placeholder="Admin key"
//         />
//         <button type="submit" className="adm__btn" disabled={busy}>
//           {busy ? 'Signing in…' : 'Sign in'}
//         </button>
//         {error && <small id="admin-key-error" className="adm__error" role="alert">{error}</small>}
//       </form>
//     </div>
//   );
// }

// function ProjectSettings({ project, update }) {
//   return (
//     <section className="pd__adminSettings shell" aria-label="Project settings">
//       <div className="pd__adminSettingsHead">
//         <div>
//           <span className="pd__adminKicker">Project setup</span>
//           <h2>Portfolio listing</h2>
//         </div>
//         <p>Manage how this project appears in your portfolio.</p>
//       </div>
//       <label className="pd__adminSetting">
//         <span>Project URL</span>
//         <EditableText
//           value={project.slug}
//           placeholder="project-url"
//           onChange={(value) => update('slug', value)}
//         />
//       </label>
//       <label className="pd__adminSetting pd__adminSetting--tags">
//         <span>Project tags</span>
//         <input
//           value={(project.tags || []).join(', ')}
//           placeholder="Design, Web, Mobile"
//           onChange={(event) => update('tags', event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))}
//         />
//       </label>
//       <label className="pd__adminSetting">
//         <span>Project order</span>
//         <input
//           type="number"
//           value={project.order || 0}
//           onChange={(event) => update('order', Number(event.target.value))}
//         />
//       </label>
//       <div className="pd__adminSetting pd__adminSetting--cover">
//         <span>Portfolio card image</span>
//         <EditableImage
//           src={project.image}
//           alt={`${project.name || 'Project'} portfolio card`}
//           onChange={(value) => update('image', value)}
//           emptyLabel="Add card image"
//         />
//       </div>
//     </section>
//   );
// }

// export default function Admin() {
//   const [authChecked, setAuthChecked] = useState(false);
//   const [authenticated, setAuthenticated] = useState(false);
//   const [authError, setAuthError] = useState('');
//   const [projects, setProjects] = useState([]);
//   const [project, setProject] = useState(null);
//   const [dirty, setDirty] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [status, setStatus] = useState('');

//   useReveal([
//     authenticated,
//     project?._id,
//     project?.details.sections.length,
//     project?.details.intro.paragraphs.length,
//     project?.details.colors.length,
//     project?.details.fonts.length,
//     project?.details.highlights.items.length
//   ]);

//   useEffect(() => {
//     if (!dirty) return undefined;
//     const warn = (event) => {
//       event.preventDefault();
//       event.returnValue = '';
//     };
//     window.addEventListener('beforeunload', warn);
//     return () => window.removeEventListener('beforeunload', warn);
//   }, [dirty]);

//   // Ctrl/Cmd+S saves, so saving isn't hidden behind the "More" menu.
//   const saveRef = useRef(null);
//   useEffect(() => {
//     const onKey = (event) => {
//       if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
//         event.preventDefault();
//         saveRef.current?.();
//       }
//     };
//     window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//   }, []);

//   const loadProjects = useCallback(async () => {
//     const list = await api('/api/projects/admin/all');
//     const normalized = list.map(withDefaults);
//     setProjects(normalized);
//     return normalized;
//   }, []);

//   useEffect(() => {
//     let active = true;
//     api('/api/admin/me')
//       .then(async ({ authenticated: hasSession }) => {
//         if (!active || !hasSession) return;
//         setAuthenticated(true);
//         try {
//           const list = await loadProjects();
//           if (active) setProject(list[0] || blankProject());
//         } catch (error) {
//           if (active) setStatus(`Admin session is active, but projects could not be loaded: ${error.message}`);
//         }
//       })
//       .catch((error) => {
//         if (active) setAuthError(error.message);
//       })
//       .finally(() => {
//         if (active) setAuthChecked(true);
//       });
//     return () => {
//       active = false;
//     };
//   }, [loadProjects]);

//   const signIn = async (key) => {
//     setAuthError('');
//     try {
//       await api('/api/admin/login', { method: 'POST', body: { passkey: key } });
//       setAuthenticated(true);
//       setStatus('');
//       try {
//         const list = await loadProjects();
//         setProject(list[0] || blankProject());
//       } catch (error) {
//         setProject(blankProject());
//         setStatus(`Signed in, but projects could not be loaded: ${error.message}`);
//       }
//     } catch (error) {
//       setAuthError(error.message);
//     }
//   };

//   const update = (path, value) => {
//     setProject((current) => changeAt(current, path, value));
//     setDirty(true);
//   };

//   const add = (path, item) => {
//     setProject((current) => updateListAt(current, path, (list) => [...list, item]));
//     setDirty(true);
//   };

//   const remove = (path, index) => {
//     setProject((current) => updateListAt(current, path, (list) => list.filter((_, itemIndex) => itemIndex !== index)));
//     setDirty(true);
//   };

//   const selectProject = (id) => {
//     if (dirty && !window.confirm('Discard unsaved edits and switch projects?')) return;
//     setProject(projects.find((item) => item._id === id) || blankProject());
//     setDirty(false);
//     setStatus('');
//   };

//   const addProject = () => {
//     if (dirty && !window.confirm('Discard unsaved edits and create a new project?')) return;
//     setProject(blankProject());
//     setDirty(true);
//     setStatus('New draft. Fill in the title and content, then choose Save changes in More.');
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const saveProject = async () => {
//     if (!project) return;
//     const name = String(project.name || project.details.title || '').trim();
//     if (!name) {
//       setStatus('Add a project title before saving.');
//       return;
//     }
//     setSaving(true);
//     setStatus('');
//     const payload = {
//       ...project,
//       name,
//       slug: project.slug || name,
//       details: project.details
//     };
//     try {
//       const saved = project._id
//         ? await api(`/api/projects/${encodeURIComponent(project._id)}`, { method: 'PUT', body: payload })
//         : await api('/api/projects', { method: 'POST', body: payload });
//       const next = withDefaults(saved);
//       const list = await loadProjects();
//       setProject(next);
//       setProjects(list);
//       setDirty(false);
//       setStatus('Project saved.');
//     } catch (error) {
//       setStatus(error.message);
//       if (error.status === 401) setAuthenticated(false);
//     } finally {
//       setSaving(false);
//     }
//   };

//   saveRef.current = dirty && !saving ? saveProject : null;

//   const togglePublished = () => {
//     if (!project) return;
//     update('published', !project.published);
//   };

//   const deleteProject = async () => {
//     if (!project?._id) {
//       setProject(blankProject());
//       setDirty(false);
//       setStatus('Unsaved draft discarded.');
//       return;
//     }
//     if (!window.confirm(`Delete “${project.name}”? This cannot be undone.`)) return;
//     try {
//       await api(`/api/projects/${encodeURIComponent(project._id)}`, { method: 'DELETE' });
//       const list = (await loadProjects()).filter((item) => item._id !== project._id);
//       setProjects(list);
//       setProject(list[0] || blankProject());
//       setDirty(false);
//       setStatus('Project deleted.');
//     } catch (error) {
//       setStatus(error.message);
//       if (error.status === 401) setAuthenticated(false);
//     }
//   };

//   const signOut = async () => {
//     try {
//       await api('/api/admin/logout', { method: 'POST' });
//       setAuthenticated(false);
//       setProject(null);
//       setProjects([]);
//       setDirty(false);
//       setAuthError('');
//     } catch (error) {
//       setStatus(`Could not sign out: ${error.message}`);
//     }
//   };

//   if (!authChecked) {
//     return <div className="adm adm--gate"><p>Checking admin session…</p></div>;
//   }
//   if (!authenticated) return <AdminGate onSubmit={signIn} error={authError} />;

//   return (
//     <>
//       <Navbar
//         adminTools
//         projects={projects}
//         selectedProjectId={project?._id}
//         published={Boolean(project?.published)}
//         dirty={dirty}
//         saving={saving}
//         onAddProject={addProject}
//         onSelectProject={selectProject}
//         onSaveProject={saveProject}
//         onDeleteProject={deleteProject}
//         onTogglePublish={togglePublished}
//         onSignOut={signOut}
//       />
//       <main className="pd pd--editable">
//         {status && <p className="pd__adminStatus shell" role="status">{status}</p>}
//         {dirty && (
//           <div className="pd__adminSaveBar shell">
//             <span>Unsaved changes</span>
//             <button type="button" className="adm__btn" onClick={saveProject} disabled={saving}>
//               {saving ? 'Saving…' : 'Save changes'}
//             </button>
//           </div>
//         )}
//         {project && (
//           <>
//             <ProjectSettings project={project} update={update} />
//             <div className="pd__adminPreview shell">
//               <span>Live case study preview</span>
//               <small>Click highlighted content to edit</small>
//             </div>
//             <ProjectCaseStudy
//               project={project}
//               editable
//               update={update}
//               add={add}
//               remove={remove}
//             />
//           </>
//         )}
//       </main>
//       <Contact />
//     </>
//   );
// }


import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Contact from '../components/Contact.jsx';
import ProjectCaseStudy from '../components/project-details/ProjectCaseStudy.jsx';
import { EditableImage, EditableText } from '../components/project-details/InlineEdit.jsx';
import { api } from '../lib/api.js';
import useReveal from '../hooks/useReveal.js';
import '../components/project-details/ProjectDetails.css';
import './Admin.css';

const blankProject = () => ({
  name: '',
  slug: '',
  tags: [],
  image: '',
  order: 0,
  published: false,
  details: {
    eyebrow: 'Selected Project',
    title: 'Project Case Study',
    role: '',
    client: '',
    discipline: '',
    year: '',
    heroImage: '',
    heroLabel: '',
    heroCaption: '',
    intro: { eyebrow: 'The Challenge', heading: '', paragraphs: [], image: '' },
    colors: [],
    fonts: [],
    sections: [],
    highlights: { eyebrow: 'The Challenge', heading: '', items: [] },
    screens: { eyebrow: 'Every Screen', heading: '', desktop: '', mobile: '', thankYou: '' }
  }
});

const withDefaults = (project) => {
  const blank = blankProject();
  const details = project.details || {};
  return {
    ...blank,
    ...project,
    tags: project.tags || [],
    details: {
      ...blank.details,
      ...details,
      intro: {
        ...blank.details.intro,
        ...details.intro,
        paragraphs: details.intro?.paragraphs || []
      },
      colors: details.colors || [],
      fonts: details.fonts || [],
      sections: details.sections || [],
      highlights: {
        ...blank.details.highlights,
        ...details.highlights,
        items: details.highlights?.items || []
      },
      screens: { ...blank.details.screens, ...details.screens }
    }
  };
};

const setPath = (source, path, value) => {
  const [key, ...rest] = path.split('.');
  const copy = Array.isArray(source) ? [...source] : { ...source };
  if (!rest.length) {
    copy[key] = value;
    return copy;
  }
  copy[key] = setPath(source?.[key] ?? (Array.isArray(source) ? [] : {}), rest.join('.'), value);
  return copy;
};

const changeAt = (project, path, value) => {
  const next = setPath(project, path, value);
  if (path === 'details.title' && (!project.name || project.name === project.details.title)) {
    next.name = value;
  }
  return next;
};

const updateListAt = (project, path, transform) => {
  const current = path.split('.').reduce((value, key) => value?.[key], project);
  return setPath(project, path, transform(Array.isArray(current) ? current : []));
};

function AdminGate({ onSubmit, error }) {
  const [key, setKey] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await onSubmit(key);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="adm adm--gate">
      <form className="adm__gate" onSubmit={submit}>
        <h1>Admin</h1>
        <p>Sign in to edit the project case studies.</p>
        <label htmlFor="admin-key" className="adm__label">Admin key</label>
        <input
          id="admin-key"
          type="password"
          autoComplete="current-password"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'admin-key-error' : undefined}
          autoFocus
          required
          value={key}
          onChange={(event) => setKey(event.target.value)}
          placeholder="Admin key"
        />
        <button type="submit" className="adm__btn" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        {error && <small id="admin-key-error" className="adm__error" role="alert">{error}</small>}
      </form>
    </div>
  );
}

function ProjectSettings({ project, update }) {
  return (
    <section className="pd__adminSettings shell" aria-label="Project settings">
      <div className="pd__adminSettingsHead">
        <div>
          <span className="pd__adminKicker">Project setup</span>
          <h2>Portfolio listing</h2>
        </div>
        <p>Manage how this project appears in your portfolio.</p>
      </div>
      <label className="pd__adminSetting">
        <span>Project URL</span>
        <EditableText
          value={project.slug}
          placeholder="project-url"
          onChange={(value) => update('slug', value)}
        />
      </label>
      <label className="pd__adminSetting pd__adminSetting--tags">
        <span>Project tags</span>
        <input
          value={(project.tags || []).join(', ')}
          placeholder="Design, Web, Mobile"
          onChange={(event) => update('tags', event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))}
        />
      </label>
      <label className="pd__adminSetting">
        <span>Project order</span>
        <input
          type="number"
          value={project.order || 0}
          onChange={(event) => update('order', Number(event.target.value))}
        />
      </label>
      <div className="pd__adminSetting pd__adminSetting--cover">
        <span>Portfolio card image</span>
        <EditableImage
          src={project.image}
          alt={`${project.name || 'Project'} portfolio card`}
          onChange={(value) => update('image', value)}
          emptyLabel="Add card image"
        />
      </div>
    </section>
  );
}

export default function Admin() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useReveal([
    authenticated,
    project?._id,
    project?.details.sections.length,
    project?.details.intro.paragraphs.length,
    project?.details.colors.length,
    project?.details.fonts.length,
    project?.details.highlights.items.length
  ]);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  useEffect(() => {
    if (!status) return undefined;
    const timer = setTimeout(() => setStatus(''), 6000);
    return () => clearTimeout(timer);
  }, [status]);

  const saveRef = useRef(null);
  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        saveRef.current?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const loadProjects = useCallback(async () => {
    const list = await api('/api/projects/admin/all');
    const normalized = list.map(withDefaults);
    setProjects(normalized);
    return normalized;
  }, []);

  useEffect(() => {
    let active = true;
    api('/api/admin/me')
      .then(async ({ authenticated: hasSession }) => {
        if (!active || !hasSession) return;
        setAuthenticated(true);
        try {
          const list = await loadProjects();
          if (active) setProject(list[0] || blankProject());
        } catch (error) {
          if (active) setStatus(`Admin session is active, but projects could not be loaded: ${error.message}`);
        }
      })
      .catch((error) => {
        if (active) setAuthError(error.message);
      })
      .finally(() => {
        if (active) setAuthChecked(true);
      });
    return () => {
      active = false;
    };
  }, [loadProjects]);

  const signIn = async (key) => {
    setAuthError('');
    try {
      await api('/api/admin/login', { method: 'POST', body: { passkey: key } });
      setAuthenticated(true);
      setStatus('');
      try {
        const list = await loadProjects();
        setProject(list[0] || blankProject());
      } catch (error) {
        setProject(blankProject());
        setStatus(`Signed in, but projects could not be loaded: ${error.message}`);
      }
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const update = (path, value) => {
    setProject((current) => changeAt(current, path, value));
    setDirty(true);
  };

  const add = (path, item) => {
    setProject((current) => updateListAt(current, path, (list) => [...list, item]));
    setDirty(true);
  };

  const remove = (path, index) => {
    setProject((current) => updateListAt(current, path, (list) => list.filter((_, itemIndex) => itemIndex !== index)));
    setDirty(true);
  };

  const selectProject = (id) => {
    if (dirty && !window.confirm('Discard unsaved edits and switch projects?')) return;
    setProject(projects.find((item) => item._id === id) || blankProject());
    setDirty(false);
    setStatus('');
  };

  const addProject = () => {
    if (dirty && !window.confirm('Discard unsaved edits and create a new project?')) return;
    setProject(blankProject());
    setDirty(true);
    setStatus('New draft. Fill in the title and content, then choose Save changes in More.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveProject = async () => {
    if (!project) return;
    const name = String(project.name || project.details.title || '').trim();
    if (!name) {
      setStatus('Add a project title before saving.');
      return;
    }
    setSaving(true);
    setStatus('');
    const payload = {
      ...project,
      name,
      slug: project.slug || name,
      details: project.details
    };
    try {
      const saved = project._id
        ? await api(`/api/projects/${encodeURIComponent(project._id)}`, { method: 'PUT', body: payload })
        : await api('/api/projects', { method: 'POST', body: payload });
      const next = withDefaults(saved);
      const list = await loadProjects();
      setProject(next);
      setProjects(list);
      setDirty(false);
      setStatus('Project saved.');
    } catch (error) {
      setStatus(error.message);
      if (error.status === 401) setAuthenticated(false);
    } finally {
      setSaving(false);
    }
  };

  saveRef.current = dirty && !saving ? saveProject : null;

  const togglePublished = () => {
    if (!project) return;
    update('published', !project.published);
  };

  const deleteProject = async () => {
    if (!project?._id) {
      setProject(blankProject());
      setDirty(false);
      setStatus('Unsaved draft discarded.');
      return;
    }
    if (!window.confirm(`Delete “${project.name}”? This cannot be undone.`)) return;
    try {
      await api(`/api/projects/${encodeURIComponent(project._id)}`, { method: 'DELETE' });
      const list = (await loadProjects()).filter((item) => item._id !== project._id);
      setProjects(list);
      setProject(list[0] || blankProject());
      setDirty(false);
      setStatus('Project deleted.');
    } catch (error) {
      setStatus(error.message);
      if (error.status === 401) setAuthenticated(false);
    }
  };

  const signOut = async () => {
    try {
      await api('/api/admin/logout', { method: 'POST' });
      setAuthenticated(false);
      setProject(null);
      setProjects([]);
      setDirty(false);
      setAuthError('');
    } catch (error) {
      setStatus(`Could not sign out: ${error.message}`);
    }
  };

  if (!authChecked) {
    return <div className="adm adm--gate"><p>Checking admin session…</p></div>;
  }
  if (!authenticated) return <AdminGate onSubmit={signIn} error={authError} />;

  return (
    <>
      <Navbar
        adminTools
        projects={projects}
        selectedProjectId={project?._id}
        published={Boolean(project?.published)}
        dirty={dirty}
        saving={saving}
        onAddProject={addProject}
        onSelectProject={selectProject}
        onSaveProject={saveProject}
        onDeleteProject={deleteProject}
        onTogglePublish={togglePublished}
        onSignOut={signOut}
      />
      <main className="pd pd--editable">
        {status && <p className="pd__adminStatus shell" role="status">{status}</p>}
        {dirty && (
          <div className="pd__adminSaveBar shell">
            {/* <span>Unsaved changes</span> */}
            <button type="button" className="adm__btn" onClick={saveProject} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        )}
        {project && (
          <>
            <ProjectCaseStudy
              project={project}
              editable
              update={update}
              add={add}
              remove={remove}
            />
            <ProjectSettings project={project} update={update} />
          </>
        )}
      </main>
      <Contact />
    </>
  );
}