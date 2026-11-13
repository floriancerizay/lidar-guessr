import { WMS_R_URL, LAYER_LIDAR_MNT } from './config.js';

// Résolution de la grille d'altitude servant à fixer l'étendue des couleurs (3D et carte)
export const POINTS_LARGEUR = 256;

// Altitude minimale plausible : en dessous, absence de données (mer, hors couverture)
export const ALTITUDE_ABSENTE = -50;

// Teinte HSL de l'échelle d'altitude : vert (bas) vers rouge (haut)
const TEINTE_BAS = 0.33;
const TEINTE_HAUT = 0;
const SATURATION = 0.85;
const LUMINOSITE = 0.62;

export function wmsUrl(layer, format, bbox, width, height) {
  const params = new URLSearchParams({
    SERVICE: 'WMS',
    VERSION: '1.3.0',
    REQUEST: 'GetMap',
    LAYERS: layer,
    STYLES: '',
    CRS: 'EPSG:3857',
    BBOX: bbox.join(','),
    WIDTH: width,
    HEIGHT: height,
    FORMAT: format,
    TRANSPARENT: 'true',
  });
  return `${WMS_R_URL}?${params}`;
}

// Le WMS de la Géoplateforme renvoie par moments des erreurs passagères (400 LayerNotDefined,
// 502 Bad Gateway) qui disparaissent au nouvel essai : on réessaie avant d'abandonner
const ESSAIS = 4;
const DELAI_MS = 400;

/** fetch avec reprises (réseau, 5xx et 400 transitoires) ; renvoie la réponse OK ou lève une erreur. */
export async function fetchAvecReprises(url) {
  let erreur;
  for (let essai = 0; essai < ESSAIS; essai++) {
    if (essai) await new Promise((r) => setTimeout(r, DELAI_MS * 2 ** (essai - 1)));
    try {
      const res = await fetch(url);
      if (res.ok) return res;
      erreur = new Error(`HTTP ${res.status}`);
    } catch (err) {
      erreur = err;
    }
  }
  throw erreur;
}

export async function chargerAltitudes(bbox, cols, rows) {
  const res = await fetchAvecReprises(
    wmsUrl(LAYER_LIDAR_MNT, 'image/x-bil;bits=32', bbox, cols, rows),
  );
  return new Float32Array(await res.arrayBuffer());
}

/** Altitudes minimale et maximale valides d'une grille. */
export function etendueAltitudes(altitudes) {
  let min = Infinity;
  let max = -Infinity;
  for (const z of altitudes) {
    if (z <= ALTITUDE_ABSENTE) continue;
    if (z < min) min = z;
    if (z > max) max = z;
  }
  return { min, max };
}

function hslVersRgb(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h * 12) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [f(0), f(8), f(4)];
}

const versLineaire = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const versSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

/** Table de 256 couleurs (linéaires) de l'échelle d'altitude, indexée par fraction d'étendue. */
const PALETTE = Array.from({ length: 256 }, (_, i) =>
  hslVersRgb(TEINTE_BAS + (TEINTE_HAUT - TEINTE_BAS) * (i / 255), SATURATION, LUMINOSITE).map(
    versLineaire,
  ),
);

/**
 * Teinte un ombrage (RGBA sRGB) selon l'altitude, comme la vue 3D : la couleur d'altitude
 * multiplie l'ombrage, le produit étant fait en espace linéaire. Modifie `image` en place.
 */
export function teinterOmbrage(image, altitudes, { min, max }) {
  const etendue = max - min || 1;
  const px = image.data;
  for (let i = 0; i < altitudes.length; i++) {
    const z = altitudes[i] > ALTITUDE_ABSENTE ? altitudes[i] : min;
    const t = Math.min(1, Math.max(0, (z - min) / etendue));
    const couleur = PALETTE[Math.round(t * 255)];
    for (let c = 0; c < 3; c++) {
      px[i * 4 + c] = Math.round(versSrgb(versLineaire(px[i * 4 + c] / 255) * couleur[c]) * 255);
    }
  }
}

// Largeur (en cellules de la grille d'altitude) de la bande masquée le long des zones sans données
const RAYON_BORD = 4;

/**
 * Rend transparente la bande d'ombrage proche des zones sans données. À la limite de
 * couverture LiDAR, le MNT passe brutalement à -9999 : l'ombrage y dessine un « mur » et des
 * pointes qui n'existent pas. `altitudes` est une grille cols × rows, `image` peut être plus fine.
 */
export function masquerBords(image, altitudes, cols, rows) {
  if (!altitudes.some((z) => z <= ALTITUDE_ABSENTE)) return;

  // Dilatation séparable (horizontale puis verticale) des cellules sans données
  const horizontal = new Uint8Array(altitudes.length);
  const masque = new Uint8Array(altitudes.length);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      for (let k = Math.max(0, x - RAYON_BORD); k <= Math.min(cols - 1, x + RAYON_BORD); k++) {
        if (altitudes[y * cols + k] <= ALTITUDE_ABSENTE) {
          horizontal[y * cols + x] = 1;
          break;
        }
      }
    }
  }
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      for (let k = Math.max(0, y - RAYON_BORD); k <= Math.min(rows - 1, y + RAYON_BORD); k++) {
        if (horizontal[k * cols + x]) {
          masque[y * cols + x] = 1;
          break;
        }
      }
    }
  }

  const { width, height, data } = image;
  for (let py = 0; py < height; py++) {
    const gy = Math.min(rows - 1, Math.floor((py * rows) / height));
    for (let px = 0; px < width; px++) {
      const gx = Math.min(cols - 1, Math.floor((px * cols) / width));
      if (masque[gy * cols + gx]) data[(py * width + px) * 4 + 3] = 0;
    }
  }
}
