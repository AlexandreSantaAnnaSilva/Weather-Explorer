import { TIERS } from '../game';

const LINE = '#06283d';
const COLORS = { y: '#ffd23f', w: '#ffffff', b: '#3fa9f5', o: '#ff9f1c', r: '#e63946', g: '#4caf50' };
const GRAY = { ...Object.fromEntries(Object.keys(COLORS).map((k) => [k, '#d3dde3'])), w: '#f6f9fb' };

// contorno + preenchimento: desenha os mesmos traços duas vezes (grosso escuro, fino colorido)
const Outlined = ({ d, color, line, w = 4 }) => (
  <>
    <path d={d} fill="none" stroke={line} strokeWidth={w + 3.5} strokeLinecap="round" />
    <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" />
  </>
);

// um desenho por selo (área útil: ~ 28 a 68 no viewBox 96)
const EMBLEMS = {
  primeiro: (c) => (
    <path d="M48 28l5.9 12 13.1 1.9-9.5 9.2 2.2 13.1L48 58l-11.7 6.2 2.2-13.1-9.5-9.2 13.1-1.9z" fill={c.y} />
  ),
  chuva: (c, l) => {
    const cloud = (
      <>
        <circle cx="39" cy="46" r="8" /><circle cx="49" cy="39" r="11" /><circle cx="60" cy="45" r="9" /><rect x="39" y="45" width="21" height="9" />
      </>
    );
    return (
      <>
        <g stroke={l} strokeWidth="6.5">{cloud}</g>
        <g fill={c.w} stroke="none">{cloud}</g>
        {[40, 49, 58].map((x) => (
          <path key={x} d={`M${x} 58q-3 4.5-3 6.5a3 3 0 0 0 6 0q0-2-3-6.5z`} fill={c.b} />
        ))}
      </>
    );
  },
  frio: (c, l) => <Outlined d="M48 28v40M31 38l34 20M65 38L31 58" color={c.b} line={l} w={3.6} />,
  deserto: (c, l) => (
    <>
      <Outlined d="M48 26v6M48 64v6M26 48h6M64 48h6M32 32l4 4M60 60l4 4M64 32l-4 4M36 60l-4 4" color={c.o} line={l} w={3.4} />
      <circle cx="48" cy="48" r="11" fill={c.y} />
    </>
  ),
  explorador: (c) => (
    <>
      <circle cx="48" cy="48" r="19" fill={c.w} />
      <g transform="rotate(45 48 48)">
        <path d="M48 32l6 16H42z" fill={c.r} />
        <path d="M48 64l6-16H42z" fill={c.b} />
      </g>
      <circle cx="48" cy="48" r="2.4" fill={c.w} strokeWidth="1.5" />
    </>
  ),
  viajante: (c) => (
    <>
      <circle cx="48" cy="48" r="19" fill={c.b} />
      <g fill="none" stroke={c.w} strokeWidth="2">
        <ellipse cx="48" cy="48" rx="7.5" ry="19" />
        <path d="M29 48h38M32 38h32M32 58h32" />
      </g>
    </>
  ),
  sequencia: (c, l) => (
    <>
      <rect x="32" y="35" width="32" height="30" rx="4" fill={c.w} />
      <path d="M32 39a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v5H32z" fill={c.r} />
      <path d="M40 31v7M56 31v7" fill="none" strokeWidth="3.4" />
      <path d="M40 54l5.5 5.5L57 49" fill="none" stroke={l} strokeWidth="3.6" />
    </>
  ),
  colecionador: (c) => (
    <>
      <path d="M38 32h20v13a10 10 0 0 1-20 0z" fill={c.y} />
      <path d="M38 36h-5a5 5 0 0 0 5 10M58 36h5a5 5 0 0 1-5 10" fill="none" />
      <rect x="45" y="55" width="6" height="6" fill={c.y} />
      <rect x="40" y="61" width="16" height="5" rx="1.5" fill={c.y} />
    </>
  ),
};

export function SealArt({ id, tier, earned }) {
  const c = earned ? COLORS : GRAY;
  const line = earned ? LINE : '#9fb1bc';
  const ring = earned ? TIERS[tier].color : '#d3dde3';
  return (
    <svg className="seal-art" viewBox="0 0 96 96" aria-hidden="true">
      <circle cx="48" cy="48" r="46" fill="none" stroke={ring} strokeWidth="2" strokeDasharray="3 4" strokeLinecap="round" />
      <circle cx="48" cy="48" r="42" fill={ring} stroke={line} strokeWidth="3" />
      <circle cx="48" cy="48" r="33" fill={earned ? '#fff' : '#eef3f6'} stroke={line} strokeWidth="3" />
      <g stroke={line} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">{EMBLEMS[id](c, line)}</g>
      {earned && <ellipse cx="34" cy="24" rx="19" ry="8" fill="#fff" opacity=".4" transform="rotate(-28 34 24)" />}
    </svg>
  );
}

// carimbo de viagem: selo circular de correio, com o nome da cidade em arco
const INKS = ['#0b4468', '#a4161a', '#1f7a5a'];
const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const ROT = [-8, 5, -3, 9, -6, 3];

export function Postmark({ id, city, country, date, index }) {
  const name = (city.length > 13 ? `${city.slice(0, 12)}.` : city).toUpperCase();
  const when = `${date.slice(8)} ${MONTHS[+date.slice(5, 7) - 1]} ${date.slice(0, 4)}`;
  const arc = `arc-${id}`;
  return (
    <svg className="postmark" viewBox="0 0 120 120" role="img" aria-label={`Carimbo de ${city}, ${country}, ${when}`}
      style={{ color: INKS[index % INKS.length], '--rot': `${ROT[index % ROT.length]}deg` }}>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="60" cy="60" r="49" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path id={arc} d="M22 60A38 38 0 0 1 98 60" fill="none" />
      <text fill="currentColor" fontSize="10.5" fontWeight="700" letterSpacing="1.2" textAnchor="middle">
        <textPath href={`#${arc}`} startOffset="50%">{name}</textPath>
      </text>
      <text x="60" y="69" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="800" fontFamily="Poppins, sans-serif">{country}</text>
      <text x="60" y="93" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="700" letterSpacing=".6">{when}</text>
      <circle cx="9" cy="60" r="1.8" fill="currentColor" /><circle cx="111" cy="60" r="1.8" fill="currentColor" />
    </svg>
  );
}