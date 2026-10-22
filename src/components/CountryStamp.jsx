// Carimbo de viagem com identidade própria por país:
// formato + padrão inspirado na bandeira + cores + detalhe. Países sem desenho manual
// recebem um estilo único gerado a partir do código (sempre o mesmo para o mesmo país).

const INK = '#06283d';
const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const ROT = [-8, 5, -3, 9, -6, 3];

// ---------- formatos ----------
const ring = (r, wob) => {
  let d = '';
  for (let i = 0; i < 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    const rr = r + wob * Math.cos(14 * t);
    d += `${i ? 'L' : 'M'}${(60 + rr * Math.cos(t)).toFixed(1)} ${(60 + rr * Math.sin(t)).toFixed(1)}`;
  }
  return `${d}z`;
};
const ticket = (() => { // selo postal com bordas serrilhadas
  const a = 8, b = 112, n = 8, L = (b - a) / n, r = 3.6;
  const c = (k) => a + L * (k + 0.5);
  let d = `M${a} ${a}`;
  for (let k = 0; k < n; k++) d += `L${c(k) - r} ${a}A${r} ${r} 0 0 0 ${c(k) + r} ${a}`;
  d += `L${b} ${a}`;
  for (let k = 0; k < n; k++) d += `L${b} ${c(k) - r}A${r} ${r} 0 0 0 ${b} ${c(k) + r}`;
  d += `L${b} ${b}`;
  for (let k = n - 1; k >= 0; k--) d += `L${c(k) + r} ${b}A${r} ${r} 0 0 0 ${c(k) - r} ${b}`;
  d += `L${a} ${b}`;
  for (let k = n - 1; k >= 0; k--) d += `L${a} ${c(k) + r}A${r} ${r} 0 0 0 ${a} ${c(k) - r}`;
  return `${d}z`;
})();
const SHAPES = {
  round: 'M6 60a54 54 0 1 0 108 0a54 54 0 1 0-108 0z',
  ticket,
  shield: 'M60 6L106 18V64C106 92 86 106 60 114C34 106 14 92 14 64V18z',
  octagon: 'M36 6H84L114 36V84L84 114H36L6 84V36z',
  hex: 'M60 4L110 32V88L60 116L10 88V32z',
  rosette: ring(52, 3.2),
  arch: 'M12 114V58A48 48 0 0 1 108 58V114z',
};
const SHAPE_LIST = Object.keys(SHAPES);

