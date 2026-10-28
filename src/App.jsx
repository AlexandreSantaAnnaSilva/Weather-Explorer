import { useEffect, useState } from 'react';
import { getRainOutlook, getWeather, reversePlace } from './api';
import { TIERS, initialState, levelOf, placeKey, register, track } from './game';
import { useLocalStorage } from './useLocalStorage';
import { notFoundArt } from './units';
import SearchBar from './components/SearchBar';
import Now from './components/Now';
import Details from './components/Details';
import Forecast from './components/Forecast';
import Passport from './components/Passport';
import RainCheck from './components/RainCheck';

export default function App() {
  const [data, setData] = useState(null);
  const [run, setRun] = useState(0); // reinicia as animações a cada busca
  const [date, setDate] = useState(''); // dia para checar chuva
  const [outlook, setOutlook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast] = useState(null);
  const [units, setUnits] = useLocalStorage('we-units', 'C');
  const [favs, setFavs] = useLocalStorage('we-favs', []);
  const [game, setGame] = useLocalStorage('we-game', initialState);

  // o azul do fundo escurece quando é noite na cidade pesquisada
  useEffect(() => {
    const w = data?.current.weather[0];
    document.body.dataset.theme = w && w.icon.endsWith('n') ? 'night' : '';
  }, [data]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // params: { q } ou { lat, lon }. place: o lugar que a pessoa escolheu (nome, estado, país, coordenadas)
  async function load(params, place) {
    setLoading(true);
    setError('');
    try {
      const res = await getWeather(params);
      const raw = res.current;
      // a API devolve o nome da estação mais próxima (ex.: "Camanducaia"); mostramos o lugar escolhido
      const p = place || { name: raw.name, country: raw.sys.country, lat: raw.coord.lat, lon: raw.coord.lon };
      const c = { ...raw, name: p.name, state: p.state, sys: { ...raw.sys, country: p.country } };
      const key = placeKey(p);
      setData({ ...res, current: c, place: { name: p.name, state: p.state, country: p.country, lat: p.lat, lon: p.lon }, key });
      setRun((r) => r + 1);
      getRainOutlook(p.lat, p.lon)
        .then((days) => setOutlook({ id: key, days }))
        .catch(() => setOutlook({ id: key, failed: true }));
      const out = register(game, {
        id: key, name: p.name, state: p.state, country: p.country, lat: p.lat,
        temp: c.main.temp, main: c.weather[0].main, wind: c.wind.speed, night: c.weather[0].icon.endsWith('n'),
      });
      setGame(out.state);
      announce(out.won, out.isNew ? [`Novo carimbo: ${p.name}! +10 XP`] : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function locate() {
    if (!navigator.geolocation) return setError('Seu navegador não permite geolocalização.');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        const place = await reversePlace(lat, lon);
        load({ lat, lon }, place || undefined);
      },
      () => setError('Não foi possível obter sua localização. Permita o acesso ou busque pelo nome.'),
    );
  }

  // avisos na tela quando algum selo é conquistado
  const announce = (won, msgs = []) => {
    won.forEach((b) => msgs.push(`${b.secret ? 'Selo secreto' : 'Selo conquistado'}: ${b.name}! +${TIERS[b.tier].xp} XP`));
    if (msgs.length) setToast(msgs);
  };
  // conta eventos que não são buscas (ex.: 'rain', 'favs') e confere os selos
  const count = (key) => {
    const out = track(game, key);
    setGame(out.state);
    announce(out.won);
  };
  const pickDate = (v) => {
    setDate(v);
    if (v) count('rain');
  };

  const removeCity = (id) => setGame((g) => {
    const cities = { ...g.cities };
    delete cities[id];
    return { ...g, cities };
  });

  const ready = data && outlook?.id === data.key ? outlook : null;
  const isFav = !!data && favs.some((f) => (f.key ?? f) === data.key);
  const toggleFav = () => {
    if (!isFav) count('favs');
    setFavs(isFav ? favs.filter((f) => (f.key ?? f) !== data.key) : [...favs, { key: data.key, ...data.place }]);
  };

  const showWx = data && !error;

  return (
    <main className={`dash${showWx ? ' wide' : ''}`}>
      <header className="brand">
        <h1>Weather Explorer</h1>
        <p>Clima, previsão de 5 dias e chuva por data</p>
      </header>
      {toast && <div className="toast" role="status">{toast.map((m) => <p key={m}>{m}</p>)}</div>}

      <section className="card" aria-busy={loading}>
        <SearchBar onSearch={load} onLocate={locate} loading={loading} date={date} onDate={pickDate} />

        {favs.length > 0 && (
          <div className="chips">
            {favs.map((f) => {
              const k = f.key ?? f;
              const name = f.name ?? f.split(',')[0];
              return (
                <span key={k} className="chip">
                  <button onClick={() => (f.lat != null ? load({ lat: f.lat, lon: f.lon }, f) : load({ q: f }))}>{name}</button>
                  <button className="rm" onClick={() => setFavs(favs.filter((x) => (x.key ?? x) !== k))} aria-label={`Remover ${name}`}>remover</button>
                </span>
              );
            })}
          </div>
        )}

        <div className={`reveal${error ? ' open' : ''}`}>
          <div>
            {error && (
              <div className="err" role="alert">
                {error.startsWith('Cidade') && <img src={notFoundArt} alt="" />}
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {showWx && (
        <div className="cols" key={run}>
          <div className="col left">
            <Now c={data.current} units={units} onUnits={() => setUnits(units === 'C' ? 'F' : 'C')} isFav={isFav} onFav={toggleFav} />
            {date && <RainCheck date={date} city={data.current.name} outlook={ready} />}
          </div>
          <div className="col right">
            <Details c={data.current} units={units} />
            <Forecast days={data.forecast} units={units} />
          </div>
        </div>
      )}

      <button className="pp-btn" onClick={() => setShowPass((v) => !v)} aria-expanded={showPass}>
        Passaporte climático · Nível {levelOf(game.xp).level}
      </button>
      <div className={`reveal${showPass ? ' open' : ''}`}>
        <div><section className="card"><Passport game={game} onRemoveCity={removeCity} /></section></div>
      </div>

      <footer>Dados: OpenWeatherMap e Open-Meteo</footer>
    </main>
  );
}