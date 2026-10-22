import { art, temp } from '../units';
import { useCountUp } from '../useCountUp';

export default function Now({ c, units, onUnits, isFav, onFav }) {
  const w = c.weather[0];
  const t = useCountUp(temp(c.main.temp, units));
  return (
    <article className="card now">
     <p className="place">{c.name}{c.state ? `, ${c.state}` : ''}, {c.sys.country}</p>
      <img className="art" src={art(w.main)} alt={w.description} />
      <p className="temp">
        {t}
        <button className="deg" onClick={onUnits} title="Alternar °C/°F" aria-label="Alternar entre Celsius e Fahrenheit">°{units}</button>
      </p>
      <p className="desc">{w.description}</p>
      <button className="favtxt" onClick={onFav} aria-pressed={isFav}>{isFav ? 'Remover das favoritas' : 'Adicionar às favoritas'}</button>
    </article>
  );
}