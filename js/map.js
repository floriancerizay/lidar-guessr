import {
  FRANCE_CENTER,
  GUESS_ZOOM,
  CLUE_ZOOM,
  WMTS_BASE_URL,
  LAYER_LIDAR_SHADOW,
  LAYER_PLAN_IGN,
  LAYER_ORTHO,
  DEZOOM_NIVEAUX,
} from './config.js';
import {
  POINTS_LARGEUR,
  chargerAltitudes,
  etendueAltitudes,
  fetchAvecReprises,
  masquerBords,
  teinterOmbrage,
  wmsUrl,
} from './couleurs-relief.js';

const ACCENT = '#171717';
const COULEUR_SOLUTION = '#16a34a';

/** Repère moderne : goutte pleine avec point central, pointe ancrée sur la position. */
function createPin(couleur) {
  return L.divIcon({
    className: 'pin',
    html: `<svg viewBox="0 0 32 42" width="32" height="42" aria-hidden="true">
      <path d="M16 1C8.3 1 2 7.2 2 14.8 2 25.4 16 41 16 41s14-15.6 14-26.2C30 7.2 23.7 1 16 1Z"
        fill="${couleur}" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="16" cy="15" r="5" fill="#fff"/>
    </svg>`,
    iconSize: [32, 42],
    iconAnchor: [16, 41],
  });
}

// Interactions de la carte indice, bloquées pendant la manche
const CLUE_HANDLERS = [
  'dragging',
  'scrollWheelZoom',
  'doubleClickZoom',
  'touchZoom',
  'boxZoom',
  'keyboard',
];

function wmtsUrl(layer, format = 'image/png') {
  const params = new URLSearchParams({
    SERVICE: 'WMTS',
    VERSION: '1.0.0',
    REQUEST: 'GetTile',
    LAYER: layer,
    STYLE: 'normal',
    TILEMATRIXSET: 'PM',
    FORMAT: format,
  });
  // Les gabarits {z}/{y}/{x} de Leaflet ne doivent pas être encodés
  return `${WMTS_BASE_URL}?${params}&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`;
}

const TUILE = 256;

/**
 * Ombrage LiDAR HD. Chaque tuile charge l'ombrage et les altitudes de son emprise pour masquer
 * les artefacts des bords de couverture, et teinte l'ombrage par l'altitude (même échelle que
 * la vue 3D) quand une étendue est définie. L'étendue (min / max) est fixée par l'appelant pour
 * que les couleurs restent cohérentes en navigant. Sans altitudes, l'ombrage brut est affiché.
 */
function createLidarLayer() {
  let etendue = null;
  const Layer = L.GridLayer.extend({
    setEtendue(valeur) {
      if (valeur === etendue) return;
      etendue = valeur;
      this.redraw();
    },

    createTile(coords, done) {
      const canvas = L.DomUtil.create('canvas', 'leaflet-tile');
      canvas.width = TUILE;
      canvas.height = TUILE;
      const b = this._tileCoordsToBounds(coords);
      const sw = L.CRS.EPSG3857.project(b.getSouthWest());
      const ne = L.CRS.EPSG3857.project(b.getNorthEast());
      const bbox = [sw.x, sw.y, ne.x, ne.y];
      const teinte = etendue;

      const ombrage = fetchAvecReprises(wmsUrl(LAYER_LIDAR_SHADOW, 'image/png', bbox, TUILE, TUILE))
        .then((res) => res.blob())
        .then(createImageBitmap);
      // Altitudes indisponibles : on garde l'ombrage brut plutôt qu'une tuile vide
      const altitudes = chargerAltitudes(bbox, TUILE, TUILE).catch(() => null);

      Promise.all([ombrage, altitudes])
        .then(([bitmap, grille]) => {
          const ctx = canvas.getContext('2d');
          ctx.drawImage(bitmap, 0, 0);
          if (grille) {
            const image = ctx.getImageData(0, 0, TUILE, TUILE);
            if (teinte) teinterOmbrage(image, grille, teinte);
            masquerBords(image, grille, TUILE, TUILE);
            ctx.putImageData(image, 0, 0);
          }
          done(null, canvas);
        })
        .catch((err) => done(err, canvas));
      return canvas;
    },
  });
  return new Layer({ tileSize: TUILE });
}

/**
 * Carte indice : ombrage LiDAR HD brut, figé pendant la manche (aucun toponyme).
 * Après la réponse, elle devient navigable et compare le LiDAR à la photo aérienne
 * de part et d'autre d'un rideau.
 */
