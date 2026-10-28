import { TIERS } from '../game';

const LINE = '#06283d';
const COLORS = { y: '#ffd23f', w: '#ffffff', b: '#3fa9f5', o: '#ff9f1c', r: '#e63946', g: '#4caf50' };
const GRAY = { ...Object.fromEntries(Object.keys(COLORS).map((k) => [k, '#d3dde3'])), w: '#f6f9fb' };
const STAR = 'M48 28l5.9 12 13.1 1.9-9.5 9.2 2.2 13.1L48 58l-11.7 6.2 2.2-13.1-9.5-9.2 13.1-1.9z';

// contorno + preenchimento: desenha os mesmos traços duas vezes (grosso escuro, fino colorido)
const Outlined = ({ d, color, line, w = 4 }) => (
  <>
    <path d={d} fill="none" stroke={line} strokeWidth={w + 3.5} strokeLinecap="round" />
    <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" />
  </>
);

// um desenho por selo (área útil: ~ 28 a 68 no viewBox 96). Recebe (cores, cor do contorno, cor do fundo)
const EMBLEMS = {
  // ----- fáceis -----
  primeiro: (c) => <path d={STAR} fill={c.y} />,
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
  noturno: (c) => (
    <>
      <path d="M52 31A19 19 0 1 0 66 58A17 17 0 1 1 52 31z" fill={c.y} />
      <path d={STAR} fill={c.y} transform="translate(60 38) scale(.22) translate(-48 -46)" />
    </>
  ),
  favorito: (c) => <path d="M48 67C31 54 27 42 34 35c5-5 11-3 14 3 3-6 9-8 14-3 7 7 3 19-14 32z" fill={c.r} />,
  // ----- médios -----
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
  previsor: (c, l) => (
    <>
      <path d="M27 50a21 21 0 0 1 42 0z" fill={c.b} />
      <path d="M48 29v21M48 29Q36 36 37 50M48 29Q60 36 59 50" fill="none" strokeWidth="1.8" />
      <Outlined d="M48 50v12a4 4 0 0 1-8 0" color={c.r} line={l} w={2.6} />
    </>
  ),
  ventania: (c, l) => (
    <>
      <Outlined d="M28 40h24a6 6 0 1 0-6-6" color={c.b} line={l} w={3.4} />
      <Outlined d="M28 51h34a6 6 0 1 1-6 6" color={c.b} line={l} w={3.4} />
      <Outlined d="M28 62h13" color={c.b} line={l} w={3.4} />
    </>
  ),
  neve: (c, l) => (
    <>
      <circle cx="48" cy="58" r="11" fill={c.w} />
      <circle cx="48" cy="41" r="8" fill={c.w} />
      <rect x="40" y="32" width="16" height="3" fill={l} />
      <rect x="44" y="24" width="8" height="9" fill={l} />
      <path d="M48 41l8 2-8 2z" fill={c.o} strokeWidth="1.6" />
      <g fill={l} stroke="none"><circle cx="45" cy="38.5" r="1.3" /><circle cx="51" cy="38.5" r="1.3" /><circle cx="48" cy="55" r="1.4" /><circle cx="48" cy="61" r="1.4" /></g>
    </>
  ),
  // ----- difíceis -----
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
  raio: (c) => <path d="M53 27L35 51h11l-4 18 20-26H50z" fill={c.y} />,
  equador: (c) => (
    <>
      <circle cx="48" cy="48" r="19" fill={c.b} />
      <rect x="29" y="43" width="38" height="9" fill={c.r} />
      <ellipse cx="48" cy="48" rx="7.5" ry="19" fill="none" stroke={c.w} strokeWidth="1.8" />
      <circle cx="48" cy="48" r="19" fill="none" />
    </>
  ),
  polar: (c, l) => (
    <>
      <path d="M34 47q-6 10-1 20q5-7 4-19z" fill={l} />
      <path d="M62 47q6 10 1 20q-5-7-4-19z" fill={l} />
      <ellipse cx="48" cy="48" rx="15" ry="20" fill={l} />
      <ellipse cx="48" cy="55" rx="9" ry="13" fill={c.w} stroke="none" />
      <circle cx="43" cy="40" r="3.2" fill={c.w} stroke="none" /><circle cx="53" cy="40" r="3.2" fill={c.w} stroke="none" />
      <g fill={l} stroke="none"><circle cx="43.5" cy="40.5" r="1.4" /><circle cx="52.5" cy="40.5" r="1.4" /></g>
      <path d="M44 45l4 6 4-6z" fill={c.o} strokeWidth="1.6" />
      <ellipse cx="42" cy="68" rx="5.5" ry="2.4" fill={c.o} /><ellipse cx="54" cy="68" rx="5.5" ry="2.4" fill={c.o} />
    </>
  ),
  brasil: (c) => (
    <>
      <circle cx="48" cy="48" r="19" fill={c.g} />
      <path d="M48 31L66 48L48 65L30 48z" fill={c.y} />
      <circle cx="48" cy="48" r="7" fill={c.b} />
      <path d="M41.5 49.5Q48 46 54.5 50" fill="none" stroke={c.w} strokeWidth="1.6" />
    </>
  ),
  // ----- extremo -----
  colecionador: (c) => (
    <>
      <path d="M38 32h20v13a10 10 0 0 1-20 0z" fill={c.y} />
      <path d="M38 36h-5a5 5 0 0 0 5 10M58 36h5a5 5 0 0 1-5 10" fill="none" />
      <rect x="45" y="55" width="6" height="6" fill={c.y} />
      <rect x="40" y="61" width="16" height="5" rx="1.5" fill={c.y} />
    </>
  ),
  // ----- secretos -----
  japao: (c) => (
    <>
      <circle cx="48" cy="42" r="12" fill={c.y} />
      <rect x="35" y="41" width="5" height="27" fill={c.r} /><rect x="56" y="41" width="5" height="27" fill={c.r} />
      <rect x="31" y="48" width="34" height="4" fill={c.r} />
      <path d="M26 35Q48 41 70 35L68 42Q48 47 28 42z" fill={c.r} />
    </>
  ),
  eua: (c, l) => {
    const shield = 'M48 28L67 34V50C67 61 58 67 48 71C38 67 29 61 29 50V34z';
    return (
      <>
        <defs><clipPath id="clip-eua"><path d={shield} /></clipPath></defs>
        <g clipPath="url(#clip-eua)" stroke="none">
          <rect x="28" y="27" width="40" height="46" fill={c.w} />
          {[44, 52, 60].map((y) => <rect key={y} x="28" y={y} width="40" height="4.5" fill={c.r} />)}
          <rect x="28" y="27" width="21" height="18" fill={c.b} />
        </g>
        <path d={shield} fill="none" />
        <path d={STAR} fill={c.w} stroke="none" transform="translate(38.5 36) scale(.22) translate(-48 -46)" />
      </>
    );
  },
  italia: (c, l) => (
    <>
      <path d="M32 35Q48 29 64 35L48 69z" fill={c.y} />
      <Outlined d="M32 35Q48 29 64 35" color={c.o} line={l} w={4.5} />
      <g fill={c.r} strokeWidth="1.6"><circle cx="43" cy="44" r="3.4" /><circle cx="53.5" cy="45" r="3.4" /><circle cx="48" cy="56" r="3.4" /></g>
    </>
  ),
  insonia: (c, l) => (
    <>
      <path d="M33 38l1-11 9 6zM63 38l-1-11-9 6z" fill={c.o} />
      <ellipse cx="48" cy="50" rx="17" ry="19" fill={c.o} />
      <circle cx="41" cy="46" r="7" fill={c.w} /><circle cx="55" cy="46" r="7" fill={c.w} />
      <g fill={l} stroke="none"><circle cx="41.5" cy="46.5" r="3" /><circle cx="54.5" cy="46.5" r="3" /></g>
      <path d="M44.5 52L48 58L51.5 52z" fill={c.y} strokeWidth="1.8" />
    </>
  ),
  geloefogo: (c) => (
    <>
      <path d="M48 29A19 19 0 0 0 48 67z" fill={c.b} />
      <path d="M48 29A19 19 0 0 1 48 67z" fill={c.o} />
      <path d="M38 41v14M32.5 44l11 8M43.5 44l-11 8" fill="none" stroke={c.w} strokeWidth="2" />
      <circle cx="58" cy="48" r="4.5" fill={c.y} strokeWidth="1.8" />
    </>
  ),
  gemeos: (c) => (
    <>
      <circle cx="41" cy="48" r="14" fill={c.b} />
      <circle cx="55" cy="48" r="14" fill={c.r} fillOpacity=".85" />
    </>
  ),
  halloween: (c, l) => (
    <>
      <ellipse cx="48" cy="53" rx="19" ry="15" fill={c.o} />
      <path d="M48 38v30M39 40q-7 13 0 26M57 40q7 13 0 26" fill="none" strokeWidth="1.8" />
      <g fill={l} strokeWidth="1.2"><path d="M36 50l6-4 1 7z" /><path d="M60 50l-6-4-1 7z" /></g>
      <path d="M39 59l3 3 3-3 3 3 3-3 3 3 3-3" fill="none" strokeWidth="2" />
      <Outlined d="M46 38q0-7 5-10" color={c.g} line={l} w={3.6} />
    </>
  ),
  natal: (c, l) => (
    <>
      <rect x="45" y="65" width="6" height="6" fill={c.o} />
      <path d="M48 36l15 19H33z" fill={c.g} /><path d="M48 46l18 20H30z" fill={c.g} /><path d="M48 27l12 16H36z" fill={c.g} />
      <path d={STAR} fill={c.y} transform="translate(48 26) scale(.28) translate(-48 -46)" />
      <g fill={c.r} stroke="none"><circle cx="45" cy="55" r="1.8" /><circle cx="53" cy="62" r="1.8" /><circle cx="42" cy="63" r="1.8" /></g>
    </>
  ),
};

