import { useEffect, useState } from 'react';
import { getRainOutlook, getWeather } from './api';
import { TIERS, initialState, levelOf, register } from './game';
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

  async function load(params) {
    setLoading(true);
    setError('');
    try {
      const res = await getWeather(params);
      setData(res);
      setRun((r) => r + 1);
      const c = res.current;
      getRainOutlook(c.coord.lat, c.coord.lon)
        .then((days) => setOutlook({ id: c.id, days }))
        .catch(() => setOutlook({ id: c.id, failed: true }));
      const out = register(game, { id: c.id, name: c.name, country: c.sys.country, temp: c.main.temp, main: c.weather[0].main });
      setGame(out.state);
      const msgs = [];
      if (out.isNew) msgs.push(`Novo carimbo: ${c.name}! +10 XP`);
      out.won.forEach((b) => msgs.push(`Selo conquistado: ${b.name}! +${TIERS[b.tier].xp} XP`));
      if (msgs.length) setToast(msgs);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function locate() {
    if (!navigator.geolocation) return setError('Seu navegador não permite geolocalização.');
    navigator.geolocation.getCurrentPosition(
      (p) => load({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => setError('Não foi possível obter sua localização. Permita o acesso ou busque pelo nome.'),
    );
  }

  const ready = data && outlook?.id === data.current.id ? outlook : null;
  const favKey = data ? `${data.current.name},${data.current.sys.country}` : '';
  const isFav = favs.includes(favKey);
  const toggleFav = () => setFavs(isFav ? favs.filter((f) => f !== favKey) : [...favs, favKey]);

  const showWx = data && !error;

  return (
    <main className={`dash${showWx ? ' wide' : ''}`}>
      <header className="brand">
        <h1>Weather Explorer</h1>
        <p>Clima, previsão de 5 dias e chuva por data</p>
      </header>
      {toast && <div className="toast" role="status">{toast.map((m) => <p key={m}>{m}</p>)}</div>}

      <section className="card" aria-busy={loading}>
        <SearchBar onSearch={load} onLocate={locate} loading={loading} date={date} onDate={setDate} />

        {favs.length > 0 && (
          <div className="chips">
            {favs.map((f) => (
              <span key={f} className="chip">
                <button onClick={() => load({ q: f })}>{f.split(',')[0]}</button>
                <button className="rm" onClick={() => setFavs(favs.filter((x) => x !== f))} aria-label={`Remover ${f}`}>remover</button>
              </span>
            ))}
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
        <div><section className="card"><Passport game={game} /></section></div>
      </div>

      <footer>Dados: OpenWeatherMap e Open-Meteo</footer>
    </main>
  );
}
