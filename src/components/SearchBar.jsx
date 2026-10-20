import { useState } from 'react';
import { Pin, Search } from './Icons';

export default function SearchBar({ onSearch, onLocate, loading }) {
  const [q, setQ] = useState('');
  const [ticks, setTicks] = useState(0); // cada tecla reinicia a animação do pino

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) onSearch({ q: q.trim() });
  };

  return (
    <form className="search" onSubmit={submit} role="search">
      <button type="button" className="pin" onClick={onLocate} disabled={loading} aria-label="Usar minha localização" title="Usar minha localização">
        <span key={ticks} className={ticks ? 'tick' : ''}><Pin /></span>
      </button>
      <div className="field">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setTicks((n) => n + 1); }}
          placeholder="Digite uma cidade"
          aria-label="Cidade"
          autoComplete="off"
        />
      </div>
      <button type="submit" className={`go${q.trim() ? ' ready' : ''}`} disabled={loading} aria-label="Buscar">
        {loading ? <i className="spinner" /> : <Search />}
      </button>
    </form>
  );
}
