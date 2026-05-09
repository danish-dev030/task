import { useState } from 'react';

export default function TagInput({ value, onChange }) {
  const [input, setInput] = useState('');
  const addTag = () => {
    const t = input.trim();
    if (!t) return;
    onChange([...(value || []), t]);
    setInput('');
  };
  return (
    <div>
      <div className="tag-list">
        {(value || []).map((tag, i) => (
          <span key={`${tag}-${i}`} className="tag">
            {tag}
            <button onClick={() => onChange(value.filter((_, idx) => idx !== i))}>×</button>
          </span>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
          }
        }}
      />
    </div>
  );
}
