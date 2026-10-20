import { art, hhmm, temp, wind } from '../units';

export default function Current({ c, units, isFav, onFav }) {
  const w = c.weather[0];
  return (
    <section className="current">
      <button className="fav" onClick={onFav} aria-pressed={isFav}>{isFav ? 'Favorita' : 'Favoritar'}</button>
      <h2>{c.name}, {c.sys.country}</h2>
      <img src={art(w.main)} alt={w.description} />
      <p className="temp">{temp(c.main.temp, units)}<span>°{units}</span></p>
      <p className="desc">{w.description}</p>
      <ul className="stats">
        <li><span>Sensação</span>{temp(c.main.feels_like, units)}°</li>
        <li><span>Umidade</span>{c.main.humidity}%</li>
        <li><span>Vento</span>{wind(c.wind.speed, units)}</li>
        <li><span>Pressão</span>{c.main.pressure} hPa</li>
        <li><span>Visibilidade</span>{((c.visibility ?? 0) / 1000).toFixed(1)} km</li>
        <li><span>Sol (nasce/põe)</span>{hhmm(c.sys.sunrise, c.timezone)} / {hhmm(c.sys.sunset, c.timezone)}</li>
      </ul>
    </section>
  );
}
