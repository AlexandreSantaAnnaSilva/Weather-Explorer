export const initialState = { xp: 0, cities: {}, badges: [], days: [] };

export const LEVELS = [
  { xp: 0, title: 'Observador de Nuvens' },
  { xp: 30, title: 'Caçador de Tempestades' },
  { xp: 80, title: 'Meteorologista Júnior' },
  { xp: 160, title: 'Meteorologista Global' },
  { xp: 300, title: 'Mestre dos Climas' },
];

// dificuldade dos selos: cor da borda e XP que cada selo rende
export const TIERS = {
  facil: { label: 'Fácil', color: '#4caf50', xp: 10 },
  medio: { label: 'Médio', color: '#2e9cca', xp: 25 },
  dificil: { label: 'Difícil', color: '#f08a24', xp: 40 },
  extremo: { label: 'Extremo', color: '#a62bc2', xp: 75 },
};

const today = () => new Date().toLocaleDateString('sv'); // AAAA-MM-DD local

function streak(days) {
  const set = new Set(days);
  const d = new Date();
  let n = 0;
  while (set.has(d.toLocaleDateString('sv'))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export const BADGES = [
  { id: 'primeiro', tier: 'facil', name: 'Primeiro Carimbo', desc: 'Pesquise a sua primeira cidade', test: (w, s) => Object.keys(s.cities).length >= 1 },
  { id: 'chuva', tier: 'facil', name: 'Chuva de Verão', desc: 'Encontre uma cidade com chuva agora', test: (w) => ['Rain', 'Drizzle', 'Thunderstorm'].includes(w.main) },
  { id: 'frio', tier: 'medio', name: 'Frio Polar', desc: 'Ache uma cidade abaixo de 0 °C', test: (w) => w.temp < 0 },
  { id: 'deserto', tier: 'medio', name: 'Deserto', desc: 'Ache uma cidade acima de 40 °C', test: (w) => w.temp >= 40 },
  { id: 'explorador', tier: 'medio', name: 'Explorador', desc: 'Colecione 10 cidades', test: (w, s) => Object.keys(s.cities).length >= 10 },
  { id: 'viajante', tier: 'dificil', name: 'Viajante', desc: 'Carimbe cidades de 5 países', test: (w, s) => new Set(Object.values(s.cities).map((c) => c.country)).size >= 5 },
  { id: 'sequencia', tier: 'dificil', name: 'Sequência', desc: 'Use o site 3 dias seguidos', test: (w, s) => streak(s.days) >= 3 },
  { id: 'colecionador', tier: 'extremo', name: 'Colecionador', desc: 'Colecione 25 cidades', test: (w, s) => Object.keys(s.cities).length >= 25 },
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
  next.xp += won.reduce((sum, b) => sum + TIERS[b.tier].xp, 0);
  return { state: next, isNew, won };
}