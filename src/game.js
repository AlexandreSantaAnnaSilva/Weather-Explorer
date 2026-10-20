export const initialState = { xp: 0, cities: {}, badges: [], days: [] };

export const LEVELS = [
  { xp: 0, title: 'Observador de Nuvens' },
  { xp: 30, title: 'Caçador de Tempestades' },
  { xp: 80, title: 'Meteorologista Júnior' },
  { xp: 160, title: 'Meteorologista Global' },
];

const today = () => new Date().toLocaleDateString('sv'); // AAAA-MM-DD local

function streak(days) {
  const set = new Set(days);
  const d = new Date();
  let n = 0;
  while (set.has(d.toLocaleDateString('sv'))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export const BADGES = [
  { id: 'chuva', name: 'Chuva de Verão', desc: 'Encontre uma cidade com chuva agora', test: (w) => ['Rain', 'Drizzle', 'Thunderstorm'].includes(w.main) },
  { id: 'frio', name: 'Frio Polar', desc: 'Ache uma cidade abaixo de 0 °C', test: (w) => w.temp < 0 },
  { id: 'deserto', name: 'Deserto', desc: 'Ache uma cidade acima de 40 °C', test: (w) => w.temp >= 40 },
  { id: 'viajante', name: 'Viajante', desc: 'Carimbe cidades de 5 países', test: (w, s) => new Set(Object.values(s.cities).map((c) => c.country)).size >= 5 },
  { id: 'explorador', name: 'Explorador', desc: 'Colecione 10 cidades', test: (w, s) => Object.keys(s.cities).length >= 10 },
  { id: 'sequencia', name: 'Sequência', desc: 'Use o site 3 dias seguidos', test: (w, s) => streak(s.days) >= 3 },
];

export function levelOf(xp) {
  let i = 0;
  LEVELS.forEach((l, k) => { if (xp >= l.xp) i = k; });
  return { level: i + 1, title: LEVELS[i].title, base: LEVELS[i].xp, next: LEVELS[i + 1]?.xp ?? null };
}

// w = { id, name, country, temp (°C), main }
export function register(state, w) {
  const isNew = !state.cities[w.id];
  const next = {
    ...state,
    xp: state.xp + (isNew ? 10 : 1),
    cities: { ...state.cities, [w.id]: { name: w.name, country: w.country, main: w.main, date: today() } },
    days: state.days.includes(today()) ? state.days : [...state.days, today()],
  };
  const won = BADGES.filter((b) => !state.badges.includes(b.id) && b.test(w, next));
  next.badges = [...state.badges, ...won.map((b) => b.id)];
  next.xp += won.length * 25;
  return { state: next, isNew, won };
}
