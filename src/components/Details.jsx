import { hhmm, temp, wind } from '../units';
import { Water, Wind } from './Icons';

export default function Details({ c, units }) {
  return (
    <section className="card">
      <h3 className="card-title">Detalhes</h3>
      <ul className="tiles">
        <li><small>Umidade</small><b>{c.main.humidity}%</b><Water /></li>
        <li><small>Vento</small><b>{wind(c.wind.speed, units)}</b><Wind /></li>
        <li><small>Sensação</small><b>{temp(c.main.feels_like, units)}°{units}</b></li>
        <li><small>Pressão</small><b>{c.main.pressure} hPa</b></li>
        <li><small>Visibilidade</small><b>{((c.visibility ?? 0) / 1000).toFixed(1)} km</b></li>
        <li><small>Sol (nasce / põe)</small><b>{hhmm(c.sys.sunrise, c.timezone)} / {hhmm(c.sys.sunset, c.timezone)}</b></li>
      </ul>
    </section>
  );
}