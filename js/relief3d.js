import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LAYER_LIDAR_SHADOW, EXAGERATION_3D } from './config.js';
import {
  ALTITUDE_ABSENTE,
  POINTS_LARGEUR,
  chargerAltitudes,
  etendueAltitudes,
  fetchAvecReprises,
  masquerBords,
  wmsUrl,
} from './couleurs-relief.js';

const TEXTURE_LARGEUR = 1024;
const INCLINAISON_DEPART = 40; // degrés depuis la verticale
const INCLINAISON_MAX = 75;
const RAYON_TERRE = 6378137;

async function chargerOmbrage(bbox, width, height) {
  const res = await fetchAvecReprises(wmsUrl(LAYER_LIDAR_SHADOW, 'image/png', bbox, width, height));
  return createImageBitmap(await res.blob());
}

/** Texture d'ombrage dont les bords de couverture LiDAR (artefacts) sont rendus transparents. */
function creerTexture(ombrage, altitudes, cols, rows) {
  const canvas = document.createElement('canvas');
  canvas.width = ombrage.width;
  canvas.height = ombrage.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(ombrage, 0, 0);
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  masquerBords(image, altitudes, cols, rows);
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

/**
 * Vue 3D de l'emprise de la carte indice : MNT LiDAR HD drapé de son ombrage.
 * Seule la rotation est permise (ni déplacement, ni zoom).
 */
export function createRelief3D(elementId) {
  const container = document.getElementById(elementId);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  container.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb5b5b5); // même teinte que la carte 2D

  const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.maxPolarAngle = THREE.MathUtils.degToRad(INCLINAISON_MAX);

  let mesh = null;
  let derniereDemande = 0;
  let empriseAffichee = '';

  function redimensionner() {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(redimensionner).observe(container);

  function construire(altitudes, texture, bbox, cols, rows) {
    const [minX, minY, maxX, maxY] = bbox;
    const largeur = maxX - minX;
    const profondeur = (maxY - minY) / largeur;

    const { min, max } = etendueAltitudes(altitudes);

    // Le Web Mercator étire les distances de 1 / cos(lat) : on ramène la largeur au sol
    // pour que l'échelle verticale reste juste, puis on exagère selon le dénivelé
    const lat = Math.atan(Math.sinh((minY + maxY) / 2 / RAYON_TERRE));
    const largeurSol = largeur * Math.cos(lat);
    const { min: exaMin, max: exaMax, hauteurCible } = EXAGERATION_3D;
    const denivele = (max - min) / largeurSol;
    const exageration = THREE.MathUtils.clamp(hauteurCible / denivele || exaMax, exaMin, exaMax);
    const echelle = exageration / largeurSol;

    const geometry = new THREE.PlaneGeometry(1, profondeur, cols - 1, rows - 1);
    geometry.rotateX(-Math.PI / 2);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      // Valeurs aberrantes ou absence de données (mer) : ramenées au point le plus bas
      const z = altitudes[i] > ALTITUDE_ABSENTE ? altitudes[i] : min;
      positions.setY(i, (z - min) * echelle);
    }
    geometry.computeBoundingBox();

    // Couleur selon l'altitude : vert en bas, rouge en haut, teintant l'ombrage
    const couleurs = new Float32Array(positions.count * 3);
    const couleur = new THREE.Color();
    const etendue = max - min || 1;
    for (let i = 0; i < positions.count; i++) {
      const z = altitudes[i] > ALTITUDE_ABSENTE ? altitudes[i] : min;
      couleur.setHSL(THREE.MathUtils.lerp(0.33, 0, (z - min) / etendue), 0.85, 0.62);
      couleur.toArray(couleurs, i * 3);
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(couleurs, 3));

    if (mesh) {
      scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.map.dispose();
      mesh.material.dispose();
    }
    mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ map: texture, vertexColors: true, transparent: true }),
    );
    scene.add(mesh);

    // Caméra centrée sur le relief, à une distance qui cadre toute l'emprise
    const hauteurMoyenne = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
    controls.target.set(0, hauteurMoyenne, 0);
    const demiAngle = THREE.MathUtils.degToRad(camera.fov / 2);
    const distance = (Math.max(profondeur, 1 / camera.aspect) / 2 / Math.tan(demiAngle)) * 1.15;
    camera.position
      .setFromSphericalCoords(distance, THREE.MathUtils.degToRad(INCLINAISON_DEPART), 0)
      .add(controls.target);
    controls.update();
  }

  return {
    /** Charge le relief de l'emprise ; ignore le résultat si une autre demande a suivi. */
    async show({ bbox, width, height }) {
      const cle = bbox.join(',');
      if (cle === empriseAffichee) return;
      const demande = ++derniereDemande;
      if (mesh) mesh.visible = false; // pas d'ancien relief pendant le chargement
      const cols = POINTS_LARGEUR;
      const rows = Math.round((POINTS_LARGEUR * height) / width);
      const [altitudes, ombrage] = await Promise.all([
        chargerAltitudes(bbox, cols, rows),
        chargerOmbrage(bbox, TEXTURE_LARGEUR, Math.round((TEXTURE_LARGEUR * height) / width)),
      ]);
      if (demande !== derniereDemande) {
        ombrage.close();
        return;
      }
      redimensionner();
      const texture = creerTexture(ombrage, altitudes, cols, rows);
      ombrage.close();
      construire(altitudes, texture, bbox, cols, rows);
      empriseAffichee = cle;
    },

    /** Lance ou arrête le rendu (inutile quand la vue est masquée). */
    setActive(active) {
      if (active) redimensionner();
      renderer.setAnimationLoop(
        active
          ? () => {
              controls.update();
              renderer.render(scene, camera);
            }
          : null,
      );
    },
  };
}
