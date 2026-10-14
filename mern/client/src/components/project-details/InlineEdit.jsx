import { useEffect, useRef, useState } from 'react';
import { uploadImage } from '../../lib/api.js';

export function EditableText({
  value,
  onChange,
  as: Tag = 'span',
  multiline = false,
  placeholder = 'Add text',
  className = ''
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const inputRef = useRef(null);
  const cancelBlur = useRef(false);

  useEffect(() => setDraft(value || ''), [value]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    if (cancelBlur.current) {
      cancelBlur.current = false;
      return;
    }
    onChange(draft);
    setEditing(false);
  };

  if (editing) {
    const Input = multiline ? 'textarea' : 'input';
    return (
      <Input
        ref={inputRef}
        className={`pd__inlineInput ${multiline ? 'pd__inlineInput--multiline' : ''} ${className}`}
        value={draft}
        placeholder={placeholder}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            cancelBlur.current = true;
            setDraft(value || '');
            inputRef.current?.blur();
            setEditing(false);
          } else if (event.key === 'Enter' && !multiline) {
            event.preventDefault();
            commit();
          }
        }}
      />
    );
  }

  return (
    <Tag
      className={`pd__editable ${className}`}
      onClick={() => setEditing(true)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setEditing(true);
        }
      }}
      tabIndex={0}
      aria-description="Press Enter to edit"
      title="Click to edit"
    >
      {value || <span className="pd__editPlaceholder">{placeholder}</span>}
      <span className="pd__editHint" aria-hidden="true">Edit</span>
    </Tag>
  );
}

export function EditableImage({ src, alt, onChange, className = '', emptyLabel = 'Add image' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(src || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setDraft(src || ''), [src]);

  const update = (value) => {
    setDraft(value);
    onChange(value);
  };

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      update(await uploadImage(file));
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  }

  return (
    <div className={`pd__imageEdit ${className}`}>
      {src ? <img src={src} alt={alt} loading="lazy" /> : <span className="pd__imagePlaceholder">{emptyLabel}</span>}
      <div className="pd__imageTools">
        <button type="button" onClick={() => setEditing((open) => !open)}>
          {editing ? 'Close image tools' : src ? 'Change image' : 'Add image'}
        </button>
        {src && <button type="button" onClick={() => update('')}>Remove</button>}
      </div>
      {editing && (
        <div className="pd__imageEditor">
          <input
            aria-label={`Image URL for ${alt}`}
            value={draft}
            placeholder="Paste image URL"
            onChange={(event) => update(event.target.value)}
          />
          <label>
            {busy ? 'Uploading…' : 'Upload'}
            <input type="file" accept="image/*" onChange={upload} disabled={busy} />
          </label>
          {error && <small>{error}</small>}
        </div>
      )}
    </div>
  );
}

export function RemoveButton({ onClick, label = 'Delete item' }) {
  return (
    <button
      type="button"
      className="pd__remove"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      ×
    </button>
  );
}