export function createClueMap(elementId) {
  const map = L.map(elementId, {
    zoomControl: false,
    attributionControl: false,
    minZoom: 10,
    maxZoom: 17,
    ...Object.fromEntries(CLUE_HANDLERS.map((h) => [h, false])),
  }).setView(FRANCE_CENTER, CLUE_ZOOM);

  const lidar = createLidarLayer().addTo(map);
  const ortho = L.tileLayer(wmtsUrl(LAYER_ORTHO, 'image/jpeg'), { zIndex: 2 });
  let demandeRelief = 0;

  // Part de la largeur (0 à 1) où la photo aérienne est visible, à gauche du rideau
  let swipe = 0.5;

  function clipOrtho() {
    if (!map.hasLayer(ortho)) return;
    const nw = map.containerPointToLayerPoint([0, 0]);
    const se = map.containerPointToLayerPoint(map.getSize());
    const x = nw.x + map.getSize().x * swipe;
    ortho.getContainer().style.clip = `rect(${nw.y}px, ${x}px, ${se.y}px, ${nw.x}px)`;
  }
  map.on('move zoom', clipOrtho);

  function setInteractive(enabled) {
    for (const h of CLUE_HANDLERS) map[h][enabled ? 'enable' : 'disable']();
  }

  return {
    showTarget(location) {
      map.removeLayer(ortho);
      demandeRelief++;
      lidar.setEtendue(null);
      setInteractive(false);
      // Sans animation : l'emprise est immédiatement à jour pour la vue 3D
      map.setView([location.lat, location.lng], location.zoom ?? CLUE_ZOOM, { animate: false });
    },

    dezoom() {
      map.setZoom(map.getZoom() - DEZOOM_NIVEAUX, { animate: false });
    },

    /** Emprise affichée, en Web Mercator (EPSG:3857), et sa taille en pixels. */
    getExtent() {
      const sw = L.CRS.EPSG3857.project(map.getBounds().getSouthWest());
      const ne = L.CRS.EPSG3857.project(map.getBounds().getNorthEast());
      const { x: width, y: height } = map.getSize();
      return { bbox: [sw.x, sw.y, ne.x, ne.y], width, height };
    },

    revealOrtho() {
      ortho.addTo(map);
      setInteractive(true);
      clipOrtho();
      this.colorerRelief();
    },

    /** Teinte le LiDAR par l'altitude, sur l'échelle de l'emprise affichée (comme la vue 3D). */
    async colorerRelief() {
      const demande = ++demandeRelief;
      const { bbox, width, height } = this.getExtent();
      try {
        const rows = Math.round((POINTS_LARGEUR * height) / width);
        const altitudes = await chargerAltitudes(bbox, POINTS_LARGEUR, rows);
        if (demande !== demandeRelief) return;
        lidar.setEtendue(etendueAltitudes(altitudes));
      } catch (err) {
        console.error(err); // le LiDAR brut reste affiché
      }
    },

    setSwipe(value) {
      swipe = value;
      clipOrtho();
    },
  };
}

/** Carte de devinette : Plan IGN v2, avec repère du joueur et solution. */
export function createGuessMap(elementId, { onPick }) {
  const map = L.map(elementId).setView(FRANCE_CENTER, GUESS_ZOOM);

  L.tileLayer(wmtsUrl(LAYER_PLAN_IGN), {
    maxZoom: 15,
    attribution: '© IGN – Géoplateforme · LiDAR HD',
  }).addTo(map);

  let userMarker = null;
  const solution = L.layerGroup().addTo(map);

  map.on('click', (e) => onPick(e.latlng));

  return {
    placeGuess(latlng) {
      if (userMarker) userMarker.setLatLng(latlng);
      else userMarker = L.marker(latlng, { icon: createPin(ACCENT) }).addTo(map);
    },

    getGuess() {
      return userMarker?.getLatLng() ?? null;
    },

    showSolution(target) {
      const guess = userMarker.getLatLng();
      L.marker(target, { icon: createPin(COULEUR_SOLUTION), interactive: false }).addTo(solution);
      const line = L.polyline([guess, target], { color: ACCENT, dashArray: '5, 5' }).addTo(
        solution,
      );
      map.fitBounds(line.getBounds(), { padding: [60, 60] });
    },

    reset() {
      if (userMarker) map.removeLayer(userMarker);
      userMarker = null;
      solution.clearLayers();
      map.setView(FRANCE_CENTER, GUESS_ZOOM);
    },
  };
}
