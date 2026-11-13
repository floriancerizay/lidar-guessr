# LiDAR Guessr

Une zone de France est affichée uniquement par l'**ombrage du Modèle
Numérique de Terrain LiDAR HD** de l'IGN, sans aucun toponyme. Le joueur place un repère sur le
Plan IGN pour deviner où elle se trouve.

- 5 manches par partie, tirées au hasard parmi plus de 70 lieux : reliefs, villes, monuments et îles
- Score par manche : `1000 × e^(−distance / 150 km)`, soit ~500 pts à 100 km et ~70 pts à 400 km
- Indices payants pendant la manche : dézoomer (−20 %), catégorie (−10 %), indice morphologique (−25 %)
- L'indice est une vue 3D du MNT LiDAR HD : on fait pivoter le relief, sans déplacement ni zoom.
  L'exagération verticale s'adapte au dénivelé de la zone (×1,5 à ×10)
- Après la réponse : nom du lieu, et comparaison LiDAR / photo aérienne avec un rideau

## Développement

Modules ES sans bundler ; Leaflet et Three.js viennent d'un CDN, Tailwind est compilé en CSS (`css/style.css`, non versionné). Les modules
ES ne se chargent pas en `file://`, il faut donc un serveur local :

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Commande               | Rôle                                       |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Compile le CSS puis sert le site en local  |
| `npm run build`        | Génère le site statique dans `dist/`       |
| `npm run format`       | Formate le code (Prettier)                 |
| `npm run format:check` | Vérifie le formatage                       |
| `npm run lint`         | Analyse le JavaScript (ESLint)             |
| `npm run check-lieux`  | Vérifie la couverture LiDAR de chaque lieu |

## Ajouter un lieu

Ajouter une entrée dans la bonne catégorie de `LIEUX_PAR_CATEGORIE` (`js/config.js`) :

```js
{ id: 123, nom: 'Mer de Glace (Haute-Savoie)', lat: 45.92, lng: 6.93, zoom: 13, hint: 'Description morphologique du relief' },
```

- `nom` est affiché après la réponse ; `hint` décrit le relief sans nommer le lieu.

`zoom` est facultatif (13 par défaut) : 12 pour une île entière, 15 pour un fort ou une citadelle.

Le MNT LiDAR HD est un modèle de terrain nu, sans bâtiments : choisir un lieu dont la forme du
terrain est lisible (méandre, fossés, remparts en terre, cratères, trait de côte). Certaines régions
(Nord, Bourgogne, côte girondine, Bretagne intérieure…) n'ont pas encore de données publiées et la
carte indice reste alors vide : lancer `npm run check-lieux -- 123` pour vérifier un nouveau lieu.

## Sources de données

Flux WMTS de la [Géoplateforme IGN](https://geoservices.ign.fr/) :

- `IGNF_LIDAR-HD_MNT_ELEVATION.ELEVATIONGRIDCOVERAGE.SHADOW` : ombrage du MNT LiDAR HD
- `GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2` : Plan IGN v2
- `ORTHOIMAGERY.ORTHOPHOTOS` : photographies aériennes

Service WMS raster (`https://data.geopf.fr/wms-r`), pour la vue 3D :

- `IGNF_LIDAR-HD_MNT_ELEVATION.ELEVATIONGRIDCOVERAGE.WGS84G` : altitudes du MNT LiDAR HD (format BIL 32 bits)
- `IGNF_LIDAR-HD_MNT_ELEVATION.ELEVATIONGRIDCOVERAGE.SHADOW` : ombrage, plaqué en texture

## Déploiement

Le workflow `.github/workflows/pages.yml` vérifie le formatage, lance le lint, construit `dist/` et le publie sur GitHub Pages à chaque push sur `main`. Activer au préalable _Settings → Pages → Source : GitHub Actions_.

## Licence

MIT (voir `LICENSE`).