// selo secreto ainda não descoberto: só aparece um ponto de interrogação
const MYSTERY = () => (
  <text x="48" y="61" textAnchor="middle" fontSize="40" fontWeight="800" fontFamily="Poppins, sans-serif" fill="#9fb1bc" stroke="none">?</text>
);

export function SealArt({ id, tier, earned, secret }) {
  const c = earned ? COLORS : GRAY;
  const line = earned ? LINE : '#9fb1bc';
  const ring = earned ? TIERS[tier].color : '#d3dde3';
  const face = earned ? '#fff' : '#eef3f6';
  const Emblem = secret && !earned ? MYSTERY : EMBLEMS[id];
  return (
    <svg className="seal-art" viewBox="0 0 96 96" aria-hidden="true">
      <circle cx="48" cy="48" r="46" fill="none" stroke={ring} strokeWidth="2" strokeDasharray="3 4" strokeLinecap="round" />
      <circle cx="48" cy="48" r="42" fill={ring} stroke={line} strokeWidth="3" />
      <circle cx="48" cy="48" r="33" fill={face} stroke={line} strokeWidth="3" />
      <g stroke={line} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">{Emblem(c, line, face)}</g>
      {earned && <ellipse cx="34" cy="24" rx="19" ry="8" fill="#fff" opacity=".4" transform="rotate(-28 34 24)" />}
    </svg>
  );
}