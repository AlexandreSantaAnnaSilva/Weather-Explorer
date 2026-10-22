import { useEffect, useRef, useState } from 'react';
import { suggestCities } from '../api';
import { Pin, Search } from './Icons';

const iso = (d) => d.toLocaleDateString('sv'); // AAAA-MM-DD local
const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export default function SearchBar({ onSearch, onLocate, loading, date, onDate }) {
  const [q, setQ] = useState('');
  const [ticks, setTicks] = useState(0); // cada tecla reinicia a animação do pino
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(-1);
  const [hint, setHint] = useState('');
  const picked = useRef('');
  const chosen = useRef(null);

  // busca sugestões 300 ms depois da última tecla (e cancela a anterior)
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2 || term === picked.current) { setItems([]); return; }
    const ctl = new AbortController();
    const t = setTimeout(async () => {
      try { setItems(await suggestCities(term, ctl.signal)); setActive(-1); } catch { /* cancelada ou sem rede */ }
    }, 300);
    return () => { clearTimeout(t); ctl.abort(); };
  }, [q]);

  // escolhe um lugar exato (nome, estado, país e coordenadas)
  const choose = (s) => {
    picked.current = s.label;
    chosen.current = s;
    setQ(s.label);
    setItems([]);
    setActive(-1);
    setHint('');
    onSearch({ lat: s.lat, lon: s.lon }, s);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (active >= 0 && items[active]) return choose(items[active]);
    const term = q.trim();
    if (!term) return;
    if (chosen.current?.label === term) return choose(chosen.current);

    let list = items;
    if (!list.length) { try { list = await suggestCities(term); } catch { list = []; } }
    const exact = list.filter((s) => norm(s.name) === norm(term.split(',')[0]));
    if (exact.length === 1) return choose(exact[0]);
    if (exact.length === 0 && list.length) return choose(list[0]);
    if (exact.length > 1) { // vários lugares com o mesmo nome: quem escolhe é você
      setItems(list);
      setActive(-1);
      setHint('Há mais de um lugar com esse nome. Escolha um da lista.');
      return;
    }
    onSearch({ q: term });
  };

  const onKeyDown = (e) => {
    if (!items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % items.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a <= 0 ? items.length - 1 : a - 1)); }
    else if (e.key === 'Escape') setItems([]);
  };

  const min = iso(new Date());
  const max = iso(new Date(Date.now() + 15 * 864e5));

  return (
    <form className="search-wrap" onSubmit={submit} role="search">
      <div className="search">
        <button type="button" className="pin" onClick={onLocate} disabled={loading} aria-label="Usar minha localização" title="Usar minha localização">
          <span key={ticks} className={ticks ? 'tick' : ''}><Pin /></span>
        </button>
        <div className="field">
          <input
            role="combobox"
            aria-expanded={items.length > 0}
            aria-controls="sugestoes"
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `sug-${active}` : undefined}
            value={q}
            onChange={(e) => { setQ(e.target.value); setHint(''); setTicks((n) => n + 1); }}
            onKeyDown={onKeyDown}
            placeholder="Digite uma cidade"
            aria-label="Cidade"
            autoComplete="off"
          />
        </div>
        <button type="submit" className={`go${q.trim() ? ' ready' : ''}`} disabled={loading} aria-label="Buscar">
          {loading ? <i className="spinner" /> : <Search />}
        </button>
      </div>

      {items.length > 0 && (
        <ul className="suggest" id="sugestoes" role="listbox">
          {items.map((s, i) => (
            <li key={s.label} id={`sug-${i}`} role="option" aria-selected={i === active} className={i === active ? 'on' : ''}
              style={{ '--i': i }} onMouseDown={(e) => { e.preventDefault(); choose(s); }}>
              {s.label}
            </li>
          ))}
        </ul>
      )}
      {hint && <p className="hint" role="status">{hint}</p>}

      <div className="daterow">
        <label htmlFor="data-chuva">Vai chover em qual dia?</label>
        <input id="data-chuva" type="date" value={date} min={min} max={max} onChange={(e) => onDate(e.target.value)} />
        {date && <button type="button" className="clear" onClick={() => onDate('')}>limpar</button>}
      </div>
    </form>
  );
}