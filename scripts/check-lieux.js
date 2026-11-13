// Vérifie que chaque lieu mystère est couvert par l'ombrage LiDAR HD.
// Télécharge les 3 × 3 tuiles autour du point, au zoom de la carte indice, et mesure
// la part de pixels non transparents. Code de sortie 1 si un lieu est sous le seuil.
//
// Usage : npm run check-lieux [-- id1 id2 ...]

import { PNG } from 'pngjs';
import { LIEUX_MYSTERES, CLUE_ZOOM, WMTS_BASE_URL, LAYER_LIDAR_SHADOW } from '../js/config.js';

// Les îles sont surtout entourées de mer (sans données) : on reste bas
const SEUIL = 0.05;
const CONCURRENCE = 8;

function tuile(lat, lng, z) {
  const n = 2 ** z;
  const x = Math.floor(((lng + 180) / 360) * n);
  const r = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2) * n);
  return { x, y };
}

async function partCouverte(z, x, y) {
  const params = new URLSearchParams({
    SERVICE: 'WMTS',
    VERSION: '1.0.0',
    REQUEST: 'GetTile',
    LAYER: LAYER_LIDAR_SHADOW,
    STYLE: 'normal',
    TILEMATRIXSET: 'PM',
    FORMAT: 'image/png',
    TILEMATRIX: z,
    TILEROW: y,
    TILECOL: x,
  });
  const res = await fetch(`${WMTS_BASE_URL}?${params}`);
  if (!res.ok) return 0;

  const { data, width, height } = PNG.sync.read(Buffer.from(await res.arrayBuffer()));
  let opaques = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 0) opaques++;
  return opaques / (width * height);
}

async function verifier(lieu) {
  const z = lieu.zoom ?? CLUE_ZOOM;
  const { x, y } = tuile(lieu.lat, lieu.lng, z);
  const parts = await Promise.all(
    [-1, 0, 1].flatMap((dx) => [-1, 0, 1].map((dy) => partCouverte(z, x + dx, y + dy))),
  );
  return { lieu, couverture: parts.reduce((a, b) => a + b, 0) / parts.length };
}

const ids = process.argv.slice(2).map(Number);
const lieux = ids.length ? LIEUX_MYSTERES.filter((l) => ids.includes(l.id)) : LIEUX_MYSTERES;

const resultats = [];
for (let i = 0; i < lieux.length; i += CONCURRENCE) {
  resultats.push(...(await Promise.all(lieux.slice(i, i + CONCURRENCE).map(verifier))));
}

let echecs = 0;
for (const { lieu, couverture } of resultats) {
  const ok = couverture >= SEUIL;
  if (!ok) echecs++;
  const pct = `${Math.round(couverture * 100)} %`.padStart(5);
  console.log(`${ok ? '✓' : '✗'} ${String(lieu.id).padStart(2)} ${pct}  ${lieu.nom}`);
}

console.log(`\n${resultats.length - echecs}/${resultats.length} lieux couverts`);
process.exitCode = echecs ? 1 : 0;
