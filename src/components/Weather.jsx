import { art, hhmm, temp, wind } from '../units';
import { useCountUp } from '../useCountUp';
import Forecast from './Forecast';
import { Water, Wind } from './Icons';

export default function Weather({ c, forecast, units, onUnits, isFav, onFav }) {
  const w = c.weather[0];
  const t = useCountUp(temp(c.main.temp, units));
  return (
    <div className="wx">
      <p className="place">{c.name}, {c.sys.country}</p>
      <img className="art" src={art(w.main)} alt={w.description} />
      <p className="temp">
        {t}
        <button className="deg" onClick={onUnits} title="Alternar °C/°F" aria-label="Alternar entre Celsius e Fahrenheit">°{units}</button>
      </p>
      <p className="desc">{w.description}</p>
      <div className="details">
        <div><Water /><p><b>{c.main.humidity}%</b><small>Umidade</small></p></div>
        <div><Wind /><p><b>{wind(c.wind.speed, units)}</b><small>Vento</small></p></div>
      </div>
      <ul className="extra">
        <li><span>Sensação</span>{temp(c.main.feels_like, units)}°</li>
        <li><span>Pressão</span>{c.main.pressure} hPa</li>
        <li><span>Sol</span>{hhmm(c.sys.sunrise, c.timezone)} / {hhmm(c.sys.sunset, c.timezone)}</li>
      </ul>
      <Forecast days={forecast} units={units} />
      <button className="favtxt" onClick={onFav} aria-pressed={isFav}>{isFav ? 'Remover das favoritas' : 'Adicionar às favoritas'}</button>
    </div>
  );
}