// ---------- estilos por país: [formato, padrão, cores, detalhe, proporções] ----------
const STYLES = {
  BR: ['round', 'diamond', ['#009c3b', '#ffdf00', '#002776']],
  US: ['ticket', 'canton', ['#b22234', '#ffffff', '#3c3b6e']],
  AR: ['arch', 'h3', ['#74acdf', '#ffffff', '#74acdf'], 'sun'],
  CL: ['shield', 'h2', ['#ffffff', '#d52b1e', '#0039a6'], 'cantonstar'],
  CO: ['hex', 'h3', ['#fcd116', '#003893', '#ce1126'], null, [2, 1, 1]],
  MX: ['octagon', 'v3', ['#006847', '#ffffff', '#ce1126']],
  UY: ['rosette', 'h3', ['#ffffff', '#0038a8', '#ffffff'], 'sun'],
  PE: ['arch', 'v3', ['#d91023', '#ffffff', '#d91023']],
  CA: ['ticket', 'v3', ['#d80621', '#ffffff', '#d80621'], null, [1, 2, 1]],
  VE: ['hex', 'h3', ['#ffcc00', '#00247d', '#cf142b']],
  PY: ['shield', 'h3', ['#d52b1e', '#ffffff', '#0038a8']],
  BO: ['octagon', 'h3', ['#d52b1e', '#f9e300', '#007934']],
  EC: ['round', 'h3', ['#ffdd00', '#034ea2', '#ed1c24'], null, [2, 1, 1]],
  PT: ['shield', 'v2', ['#006600', '#ff0000', '#ffcc00'], 'halo', [2, 3]],
  ES: ['ticket', 'h3', ['#c60b1e', '#ffc400', '#c60b1e'], null, [1, 2, 1]],
  FR: ['rosette', 'v3', ['#0055a4', '#ffffff', '#ef4135']],
  IT: ['hex', 'v3', ['#009246', '#ffffff', '#ce2b37']],
  DE: ['ticket', 'h3', ['#000000', '#dd0000', '#ffce00']],
  GB: ['shield', 'jack', ['#012169', '#ffffff', '#c8102e']],
  IE: ['round', 'v3', ['#169b62', '#ffffff', '#ff883e']],
  NL: ['octagon', 'h3', ['#ae1c28', '#ffffff', '#21468b']],
  BE: ['arch', 'v3', ['#000000', '#fae042', '#ed2939']],
  CH: ['ticket', 'plus', ['#da291c', '#ffffff']],
  SE: ['hex', 'cross', ['#006aa7', '#fecd00']],
  NO: ['shield', 'cross', ['#ba0c2f', '#ffffff', '#00205b']],
  DK: ['arch', 'cross', ['#c8102e', '#ffffff']],
  FI: ['round', 'cross', ['#ffffff', '#003580']],
  GR: ['octagon', 'stripes', ['#0d5eaf', '#ffffff']],
  PL: ['ticket', 'h2', ['#ffffff', '#dc143c']],
  UA: ['arch', 'h2', ['#0057b7', '#ffd700']],
  RU: ['octagon', 'h3', ['#ffffff', '#0039a6', '#d52b1e']],
  AT: ['hex', 'h3', ['#ed2939', '#ffffff', '#ed2939']],
  HU: ['shield', 'h3', ['#cd2a3e', '#ffffff', '#436f4d']],
  TR: ['rosette', 'field', ['#e30a17', '#ffffff'], 'crescent'],
  JP: ['round', 'disc', ['#ffffff', '#bc002d']],
  CN: ['ticket', 'field', ['#de2910', '#ffde00'], 'star'],
  KR: ['rosette', 'disc', ['#ffffff', '#cd2e3a', '#0047a0']],
  IN: ['hex', 'h3', ['#ff9933', '#ffffff', '#138808'], ['ring', '#000080']],
  AU: ['ticket', 'jack', ['#00008b', '#ffffff', '#e4002b']],
  NZ: ['arch', 'jack', ['#00247d', '#ffffff', '#cc142b']],
  ZA: ['octagon', 'diag', ['#007a4d', '#002395', '#ffb612']],
  EG: ['arch', 'h3', ['#ce1126', '#ffffff', '#000000']],
  NG: ['round', 'v3', ['#008751', '#ffffff', '#008751']],
  MA: ['rosette', 'field', ['#c1272d', '#006233'], ['star', '#006233']],
  IL: ['ticket', 'h3', ['#0038b8', '#ffffff', '#0038b8'], null, [1, 3, 1]],
  SA: ['shield', 'field', ['#006c35', '#ffffff']],
  ID: ['round', 'h2', ['#ce1126', '#ffffff']],
};

// qualquer outro país: estilo gerado a partir do código
const PAL = ['#d62828', '#1d4e89', '#2a9d5c', '#f4c430', '#f08a24', '#4fb3e8', '#7b3fa0', '#e4572e', '#16808d', '#c2185b', '#ffffff', '#2b2d42'];
const PATS = ['h3', 'v3', 'h2', 'cross', 'disc', 'diag', 'rays'];
function auto(code) {
  let h = 7;
  for (const ch of code) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  h = Math.imul(h, 2654435761) >>> 0;
  const i0 = (h >>> 8) % PAL.length;
  const i1 = (i0 + 1 + ((h >>> 12) % (PAL.length - 1))) % PAL.length;
  const i2 = (i1 + 1 + ((h >>> 16) % (PAL.length - 1))) % PAL.length;
  return [SHAPE_LIST[h % SHAPE_LIST.length], PATS[(h >>> 4) % PATS.length], [PAL[i0], PAL[i1], PAL[i2]]];
}

