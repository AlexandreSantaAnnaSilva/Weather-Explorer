import { BADGES, TIERS, levelOf } from '../game';
import { SealArt } from './StampArt';
import { Postmark } from './CountryStamp';

export default function Passport({ game, onRemoveCity  }) {
  const L = levelOf(game.xp);
  const pct = L.next ? Math.round(((game.xp - L.base) / (L.next - L.base)) * 100) : 100;
  const cities = Object.entries(game.cities);
  const earned = BADGES.filter((b) => game.badges.includes(b.id)).length;

  return (
    <section className="album">
      <header className="album-head">
        <div>
          <p className="album-kicker">Álbum de selos</p>
          <h2>{L.title}</h2>
          <p className="album-lv">Nível {L.level}</p>
        </div>
        <div className="album-count">
          <b>{earned}/{BADGES.length}</b>
          <small>selos</small>
        </div>
      </header>

      <div className="xp">
        <div className="xp-bar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100"><i style={{ width: `${pct}%` }} /></div>
        <small>{game.xp} XP{L.next ? `, faltam ${L.next - game.xp} para o nível ${L.level + 1}` : ', nível máximo'}</small>
      </div>

      <h3>Selos</h3>
      <ul className="seals">
        {BADGES.map((b) => {
          const on = game.badges.includes(b.id);
          const t = TIERS[b.tier];
          return (
            <li key={b.id} className={`seal${on ? ' on' : ''}`} style={{ '--tier': t.color }}>
              <div className="seal-wrap"><SealArt id={b.id} tier={b.tier} earned={on} /></div>
              <b>{b.name}</b>
              <span className="seal-desc">{b.desc}</span>
              <em className="tier">{t.label} · +{t.xp} XP</em>
            </li>
          );
        })}
      </ul>

      <h3>Carimbos de viagem ({cities.length})</h3>
      <div className="postmarks">
        {cities.length === 0 && <p className="empty">Pesquise uma cidade para ganhar o seu primeiro carimbo.</p>}
        {cities.map(([id, c], i) => (
          <div key={id} className="pm">
            <Postmark id={id} city={c.name} country={c.country} date={c.date} index={i} />
            <button className="pm-x" onClick={() => onRemoveCity(id)} aria-label={`Remover o carimbo de ${c.name}`}>remover</button>
          </div>        ))}
      </div>
    </section>
  );
}