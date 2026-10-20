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
