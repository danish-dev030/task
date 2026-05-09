import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function SearchBar() {
  const [params, setParams] = useSearchParams();
  const [value, setValue] = useState(params.get('search') || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (value) next.set('search', value);
      else next.delete('search');
      next.set('page', '1');
      setParams(next);
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="search-wrap">
      <span>🔍</span>
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Search photos..." />
      {value ? <button onClick={() => setValue('')}>×</button> : null}
    </div>
  );
}
