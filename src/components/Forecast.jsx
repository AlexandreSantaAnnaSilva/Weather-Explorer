import { art, temp } from '../units';

export default function Forecast({ days, units }) {
  return (
    <section className="forecast" aria-label="Previsão dos próximos dias">
      {days.map((d) => (
        <div key={d.date} className="day">
          <span>{new Date(`${d.date}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
          <img src={art(d.main)} alt={d.desc} />
          <b>{temp(d.max, units)}°</b>
          <small>{temp(d.min, units)}°</small>
        </div>
      ))}
    </section>
  );
}
