import { useCallback, useEffect, useState } from 'react';
import { api, uploadImage } from '../lib/api.js';
import './Admin.css';

const blank = () => ({
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

const normalise = (p) => {
  const b = blank();
  const d = p.details || {};
  return {
    ...b,
    ...p,
    details: {
      ...b.details,
      ...d,
      intro: { ...b.details.intro, ...d.intro },
      highlights: { ...b.details.highlights, ...d.highlights },
      screens: { ...b.details.screens, ...d.screens }
    }
  };
};

const getIn = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

const setIn = (obj, path, value) => {
  const keys = path.split('.');
  const root = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur = root;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      cur[k] = value;
    } else {
      cur[k] = Array.isArray(cur[k]) ? [...cur[k]] : { ...cur[k] };
      cur = cur[k];
    }
  });
  return root;
};

const prepare = (form) => ({
  ...form,
  order: Number(form.order) || 0,
  tags: form.tags.map((t) => t.trim()).filter(Boolean),
  details: {
    ...form.details,
    intro: {
      ...form.details.intro,
      paragraphs: form.details.intro.paragraphs.map((t) => t.trim()).filter(Boolean)
    }
  }
});

function Field({ label, wide, children }) {
  return (
    <label className={'adm__field' + (wide ? ' adm__field--wide' : '')}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Text({ form, set, path, label, wide, area }) {
  const Tag = area ? 'textarea' : 'input';
  return (
    <Field label={label} wide={wide}>
      <Tag
        rows={area ? 4 : undefined}
        value={getIn(form, path) ?? ''}
        onChange={(e) => set(path, e.target.value)}
      />
    </Field>
  );
}

function ImageField({ form, set, path, label, adminKey }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const value = getIn(form, path) || '';

  async function pick(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      set(path, await uploadImage(file, adminKey));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  return (
    <div className="adm__field adm__field--wide adm__image">
      <span>{label}</span>
      <div className="adm__imageRow">
        <div className="adm__thumb">{value && <img src={value} alt="" />}</div>
        <div className="adm__imageCtl">
          <input
            placeholder="Image URL"
            value={value}
            onChange={(e) => set(path, e.target.value)}
          />
          <div className="adm__imageBtns">
            <label className="adm__btn adm__btn--ghost">
              {busy ? 'Uploading…' : 'Upload image'}
              <input type="file" accept="image/*" onChange={pick} disabled={busy} hidden />
            </label>
            {value && (
              <button type="button" className="adm__btn adm__btn--ghost" onClick={() => set(path, '')}>
                Remove
              </button>
            )}
          </div>
          {error && <small className="adm__error">{error}</small>}
        </div>
      </div>
    </div>
  );
}

function ListHead({ title, onAdd, addLabel }) {
  return (
    <div className="adm__listHead">
      <h4>{title}</h4>
      <button type="button" className="adm__btn adm__btn--ghost" onClick={onAdd}>
        {addLabel}
      </button>
    </div>
  );
}

function RowTools({ index, count, onMove, onRemove }) {
  return (
    <div className="adm__rowTools">
      <button type="button" disabled={index === 0} onClick={() => onMove(index, -1)}>↑</button>
      <button type="button" disabled={index === count - 1} onClick={() => onMove(index, 1)}>↓</button>
      <button type="button" onClick={() => onRemove(index)}>Delete</button>
    </div>
  );
}

function Gate({ onSubmit, error }) {
  const [value, setValue] = useState('');
  return (
    <div className="adm adm--gate">
      <form
        className="adm__gate"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(value);
        }}
      >
        <h1>Admin</h1>
        <input
          type="password"
          placeholder="Admin key"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <button type="submit" className="adm__btn">Sign in</button>
        {error && <small className="adm__error">{error}</small>}
      </form>
    </div>
  );
}

export default function Admin() {
  const [adminKey, setAdminKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [gateError, setGateError] = useState('');
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(
    async (key) => {
      const list = await api('/api/projects/admin/all', { adminKey: key });
      setProjects(list);
      return list;
    },
    []
  );

  const signIn = useCallback(
    async (key) => {
      setGateError('');
      try {
        await load(key);
        setAdminKey(key);
        setAuthed(true);
      } catch (err) {
        setGateError(err.message);
      }
    },
    [load]
  );

  const set = (path, value) => setForm((f) => setIn(f, path, value));

  const addTo = (path, item) => set(path, [...getIn(form, path), item]);
  const removeAt = (path, i) => set(path, getIn(form, path).filter((_, n) => n !== i));
  const move = (path, i, dir) => {
    const list = [...getIn(form, path)];
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    set(path, list);
  };

  async function save() {
    if (!form.name.trim()) {
      setStatus('Name is required');
      return;
    }
    setSaving(true);
    setStatus('');
    try {
      const payload = prepare(form);
      const saved = form._id
        ? await api(`/api/projects/${form._id}`, { method: 'PUT', body: payload, adminKey })
        : await api('/api/projects', { method: 'POST', body: payload, adminKey });
      setForm(normalise(saved));
      await load(adminKey);
      setStatus('Saved');
    } catch (err) {
      setStatus(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!form._id || !window.confirm(`Delete "${form.name}"? This cannot be undone.`)) return;
    try {
      await api(`/api/projects/${form._id}`, { method: 'DELETE', adminKey });
      setForm(null);
      await load(adminKey);
    } catch (err) {
      setStatus(err.message);
    }
  }

  function signOut() {
    setAdminKey('');
    setAuthed(false);
    setForm(null);
  }

  if (!authed) return <Gate onSubmit={signIn} error={gateError} />;

  const img = { form, set, adminKey };
  const sections = form ? form.details.sections : [];

  return (
    <div className="adm">
      <aside className="adm__side">
        <div className="adm__sideHead">
          <h1>Projects</h1>
          <button type="button" className="adm__btn" onClick={() => { setForm(blank()); setStatus(''); }}>
            New project
          </button>
        </div>

        <ul>
          {projects.map((p) => (
            <li key={p._id}>
              <button
                type="button"
                className={form && form._id === p._id ? 'is-active' : ''}
                onClick={() => { setForm(normalise(p)); setStatus(''); }}
              >
                <span>{p.name}</span>
                <small>{p.published ? 'Live' : 'Draft'}</small>
              </button>
            </li>
          ))}
        </ul>

        <button type="button" className="adm__btn adm__btn--ghost" onClick={signOut}>
          Sign out
        </button>
      </aside>

      <section className="adm__main">
        {!form && <p className="adm__empty">Select a project or create a new one.</p>}

        {form && (
          <>
            <div className="adm__bar">
              <h2>{form.name || 'New project'}</h2>
              <div className="adm__barBtns">
                {form._id && form.published && (
                  <a className="adm__btn adm__btn--ghost" href={`/projects/${form.slug}`} target="_blank" rel="noreferrer">
                    View page
                  </a>
                )}
                {form._id && (
                  <button type="button" className="adm__btn adm__btn--ghost" onClick={remove}>Delete</button>
                )}
                <button type="button" className="adm__btn" onClick={save} disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
            {status && <p className="adm__status">{status}</p>}

            <fieldset className="adm__group">
              <legend>Card on the home page</legend>
              <Text form={form} set={set} path="name" label="Name" />
              <Text form={form} set={set} path="slug" label="Slug (URL)" />
              <Field label="Tags (comma separated)">
                <input
                  value={form.tags.join(', ')}
                  onChange={(e) => set('tags', e.target.value.split(/,\s*/))}
                />
              </Field>
              <Text form={form} set={set} path="order" label="Order" />
              <Field label="Published">
                <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} />
              </Field>
              <ImageField {...img} path="image" label="Card image" />
            </fieldset>

            <fieldset className="adm__group">
              <legend>Hero</legend>
              <Text form={form} set={set} path="details.eyebrow" label="Script line" />
              <Text form={form} set={set} path="details.title" label="Big title" />
              <Text form={form} set={set} path="details.role" label="Role" />
              <Text form={form} set={set} path="details.client" label="Client" />
              <Text form={form} set={set} path="details.discipline" label="Discipline" />
              <Text form={form} set={set} path="details.year" label="Year" />
              <Text form={form} set={set} path="details.heroLabel" label="Label on image" />
              <Text form={form} set={set} path="details.heroCaption" label="Caption on image" />
              <ImageField {...img} path="details.heroImage" label="Hero image" />
            </fieldset>

            <fieldset className="adm__group">
              <legend>Challenge</legend>
              <Text form={form} set={set} path="details.intro.eyebrow" label="Script line" />
              <Text form={form} set={set} path="details.intro.heading" label="Heading" />
              <Field label="Paragraphs (blank line between)" wide>
                <textarea
                  rows={7}
                  value={form.details.intro.paragraphs.join('\n\n')}
                  onChange={(e) => set('details.intro.paragraphs', e.target.value.split(/\n{2,}/))}
                />
              </Field>
              <ImageField {...img} path="details.intro.image" label="Overview image" />
            </fieldset>

            <fieldset className="adm__group adm__group--list">
              <legend>Colors and fonts</legend>
              <ListHead title="Colors" addLabel="Add color" onAdd={() => addTo('details.colors', { name: '', hex: '#000000' })} />
              {form.details.colors.map((c, i) => (
                <div className="adm__item" key={i}>
                  <Text form={form} set={set} path={`details.colors.${i}.name`} label="Name" />
                  <Field label="Color">
                    <input type="color" value={c.hex} onChange={(e) => set(`details.colors.${i}.hex`, e.target.value)} />
                  </Field>
                  <RowTools index={i} count={form.details.colors.length} onMove={(n, d) => move('details.colors', n, d)} onRemove={(n) => removeAt('details.colors', n)} />
                </div>
              ))}

              <ListHead title="Fonts" addLabel="Add font" onAdd={() => addTo('details.fonts', { name: '', sample: 'Aa' })} />
              {form.details.fonts.map((f, i) => (
                <div className="adm__item" key={i}>
                  <Text form={form} set={set} path={`details.fonts.${i}.name`} label="Font name" />
                  <Text form={form} set={set} path={`details.fonts.${i}.sample`} label="Sample" />
                  <RowTools index={i} count={form.details.fonts.length} onMove={(n, d) => move('details.fonts', n, d)} onRemove={(n) => removeAt('details.fonts', n)} />
                </div>
              ))}
            </fieldset>

            <fieldset className="adm__group adm__group--list">
              <legend>Text and image sections</legend>
              <ListHead
                title={`${sections.length} sections`}
                addLabel="Add section"
                onAdd={() => addTo('details.sections', { eyebrow: 'The Challenge', heading: '', body: '', image: '', caption: '', captionRight: '', side: 'auto' })}
              />
              {sections.map((s, i) => (
                <div className="adm__card" key={i}>
                  <Text form={form} set={set} path={`details.sections.${i}.eyebrow`} label="Script line" />
                  <Text form={form} set={set} path={`details.sections.${i}.heading`} label="Heading" />
                  <Text form={form} set={set} path={`details.sections.${i}.body`} label="Text" wide area />
                  <Text form={form} set={set} path={`details.sections.${i}.caption`} label="Caption left" />
                  <Text form={form} set={set} path={`details.sections.${i}.captionRight`} label="Caption right" />
                  <Field label="Image side">
                    <select value={s.side} onChange={(e) => set(`details.sections.${i}.side`, e.target.value)}>
                      <option value="auto">Alternate</option>
                      <option value="right">Right</option>
                      <option value="left">Left</option>
                    </select>
                  </Field>
                  <ImageField {...img} path={`details.sections.${i}.image`} label="Image" />
                  <RowTools index={i} count={sections.length} onMove={(n, d) => move('details.sections', n, d)} onRemove={(n) => removeAt('details.sections', n)} />
                </div>
              ))}
            </fieldset>

            <fieldset className="adm__group adm__group--list">
              <legend>Dark highlights block</legend>
              <Text form={form} set={set} path="details.highlights.eyebrow" label="Script line" />
              <Text form={form} set={set} path="details.highlights.heading" label="Heading" />
              <ListHead title="Points (numbered automatically)" addLabel="Add point" onAdd={() => addTo('details.highlights.items', { title: '', body: '' })} />
              {form.details.highlights.items.map((it, i) => (
                <div className="adm__card" key={i}>
                  <Text form={form} set={set} path={`details.highlights.items.${i}.title`} label="Title" />
                  <Text form={form} set={set} path={`details.highlights.items.${i}.body`} label="Text" wide area />
                  <RowTools index={i} count={form.details.highlights.items.length} onMove={(n, d) => move('details.highlights.items', n, d)} onRemove={(n) => removeAt('details.highlights.items', n)} />
                </div>
              ))}
            </fieldset>

            <fieldset className="adm__group">
              <legend>Screens</legend>
              <Text form={form} set={set} path="details.screens.eyebrow" label="Script line" />
              <Text form={form} set={set} path="details.screens.heading" label="Heading" />
              <ImageField {...img} path="details.screens.desktop" label="Desktop screen" />
              <ImageField {...img} path="details.screens.mobile" label="Mobile screen" />
              <ImageField {...img} path="details.screens.thankYou" label="Thank you card" />
            </fieldset>
          </>
        )}
      </section>
    </div>
  );
}
