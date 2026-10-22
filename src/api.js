const KEY = import.meta.env.VITE_OWM_KEY;
const BASE = 'https://api.openweathermap.org/data/2.5';

async function get(path, params) {
  if (!KEY) throw new Error('Chave da API ausente. Defina VITE_OWM_KEY (veja o README).');
  const qs = new URLSearchParams({ ...params, units: 'metric', lang: 'pt_br', appid: KEY });
  let res;
  try {
    res = await fetch(`${BASE}/${path}?${qs}`);
  } catch {
    throw new Error('Sem conexão. Verifique sua internet e tente de novo.');
  }
  if (res.status === 404) throw new Error('Cidade não encontrada. Confira o nome e tente de novo.');
  if (res.status === 401) throw new Error('Chave da API inválida ou ainda não ativada. Chaves novas levam algumas horas.');
  if (!res.ok) throw new Error('O serviço de clima está indisponível. Tente novamente em instantes.');
  return res.json();
}

// agrupa as previsões de 3 em 3 horas em um resumo por dia
function groupForecast(list) {
  const days = {};
  for (const item of list) (days[item.dt_txt.slice(0, 10)] ||= []).push(item);
  return Object.entries(days).slice(0, 5).map(([date, items]) => {
    const hour = (i) => parseInt(i.dt_txt.slice(11, 13), 10);
    const mid = items.reduce((a, b) => (Math.abs(hour(b) - 12) < Math.abs(hour(a) - 12) ? b : a));
    return {
      date,
      min: Math.min(...items.map((i) => i.main.temp_min)),
      max: Math.max(...items.map((i) => i.main.temp_max)),
      main: mid.weather[0].main,
      desc: mid.weather[0].description,
    };
  });
}

// params: { q: 'Campinas' } ou { lat, lon }
export async function getWeather(params) {
  const [current, fc] = await Promise.all([get('weather', params), get('forecast', params)]);
  return { current, forecast: groupForecast(fc.list) };
}

// um lugar escolhido: nome, estado, país e coordenadas
const placeFrom = (c) => ({ name: c.local_names?.pt || c.name, state: c.state, country: c.country, lat: c.lat, lon: c.lon });

// autocomplete: sugestões de cidades (Geocoding API, mesma chave)
export async function suggestCities(q, signal) {
  if (!KEY) return [];
  const qs = new URLSearchParams({ q, limit: 5, appid: KEY });
  const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?${qs}`, { signal });
  if (!res.ok) return [];
  const seen = new Set();
  return (await res.json())
    .map((c) => ({ ...placeFrom(c), label: [c.local_names?.pt || c.name, c.state, c.country].filter(Boolean).join(', ') }))
    .filter((s) => !seen.has(s.label) && seen.add(s.label));
}

// "onde estou": descobre a cidade a partir das coordenadas
export async function reversePlace(lat, lon) {
  if (!KEY) return null;
  try {
    const qs = new URLSearchParams({ lat, lon, limit: 1, appid: KEY });
    const res = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?${qs}`);
    const [c] = res.ok ? await res.json() : [];
    return c ? placeFrom(c) : null;
  } catch {
    return null;
  }
}

// chuva por dia, até 16 dias à frente (Open-Meteo: gratuito e sem chave)
export async function getRainOutlook(lat, lon) {
  const qs = new URLSearchParams({
    latitude: lat, longitude: lon, timezone: 'auto', forecast_days: 16,
    daily: 'precipitation_probability_max,precipitation_sum',
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${qs}`);
  if (!res.ok) throw new Error('Previsão por data indisponível.');
  const { daily } = await res.json();
  return Object.fromEntries(daily.time.map((d, i) => [d, { prob: daily.precipitation_probability_max[i], mm: daily.precipitation_sum[i] ?? 0 }]));
}
