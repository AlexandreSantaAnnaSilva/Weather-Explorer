import { BADGES, levelOf } from '../game';

export default function Passport({ game }) {
  const L = levelOf(game.xp);
  const pct = L.next ? Math.round(((game.xp - L.base) / (L.next - L.base)) * 100) : 100;
  const cities = Object.entries(game.cities);
  return (
    <section className="passport">
      <div className="pp-side">
        <h2>Passaporte climático</h2>
        <p className="level">Nível {L.level}: {L.title}</p>
        <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100"><i style={{ width: `${pct}%` }} /></div>
        <small>{game.xp} XP{L.next ? `, faltam ${L.next - game.xp} para o próximo nível` : ', nível máximo'}</small>
      </div>

      <div className="pp-main">
        <h3>Conquistas</h3>
        <div className="badges">
          {BADGES.map((b) => {
            const on = game.badges.includes(b.id);
            return (
              <div key={b.id} className={`badge${on ? ' on' : ''}`}>
                <small>{on ? 'Conquistada' : 'Bloqueada'}</small>
                <b>{b.name}</b>
                <span>{b.desc}</span>
              </div>
            );
          })}
        </div>

        <h3>Carimbos ({cities.length})</h3>
        <div className="stamps">
          {cities.length === 0 && <p>Pesquise uma cidade para ganhar seu primeiro carimbo.</p>}
          {cities.map(([id, c]) => (
            <div key={id} className="stamp">
              <b>{c.name}</b>
              <small>{c.country} · {c.date}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
