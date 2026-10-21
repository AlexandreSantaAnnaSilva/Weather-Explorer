import { art } from '../units';

const fmt = (iso) => iso.split('-').reverse().join('/');
const LEVEL = {
  high: { title: 'Vai chover', main: 'Rain' },
  mid: { title: 'Pode chover', main: 'Clouds' },
  low: { title: 'Sem chuva prevista', main: 'Clear' },
};

export default function RainCheck({ date, city, outlook }) {
  const today = new Date().toLocaleDateString('sv');
  const day = outlook?.days?.[date];

  if (!outlook || outlook.failed || !day) {
    const msg = !outlook ? 'Buscando a previsão por data…'
      : outlook.failed ? 'A previsão por data está indisponível no momento.'
      : date < today ? 'Essa data já passou.'
      : 'Só consigo prever os próximos 16 dias a partir de hoje.';
    return <div className="rain low note" role="status"><div><small>{city} · {fmt(date)}</small><span>{msg}</span></div></div>;
  }

  const { prob, mm } = day;
  const level = (prob ?? 0) >= 60 || mm >= 5 ? 'high' : (prob ?? 0) >= 30 || mm >= 1 ? 'mid' : 'low';
  return (
    <div className={`rain ${level}`} key={date} role="status">
      <img src={art(LEVEL[level].main)} alt="" />
      <div>
        <small>{city} · {fmt(date)}</small>
        <b>{LEVEL[level].title}</b>
        <span>Probabilidade {prob == null ? 'n/d' : `${prob}%`} · {mm.toFixed(1).replace('.', ',')} mm</span>
      </div>
    </div>
  );
}
