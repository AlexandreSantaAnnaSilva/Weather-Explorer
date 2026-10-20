export const temp = (c, u) => Math.round(u === 'F' ? (c * 9) / 5 + 32 : c);
export const wind = (ms, u) => (u === 'F' ? `${Math.round(ms * 2.237)} mph` : `${Math.round(ms * 3.6)} km/h`);
// horário local da cidade (timestamp UTC + fuso em segundos)
export const hhmm = (t, tz) => new Date((t + tz) * 1000).toISOString().slice(11, 16);

// ilustrações do projeto original, por tipo de clima
const ART = { Clear: 'clear', Clouds: 'cloud', Rain: 'rain', Drizzle: 'rain', Thunderstorm: 'rain', Snow: 'snow' };
export const art = (main) => `${import.meta.env.BASE_URL}images/${ART[main] || 'mist'}.png`;
export const notFoundArt = `${import.meta.env.BASE_URL}images/404.png`;
