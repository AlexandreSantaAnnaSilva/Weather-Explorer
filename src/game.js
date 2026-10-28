export const initialState = { xp: 0, cities: {}, badges: [], days: [], stats: {} };

export const LEVELS = [
  { xp: 0, title: 'Observador de Nuvens' },
  { xp: 30, title: 'Caçador de Tempestades' },
  { xp: 80, title: 'Meteorologista Júnior' },
  { xp: 160, title: 'Meteorologista Global' },
  { xp: 300, title: 'Mestre dos Climas' },
  { xp: 500, title: 'Lenda do Tempo' },
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

const cityList = (s) => Object.values(s.cities);
const countIn = (s, code) => cityList(s).filter((c) => c.country === code).length;
const stat = (s, key) => s.stats?.[key] ?? 0;
const onDate = (month, ...days) => { const d = new Date(); return d.getMonth() === month && days.includes(d.getDate()); };

// Cada selo: tier (dificuldade), name, desc e test(w, s).
// w = dados da busca atual (ou null quando o evento não é uma busca); s = estado do álbum.
// secret: true => só mostra nome e descrição depois de conquistado (hint é a pista).
export const BADGES = [
  // ----- fáceis -----
  { id: 'primeiro', tier: 'facil', name: 'Primeiro Carimbo', desc: 'Pesquise a sua primeira cidade', test: (w, s) => cityList(s).length >= 1 },
  { id: 'chuva', tier: 'facil', name: 'Chuva de Verão', desc: 'Encontre uma cidade com chuva agora', test: (w) => ['Rain', 'Drizzle', 'Thunderstorm'].includes(w?.main) },
  { id: 'noturno', tier: 'facil', name: 'Noite do Outro Lado', desc: 'Pesquise uma cidade onde já é noite', test: (w) => w?.night === true },
  { id: 'favorito', tier: 'facil', name: 'Lugar Querido', desc: 'Adicione uma cidade às favoritas', test: (w, s) => stat(s, 'favs') >= 1 },
  // ----- médios -----
  { id: 'frio', tier: 'medio', name: 'Frio Polar', desc: 'Ache uma cidade abaixo de 0 °C', test: (w) => w && w.temp < 0 },
  { id: 'deserto', tier: 'medio', name: 'Deserto', desc: 'Ache uma cidade acima de 40 °C', test: (w) => w && w.temp >= 40 },
  { id: 'explorador', tier: 'medio', name: 'Explorador', desc: 'Colecione 10 cidades', test: (w, s) => cityList(s).length >= 10 },
  { id: 'previsor', tier: 'medio', name: 'Previsor', desc: 'Consulte a chuva por data 5 vezes', test: (w, s) => stat(s, 'rain') >= 5 },
  { id: 'ventania', tier: 'medio', name: 'Ventania', desc: 'Ache uma cidade com vento acima de 40 km/h', test: (w) => w && w.wind >= 11.1 },
  { id: 'neve', tier: 'medio', name: 'Dia de Neve', desc: 'Encontre uma cidade com neve caindo', test: (w) => w?.main === 'Snow' },
  // ----- difíceis -----
  { id: 'viajante', tier: 'dificil', name: 'Viajante', desc: 'Carimbe cidades de 5 países', test: (w, s) => new Set(cityList(s).map((c) => c.country)).size >= 5 },
  { id: 'sequencia', tier: 'dificil', name: 'Sequência', desc: 'Use o site 3 dias seguidos', test: (w, s) => streak(s.days) >= 3 },
  { id: 'raio', tier: 'dificil', name: 'Caçador de Raios', desc: 'Encontre uma cidade com trovoadas', test: (w) => w?.main === 'Thunderstorm' },
  { id: 'equador', tier: 'dificil', name: 'Linha do Equador', desc: 'Ache uma cidade a menos de 2° do Equador', test: (w) => w && Math.abs(w.lat) <= 2 },
  { id: 'polar', tier: 'dificil', name: 'Círculo Polar', desc: 'Ache uma cidade acima de 60° de latitude', test: (w) => w && Math.abs(w.lat) >= 60 },
  { id: 'brasil', tier: 'dificil', name: 'Brasil Brasileiro', desc: 'Carimbe cidades de 5 estados do Brasil', test: (w, s) => new Set(cityList(s).filter((c) => c.country === 'BR' && c.state).map((c) => c.state)).size >= 5 },
  // ----- extremo -----
  { id: 'colecionador', tier: 'extremo', name: 'Colecionador', desc: 'Colecione 25 cidades', test: (w, s) => cityList(s).length >= 25 },
  // ----- secretos -----
  { id: 'japao', secret: true, tier: 'extremo', name: 'Sol Nascente', desc: 'Pesquise 10 cidades japonesas', hint: 'Dizem que o dia começa primeiro do outro lado do mundo.', test: (w, s) => countIn(s, 'JP') >= 10 },
  { id: 'eua', secret: true, tier: 'extremo', name: 'Sonho Americano', desc: 'Pesquise 10 cidades dos Estados Unidos', hint: 'Há estrelas e listras esperando por quem for longe.', test: (w, s) => countIn(s, 'US') >= 10 },
  { id: 'italia', secret: true, tier: 'extremo', name: 'Dolce Vita', desc: 'Pesquise 10 cidades italianas', hint: 'Uma fatia de algo delicioso espera quem explorar a bota.', test: (w, s) => countIn(s, 'IT') >= 10 },
  { id: 'insonia', secret: true, tier: 'medio', name: 'Insônia', desc: 'Pesquise uma cidade entre 2h e 5h da manhã', hint: 'Para quem não consegue dormir.', test: (w) => w && new Date().getHours() >= 2 && new Date().getHours() < 5 },
  { id: 'geloefogo', secret: true, tier: 'dificil', name: 'Gelo e Fogo', desc: 'Ache uma cidade com 35 °C ou mais e outra com 0 °C ou menos', hint: 'Dois extremos cabem no mesmo álbum.', test: (w, s) => (s.stats?.maxTemp ?? -99) >= 35 && (s.stats?.minTemp ?? 99) <= 0 },
  { id: 'gemeos', secret: true, tier: 'medio', name: 'Nomes Gêmeos', desc: 'Carimbe duas cidades com o mesmo nome em países diferentes', hint: 'Nomes iguais, endereços diferentes.', test: (w, s) => {
    const byName = {};
    cityList(s).forEach((c) => (byName[c.name.toLowerCase()] ||= new Set()).add(c.country));
    return Object.values(byName).some((set) => set.size >= 2);
  } },
  { id: 'halloween', secret: true, tier: 'medio', name: 'Noite das Bruxas', desc: 'Use o site em 31 de outubro', hint: 'Aparece uma vez por ano, quando escurece cedo.', test: (w) => w && onDate(9, 31) },
  { id: 'natal', secret: true, tier: 'medio', name: 'Espírito de Natal', desc: 'Use o site em 24 ou 25 de dezembro', hint: 'Ho ho ho... bem no fim do ano.', test: (w) => w && onDate(11, 24, 25) },
];

export function levelOf(xp) {
  let i = 0;
  LEVELS.forEach((l, k) => { if (xp >= l.xp) i = k; });
  return { level: i + 1, title: LEVELS[i].title, base: LEVELS[i].xp, next: LEVELS[i + 1]?.xp ?? null };
}

// chave estável de um lugar (nome + estado + país): Monte Verde (MG) e Monte Verde (México) são carimbos diferentes
export const placeKey = (p) => [p.name, p.state || '', p.country].join('|').toLowerCase();

// confere quais selos novos foram conquistados e soma o XP deles
function award(state, w) {
  const won = BADGES.filter((b) => !state.badges.includes(b.id) && b.test(w, state));
  return {
    state: { ...state, badges: [...state.badges, ...won.map((b) => b.id)], xp: state.xp + won.reduce((sum, b) => sum + TIERS[b.tier].xp, 0) },
    won,
  };
}

// w = { id, name, state, country, lat, temp (°C), main, wind (m/s), night }
export function register(state, w) {
  const cities = { ...state.cities };
  // carimbos antigos (chave numérica, sem estado) do mesmo lugar são migrados para a chave nova
  const legacy = cities[w.id] ? null : Object.keys(cities).find((k) => !cities[k].state && cities[k].name === w.name && cities[k].country === w.country);
  if (legacy) delete cities[legacy];
  const isNew = !cities[w.id] && !legacy;
  cities[w.id] = { name: w.name, state: w.state, country: w.country, main: w.main, date: today() };
  const stats = { ...state.stats, maxTemp: Math.max(state.stats?.maxTemp ?? -99, w.temp), minTemp: Math.min(state.stats?.minTemp ?? 99, w.temp) };
  const next = {
    ...state,
    xp: state.xp + (isNew ? 10 : 1),
    cities,
    stats,
    days: state.days.includes(today()) ? state.days : [...state.days, today()],
  };
  return { ...award(next, w), isNew };
}

// eventos que não são buscas (ex.: 'rain' = consultou a chuva por data, 'favs' = favoritou uma cidade)
export function track(state, key) {
  return award({ ...state, stats: { ...state.stats, [key]: stat(state, key) + 1 } }, null);
}