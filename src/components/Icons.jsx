// os 4 ícones do projeto original, em SVG (sem depender do Font Awesome)
const base = { viewBox: '0 0 24 24', 'aria-hidden': true, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const Pin = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" /></svg>
);
export const Search = () => (
  <svg {...base} strokeWidth="2.6"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M16 16l5 5" /></svg>
);
export const Water = () => (
  <svg {...base}><path d="M2 7c2.5-2.5 4.5-2.5 7 0s4.5 2.5 7 0 4.5-2.5 6 0M2 12c2.5-2.5 4.5-2.5 7 0s4.5 2.5 7 0 4.5-2.5 6 0M2 17c2.5-2.5 4.5-2.5 7 0s4.5 2.5 7 0 4.5-2.5 6 0" /></svg>
);
export const Wind = () => (
  <svg {...base}><path d="M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7" /></svg>
);