// ---------- padrões (inspirados em bandeiras) ----------
const star = (cx, cy, R) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? R * 0.42 : R;
    d += `${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  }
  return `${d}z`;
};

function bands(cols, ratios, vertical) {
  const total = ratios.reduce((a, b) => a + b, 0);
  let pos = 0;
  return cols.map((col, i) => {
    const size = (120 * ratios[i]) / total;
    const el = vertical
      ? <rect key={i} x={pos} y="0" width={size + 0.5} height="120" fill={col} />
      : <rect key={i} x="0" y={pos} width="120" height={size + 0.5} fill={col} />;
    pos += size;
    return el;
  });
}

function Pattern({ type, c, r }) {
  switch (type) {
    case 'h3': return bands(c.slice(0, 3), r || [1, 1, 1], false);
    case 'h2': return bands(c.slice(0, 2), r || [1, 1], false);
    case 'v3': return bands(c.slice(0, 3), r || [1, 1, 1], true);
    case 'v2': return bands(c.slice(0, 2), r || [1, 1], true);
    case 'stripes': return Array.from({ length: 9 }, (_, i) => <rect key={i} x="0" y={(i * 120) / 9} width="120" height={120 / 9 + 0.5} fill={c[i % 2]} />);
    case 'cross': return (
      <>
        <rect width="120" height="120" fill={c[0]} />
        <rect x="32" y="0" width="22" height="120" fill={c[1]} /><rect x="0" y="49" width="120" height="22" fill={c[1]} />
        {c[2] && <><rect x="38" y="0" width="10" height="120" fill={c[2]} /><rect x="0" y="55" width="120" height="10" fill={c[2]} /></>}
      </>
    );
    case 'plus': return (
      <>
        <rect width="120" height="120" fill={c[0]} />
        <rect x="48" y="14" width="24" height="92" fill={c[1]} /><rect x="14" y="48" width="92" height="24" fill={c[1]} />
      </>
    );
    case 'disc': return (
      <>
        <rect width="120" height="120" fill={c[0]} />
        <circle cx="60" cy="40" r="30" fill={c[1]} />
        {c[2] && <path d="M30 40a30 30 0 0 0 60 0z" fill={c[2]} />}
      </>
    );
    case 'diamond': return (
      <>
        <rect width="120" height="120" fill={c[0]} />
        <path d="M60 8L114 60L60 112L6 60z" fill={c[1]} />
        <circle cx="60" cy="40" r="26" fill={c[2]} />
      </>
    );
    case 'canton': return (
      <>
        {Array.from({ length: 7 }, (_, i) => <rect key={i} x="0" y={(i * 120) / 7} width="120" height={120 / 7 + 0.5} fill={c[i % 2]} />)}
        <rect width="62" height="60" fill={c[2]} />
        {[0, 1, 2].flatMap((row) => [0, 1, 2, 3].map((col) => <circle key={`${row}${col}`} cx={10 + col * 14 + (row % 2) * 7} cy={12 + row * 18} r="2.8" fill="#fff" />))}
      </>
    );
    case 'jack': return (
      <>
        <rect width="120" height="120" fill={c[0]} />
        <path d="M0 0L120 120M120 0L0 120" stroke={c[1]} strokeWidth="16" />
        <path d="M0 0L120 120M120 0L0 120" stroke={c[2]} strokeWidth="6" />
        <path d="M60 0V120M0 60H120" stroke={c[1]} strokeWidth="26" />
        <path d="M60 0V120M0 60H120" stroke={c[2]} strokeWidth="14" />
      </>
    );
    case 'diag': return (
      <>
        <polygon points="0,0 120,0 0,120" fill={c[0]} />
        <polygon points="120,0 120,120 0,120" fill={c[1]} />
        <path d="M0 120L120 0" stroke={c[2]} strokeWidth="16" />
      </>
    );
    case 'rays': return (
      <>
        <rect width="120" height="120" fill={c[0]} />
        {Array.from({ length: 12 }, (_, i) => {
          const a1 = (i * 30 * Math.PI) / 180, a2 = ((i * 30 + 15) * Math.PI) / 180;
          return <path key={i} d={`M60 50L${(60 + 120 * Math.cos(a1)).toFixed(1)} ${(50 + 120 * Math.sin(a1)).toFixed(1)}L${(60 + 120 * Math.cos(a2)).toFixed(1)} ${(50 + 120 * Math.sin(a2)).toFixed(1)}z`} fill={c[1]} />;
        })}
      </>
    );
    default: return <rect width="120" height="120" fill={c[0]} />;
  }
}

// detalhes que ficam em volta do círculo do código (60, 40)
function Motif({ motif, c }) {
  const [name, color] = Array.isArray(motif) ? motif : [motif];
  switch (name) {
    case 'sun': return Array.from({ length: 16 }, (_, i) => {
      const a = (i * 22.5 * Math.PI) / 180;
      const p = (r) => `${(60 + r * Math.cos(a)).toFixed(1)} ${(40 + r * Math.sin(a)).toFixed(1)}`;
      return <path key={i} d={`M${p(23)}L${p(31)}`} stroke="#f6b40e" strokeWidth="3.2" strokeLinecap="round" />;
    });
    case 'star': return (
      <>
        <path d={star(24, 26, 13)} fill={color || '#ffde00'} />
        {[[96, 18], [104, 32], [104, 50], [96, 64]].map(([x, y]) => <path key={x + y} d={star(x, y, 4.6)} fill={color || '#ffde00'} />)}
      </>
    );
    case 'crescent': return (
      <>
        <circle cx="28" cy="30" r="15" fill="#fff" /><circle cx="33" cy="30" r="12" fill={c[0]} />
        <path d={star(52, 30, 6)} fill="#fff" />
      </>
    );
    case 'ring': return <circle cx="60" cy="40" r="25" fill="none" stroke={color || '#000080'} strokeWidth="3" />;
    case 'halo': return <circle cx="60" cy="40" r="26" fill={c[2]} />;
    case 'cantonstar': return (
      <>
        <rect width="50" height="58" fill={c[2]} />
        <path d={star(25, 29, 14)} fill="#fff" />
      </>
    );
    default: return null;
  }
}

export function Postmark({ id, city, country = '??', date, index }) {
  const [shape, pattern, colors, motif, ratios] = STYLES[country] || auto(country);
  const d = SHAPES[shape];
  const clip = `cs-${index}`;
  const name = city.length > 17 ? `${city.slice(0, 16)}.` : city;
  const fs = Math.max(7, Math.min(10, 72 / (name.length * 0.7)));
  const wide = name.length * (0.68 * fs + 0.4) > 68; // nome comprido: comprime para caber na faixa
  const when = `${date.slice(8)} ${MONTHS[+date.slice(5, 7) - 1]} ${date.slice(0, 4)}`;

  return (
    <svg className="postmark" viewBox="0 0 120 120" role="img" aria-label={`Carimbo de ${city}, ${country}, ${when}`}
      style={{ '--rot': `${ROT[index % ROT.length]}deg` }}>
      <defs><clipPath id={clip}><path d={d} /></clipPath></defs>
      <g clipPath={`url(#${clip})`}>
        <Pattern type={pattern} c={colors} r={ratios} />
        {motif && <Motif motif={motif} c={colors} />}
      </g>
      <path d={d} fill="none" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="1.2" transform="translate(60 60) scale(.9) translate(-60 -60)" />
      <circle cx="60" cy="40" r="19" fill="#fff" stroke={INK} strokeWidth="2.5" />
      <text x="60" y="47" textAnchor="middle" fill={INK} fontSize="20" fontWeight="800" fontFamily="Poppins, sans-serif">{country}</text>
      <rect x="22" y="66" width="76" height="24" rx="5" fill="#fff" stroke={INK} strokeWidth="2.2" />
      <text x="60" y="77.5" textAnchor="middle" fill={INK} fontSize={fs} fontWeight="800" letterSpacing=".4" textLength={wide ? 68 : undefined} lengthAdjust="spacingAndGlyphs">{name.toUpperCase()}</text>
      <text x="60" y="86.5" textAnchor="middle" fill={INK} fontSize="7" fontWeight="700" letterSpacing=".6" opacity=".75">{when}</text>
    </svg>
  );
}