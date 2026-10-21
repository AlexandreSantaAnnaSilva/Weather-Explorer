import { art, temp } from '../units';

export default function Forecast({ days, units }) {
  return (
    <section className="card" aria-label="Previsão dos próximos dias">
      <h3 className="card-title">Próximos dias</h3>
      <div className="days">
        {days.map((d) => (
          <div key={d.date} className="day">
            <span>{new Date(`${d.date}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span>
            <small className="dt">{d.date.slice(8)}/{d.date.slice(5, 7)}</small>
            <img src={art(d.main)} alt={d.desc} />
            <b>{temp(d.max, units)}°</b>
            <small className="mn">{temp(d.min, units)}°</small>
          </div>
        ))}
      </div>
    </section>
  );
}
