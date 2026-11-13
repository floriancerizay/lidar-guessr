export const CATEGORIES = {
  relief: 'Relief naturel',
  ville: 'Ville',
  monument: 'Monument ou site historique',
  ile: 'Île',
};

// zoom (optionnel) : niveau de zoom de la carte indice, CLUE_ZOOM par défaut
// prettier-ignore
const LIEUX_PAR_CATEGORIE = {
  relief: [
    { id: 1, nom: 'Massif du Sancy (Puy-de-Dôme)', lat: 45.528, lng: 2.812, hint: "Cratère volcanique et dômes d'altitude" },
    { id: 2, nom: 'Cirque de Gavarnie (Hautes-Pyrénées)', lat: 42.697, lng: 0.003, hint: 'Cirque glaciaire de haute montagne' },
    { id: 3, nom: 'Cirque de Navacelles (Gard, Hérault)', lat: 43.893, lng: 3.507, hint: "Méandre abandonné au fond d'un canyon calcaire" },
    { id: 4, nom: 'Mont Ventoux (Vaucluse)', lat: 44.173, lng: 5.278, hint: 'Massif calcaire et anticlinal percé' },
    { id: 5, nom: 'Chaîne des Puys (Puy-de-Dôme)', lat: 45.772, lng: 2.964, hint: 'Alignement de cônes volcaniques et de cratères' },
    { id: 6, nom: 'Méandres de la Seine, Barneville-sur-Seine (Eure)', lat: 49.38, lng: 0.85, hint: 'Méandres encaissés dans un plateau calcaire' },
    { id: 7, nom: "Presqu'île de Giens (Var)", lat: 43.045, lng: 6.12, hint: "Presqu'île rocheuse reliée au continent par un double cordon de sable" },
    { id: 8, nom: 'Sologne, Neuvy-sur-Barangeon (Cher)', lat: 47.283, lng: 2.316, hint: 'Vallée fluviale aux terrasses alluviales marquées' },
    { id: 9, nom: "Lac d'Annecy (Haute-Savoie)", lat: 45.85, lng: 6.18, zoom: 12, hint: 'Lac de vallée glaciaire cerné de montagnes' },
    { id: 10, nom: 'Gorges du Verdon (Alpes-de-Haute-Provence, Var)', lat: 43.76, lng: 6.33, hint: 'Canyon profond entaillant des plateaux calcaires' },
    { id: 11, nom: 'Antibes (Alpes-Maritimes)', lat: 43.585, lng: 7.12, hint: 'Côte rocheuse accidentée plongeant dans la mer' },
    { id: 12, nom: 'Vallée de la Dordogne, Floirac (Lot)', lat: 44.9, lng: 1.65, hint: 'Causse calcaire entaillé de gorges profondes' },
    { id: 13, nom: 'Vosges du Nord, Neuwiller-lès-Saverne (Bas-Rhin)', lat: 48.85, lng: 7.35, hint: 'Ligne de crête boisée de moyenne montagne' },
    { id: 14, nom: 'Château de Montségur (Ariège)', lat: 42.8755, lng: 1.8325, zoom: 15, hint: 'Colline fortifiée isolée (butte témoin)' },
    { id: 15, nom: 'Grenoble (Isère)', lat: 45.188, lng: 5.724, hint: 'Cuvette synclinale alpine entourée de massifs' },
    { id: 45, nom: 'Dune du Pilat (Gironde)', lat: 44.589, lng: -1.213, zoom: 14, hint: "Plus grande dune d'Europe entre forêt et océan" },
    { id: 46, nom: "Falaises d'Étretat (Seine-Maritime)", lat: 49.707, lng: 0.206, zoom: 14, hint: "Falaises de craie percées d'arches" },
    { id: 47, nom: 'Montagne Sainte-Victoire (Bouches-du-Rhône)', lat: 43.529, lng: 5.6, zoom: 12, hint: 'Longue crête calcaire dominant un bassin tertiaire' },
    { id: 48, nom: 'Calanques de Cassis (Bouches-du-Rhône)', lat: 43.2155, lng: 5.5, hint: 'Vallées calcaires noyées par la mer' },
    { id: 49, nom: "Pont d'Arc et gorges de l'Ardèche (Ardèche)", lat: 44.384, lng: 4.419, hint: 'Arche naturelle et méandres encaissés dans un plateau calcaire' },
    { id: 50, nom: 'Massif du Mont-Blanc, Chamonix (Haute-Savoie)', lat: 45.924, lng: 6.869, zoom: 12, hint: 'Vallée glaciaire sous les plus hauts sommets des Alpes' },
    { id: 63, nom: 'Pic du Midi de Bigorre (Hautes-Pyrénées)', lat: 42.937, lng: 0.1425, zoom: 14, hint: 'Sommet pyrénéen isolé dominant une vallée glaciaire' },
    { id: 64, nom: 'Gorges du Tarn, Point Sublime (Lozère)', lat: 44.3, lng: 3.2, hint: 'Canyon encaissé entre deux causses' },
    { id: 65, nom: 'Lac de Serre-Ponçon (Hautes-Alpes, Alpes-de-Haute-Provence)', lat: 44.5, lng: 6.35, zoom: 12, hint: 'Grand lac de barrage dans une vallée alpine' },
    { id: 66, nom: 'Pointe du Raz (Finistère)', lat: 48.0375, lng: -4.7325, zoom: 14, hint: "Pointe rocheuse effilée à l'extrémité d'une péninsule" },
    { id: 67, nom: 'Cap Gris-Nez (Pas-de-Calais)', lat: 50.87, lng: 1.585, zoom: 14, hint: 'Cap crayeux face à un détroit' },
    { id: 68, nom: 'Cirque de Baume-les-Messieurs (Jura)', lat: 46.7, lng: 5.63, hint: 'Reculée aux falaises calcaires en fond de vallée' },
    { id: 69, nom: 'Chartreuse, Grand Som (Savoie, Isère)', lat: 45.3, lng: 5.8, zoom: 12, hint: 'Massif préalpin aux plis calcaires et falaises ceinturantes' },
    { id: 87, nom: 'Gorges de la Jonte (Lozère, Aveyron)', lat: 44.2, lng: 3.2, hint: 'Canyon calcaire profond entre deux causses' },
    { id: 88, nom: 'Cirque de Mourèze (Hérault)', lat: 43.6, lng: 3.3, zoom: 14, hint: 'Chaos de rochers dolomitiques en forme de cirque' },
    { id: 89, nom: 'Mont Aigoual (Gard, Lozère)', lat: 44.1215, lng: 3.581, hint: 'Sommet cévenol dominant un réseau de vallées profondes' },
    { id: 90, nom: 'Lac du Bourget (Savoie)', lat: 45.73, lng: 5.87, zoom: 12, hint: 'Grand lac glaciaire au pied de chaînons calcaires' },
    { id: 91, nom: 'Pralognan-la-Vanoise (Savoie)', lat: 45.38, lng: 6.72, zoom: 12, hint: 'Haute vallée alpine bordée de glaciers' },
    { id: 92, nom: 'Puy Mary (Cantal)', lat: 45.1, lng: 2.67, hint: 'Ancien stratovolcan disséqué en vallées rayonnantes' },
    { id: 93, nom: 'Cirque de Troumouse (Hautes-Pyrénées)', lat: 42.72, lng: 0.15, hint: 'Immense cirque glaciaire aux parois rectilignes' },
    { id: 94, nom: 'Pic Saint-Loup (Hérault)', lat: 43.7, lng: 3.8, hint: 'Chaînon calcaire redressé dominant la garrigue' },
    { id: 95, nom: 'Alpilles, Les Baux-de-Provence (Bouches-du-Rhône)', lat: 43.745, lng: 4.795, hint: 'Petit chaînon calcaire blanc entouré de plaine' },
    { id: 96, nom: 'Baie de Somme, Le Crotoy (Somme)', lat: 50.23, lng: 1.62, hint: 'Large estuaire à marée avec cordons de dunes' },
  ],
  ville: [
    { id: 16, nom: 'Lyon (Rhône)', lat: 45.757, lng: 4.825, hint: "Confluence de deux grands cours d'eau au pied d'une colline" },
    { id: 17, nom: 'Besançon (Doubs)', lat: 47.237, lng: 6.024, hint: 'Ville lovée dans un méandre presque fermé, verrouillé par une citadelle' },
    { id: 18, nom: 'Le Puy-en-Velay (Haute-Loire)', lat: 45.045, lng: 3.885, zoom: 14, hint: 'Ville hérissée de pitons et de dykes volcaniques' },
    { id: 19, nom: 'Avignon (Vaucluse)', lat: 43.951, lng: 4.806, zoom: 14, hint: 'Rocher calcaire dominant un grand fleuve et ses îles' },
    { id: 20, nom: 'Langres (Haute-Marne)', lat: 47.862, lng: 5.333, zoom: 14, hint: 'Ville fortifiée sur un éperon de plateau' },
    { id: 21, nom: 'Sète (Hérault)', lat: 43.398, lng: 3.69, hint: 'Mont isolé entre étang et mer, relié par un cordon littoral' },
    { id: 22, nom: 'Briançon (Hautes-Alpes)', lat: 44.897, lng: 6.643, zoom: 14, hint: 'Ville forte au carrefour de vallées alpines' },
    { id: 23, nom: 'Bonifacio (Corse-du-Sud)', lat: 41.388, lng: 9.16, zoom: 14, hint: 'Ville sur falaises calcaires et port dans un goulet' },
    { id: 51, nom: 'Cahors (Lot)', lat: 44.4475, lng: 1.441, hint: 'Ville enserrée dans un méandre presque fermé' },
    { id: 52, nom: 'Saint-Malo (Ille-et-Vilaine)', lat: 48.649, lng: -2.026, zoom: 14, hint: 'Cité fortifiée sur un rocher relié par un cordon sableux' },
    { id: 53, nom: 'Millau (Aveyron)', lat: 44.0995, lng: 3.078, hint: 'Ville de confluence au pied de grands causses' },
    { id: 70, nom: 'Cordes-sur-Ciel (Tarn)', lat: 44.0625, lng: 1.9525, zoom: 14, hint: "Bastide perchée sur un piton au-dessus d'une rivière" },
    { id: 71, nom: 'Saint-Flour (Cantal)', lat: 45.034, lng: 3.09, zoom: 14, hint: 'Ville haute sur une planèze basaltique dominant la vallée' },
    { id: 72, nom: 'Sisteron (Alpes-de-Haute-Provence)', lat: 44.195, lng: 5.943, zoom: 14, hint: 'Cluse étroite fermée par une citadelle et un rocher' },
    { id: 73, nom: 'Biarritz (Pyrénées-Atlantiques)', lat: 43.4832, lng: -1.5586, zoom: 14, hint: "Côte rocheuse découpée en bord d'océan" },
    { id: 74, nom: "Dinan (Côtes-d'Armor)", lat: 48.455, lng: -2.05, zoom: 14, hint: 'Ville sur un plateau dominant une vallée profonde et son port' },
    { id: 98, nom: 'Rodez (Aveyron)', lat: 44.35, lng: 2.575, zoom: 14, hint: 'Ville sur une butte entourée de méandres' },
    { id: 99, nom: 'Mende (Lozère)', lat: 44.52, lng: 3.5, zoom: 14, hint: "Ville au fond d'une vallée encaissée entre causses" },
    { id: 100, nom: 'Annecy (Haute-Savoie)', lat: 45.9, lng: 6.12, hint: "Ville à l'extrémité d'un lac glaciaire, traversée de canaux" },
    { id: 101, nom: 'Menton (Alpes-Maritimes)', lat: 43.775, lng: 7.5, zoom: 14, hint: 'Ville littorale adossée à des versants très raides' },
    { id: 102, nom: 'Chambéry (Savoie)', lat: 45.57, lng: 5.92, hint: 'Ville dans une cluse entre massifs préalpins' },
    { id: 103, nom: 'Saint-Émilion (Gironde)', lat: 44.894, lng: -0.155, zoom: 14, hint: 'Bourg perché sur un coteau calcaire dominant une vallée' },
    { id: 104, nom: 'Albi (Tarn)', lat: 43.929, lng: 2.145, zoom: 14, hint: 'Ville dominant une rivière encaissée dans un méandre' },
    { id: 105, nom: 'Moustiers-Sainte-Marie (Alpes-de-Haute-Provence)', lat: 43.845, lng: 6.22, zoom: 14, hint: 'Village niché dans une faille entre deux falaises' },
    { id: 106, nom: 'Morlaix (Finistère)', lat: 48.58, lng: -3.83, zoom: 14, hint: "Ville au fond d'une ria enjambée par un viaduc" },
  ],
  monument: [
    { id: 24, nom: 'Neuf-Brisach (Haut-Rhin)', lat: 48.018, lng: 7.528, zoom: 15, hint: 'Place forte octogonale aux bastions en étoile' },
    { id: 25, nom: 'Fort de Douaumont (Meuse)', lat: 49.217, lng: 5.438, zoom: 15, hint: "Fort polygonal au milieu d'un champ de bataille labouré d'obus" },
    { id: 26, nom: 'Pointe du Hoc (Calvados)', lat: 49.396, lng: -0.989, zoom: 15, hint: 'Promontoire de falaise criblé de cratères de bombes' },
    { id: 27, nom: 'Cité de Carcassonne (Aude)', lat: 43.2065, lng: 2.3637, zoom: 15, hint: 'Cité médiévale à double enceinte sur une colline' },
    { id: 28, nom: 'Château-Gaillard, Les Andelys (Eure)', lat: 49.238, lng: 1.403, zoom: 15, hint: 'Forteresse sur un éperon de craie dominant un méandre' },
    { id: 29, nom: 'Mont-Louis (Pyrénées-Orientales)', lat: 42.51, lng: 2.12, zoom: 15, hint: 'Citadelle de montagne bâtie sur un col' },
    { id: 30, nom: 'Citadelle de Blaye (Gironde)', lat: 45.128, lng: -0.662, zoom: 15, hint: "Citadelle bastionnée en bord d'estuaire" },
    { id: 31, nom: "Citadelle du Château-d'Oléron (Charente-Maritime)", lat: 45.893, lng: -1.198, zoom: 15, hint: 'Citadelle bastionnée face à des marais ostréicoles' },
    { id: 32, nom: 'Rocamadour (Lot)', lat: 44.799, lng: 1.618, zoom: 14, hint: "Cité religieuse accrochée à la falaise d'un canyon" },
    { id: 55, nom: 'Pont du Gard (Gard)', lat: 43.9475, lng: 4.535, zoom: 15, hint: 'Aqueduc antique franchissant une gorge' },
    { id: 56, nom: 'Château de Peyrepertuse (Aude)', lat: 42.8696, lng: 2.6256, zoom: 15, hint: 'Forteresse étirée sur une crête calcaire' },
    { id: 57, nom: 'Mont-Dauphin (Hautes-Alpes)', lat: 44.667, lng: 6.6221, zoom: 15, hint: 'Place forte bastionnée sur un éperon de confluence' },
    { id: 75, nom: 'Château de Chambord (Loir-et-Cher)', lat: 47.616, lng: 1.517, zoom: 15, hint: "Grand domaine entouré d'un mur et d'une forêt" },
    { id: 76, nom: "Château d'Angers (Maine-et-Loire)", lat: 47.4697, lng: -0.5622, zoom: 15, hint: "Forteresse à tours rondes au-dessus d'une rivière" },
    { id: 77, nom: 'Brouage (Charente-Maritime)', lat: 45.8997, lng: -1.0594, zoom: 15, hint: "Place forte à bastions au milieu d'anciens marais salants" },
    { id: 79, nom: 'Château de Foix (Ariège)', lat: 42.9645, lng: 1.6055, zoom: 15, hint: 'Château à trois tours sur un rocher dominant une ville' },
    { id: 80, nom: 'Fort de Joux (Doubs)', lat: 46.8, lng: 6.37, zoom: 15, hint: 'Fort étagé sur un éperon barrant une cluse' },
    { id: 109, nom: 'Citadelle de Montmédy (Meuse)', lat: 49.52, lng: 5.14, zoom: 15, hint: "Ville haute bastionnée sur une butte au-dessus d'une plaine" },
    { id: 110, nom: 'Château de Beynac (Dordogne)', lat: 44.8405, lng: 1.1425, zoom: 15, hint: "Château accroché à une falaise au-dessus d'une rivière" },
    { id: 111, nom: 'Fort de Salses (Pyrénées-Orientales)', lat: 42.8337, lng: 2.9197, zoom: 15, hint: 'Forteresse rectangulaire basse en bordure de plaine' },
    { id: 112, nom: 'Citadelle de Verdun (Meuse)', lat: 49.158, lng: 5.385, zoom: 15, hint: 'Citadelle bastionnée dominant une ville de vallée' },
    { id: 113, nom: 'Château de Chinon (Indre-et-Loire)', lat: 47.1667, lng: 0.2447, zoom: 15, hint: "Forteresse étirée sur un éperon au-dessus d'une rivière" },
    { id: 114, nom: 'Haut-Koenigsbourg (Bas-Rhin)', lat: 48.2495, lng: 7.3445, zoom: 15, hint: 'Château sur un éperon granitique dominant une plaine' },
    { id: 115, nom: 'Citadelle de Bitche (Moselle)', lat: 49.0545, lng: 7.4285, zoom: 15, hint: 'Citadelle taillée dans un rocher gréseux' },
  ],
  ile: [
    { id: 33, nom: 'Saint-Martin-de-Ré (Charente-Maritime)', lat: 46.203, lng: -1.366, zoom: 15, hint: 'Port fortifié en étoile sur une île plate' },
    { id: 34, nom: 'Porquerolles (Var)', lat: 43, lng: 6.205, hint: 'Île méditerranéenne allongée aux falaises méridionales' },
    { id: 35, nom: "Île d'Yeu (Vendée)", lat: 46.71, lng: -2.33, zoom: 12, hint: "Île atlantique isolée au large d'une côte basse" },
    { id: 36, nom: 'Ouessant (Finistère)', lat: 48.458, lng: -5.09, zoom: 12, hint: "Île de l'extrême ouest aux côtes déchiquetées" },
    { id: 37, nom: 'Île de Groix (Morbihan)', lat: 47.638, lng: -3.465, zoom: 12, hint: "Île de schistes face à l'entrée d'une rade" },
    { id: 38, nom: "Île de Bréhat (Côtes-d'Armor)", lat: 48.845, lng: -3, zoom: 14, hint: 'Archipel granitique sur un vaste estran' },
    { id: 39, nom: 'Îles de Lérins (Alpes-Maritimes)', lat: 43.515, lng: 7.05, zoom: 14, hint: 'Deux îles plates face à une côte urbanisée' },
    { id: 40, nom: "Île d'Aix (Charente-Maritime)", lat: 46.012, lng: -1.173, zoom: 14, hint: 'Petite île fortifiée en forme de croissant' },
    { id: 41, nom: 'Îles Lavezzi (Corse-du-Sud)', lat: 41.336, lng: 9.252, zoom: 14, hint: 'Archipel de blocs granitiques entre deux grandes îles' },
    { id: 42, nom: 'Port-Cros (Var)', lat: 43.005, lng: 6.39, hint: 'Île montagneuse aux vallons profonds' },
    { id: 43, nom: 'Archipel du Frioul (Bouches-du-Rhône)', lat: 43.278, lng: 5.305, hint: "Archipel calcaire à l'entrée d'un grand port" },
    { id: 44, nom: 'Île de Batz (Finistère)', lat: 48.745, lng: -4.02, zoom: 14, hint: 'Île basse et rocheuse face à un port breton' },
    { id: 59, nom: 'Île de Sein (Finistère)', lat: 48.0375, lng: -4.8503, zoom: 14, hint: 'Île très basse et étroite en bout de chaussée rocheuse' },
    { id: 81, nom: 'Île de Noirmoutier (Vendée)', lat: 46.99, lng: -2.25, zoom: 12, hint: 'Île basse et allongée reliée à la côte par un passage submersible' },
    { id: 82, nom: 'Île de Bendor (Var)', lat: 43.135, lng: 5.7585, zoom: 15, hint: 'Minuscule île face à un port de plaisance' },
    { id: 83, nom: 'Île du Levant (Var)', lat: 43.03, lng: 6.46, hint: 'Île étroite et rocheuse, voisine de deux autres' },
    { id: 85, nom: 'Île de Molène (Finistère)', lat: 48.39, lng: -4.96, zoom: 14, hint: 'Petite île basse entre un archipel et la haute mer' },
    { id: 117, nom: 'Île de Tatihou (Manche)', lat: 49.5, lng: -1.255, zoom: 14, hint: 'Petit îlot fortifié accessible à marée basse' },
    { id: 118, nom: 'Îles Sanguinaires (Corse-du-Sud)', lat: 41.87, lng: 8.595, zoom: 14, hint: "Archipel rocheux à l'entrée d'un golfe" },
    { id: 119, nom: 'Île Madame (Charente-Maritime)', lat: 45.9, lng: -1.0, zoom: 14, hint: 'Îlot relié à la côte par une chaussée de galets' },
    { id: 120, nom: 'Île Verte (Bouches-du-Rhône)', lat: 43.17, lng: 5.6, zoom: 14, hint: 'Petite île rocheuse face à un port industriel' },
    { id: 121, nom: 'Île Maire (Bouches-du-Rhône)', lat: 43.21, lng: 5.35, zoom: 14, hint: 'Îlot calcaire en bord de falaise face à une grande ville' },
    { id: 122, nom: 'Île de Cézembre (Ille-et-Vilaine)', lat: 48.68, lng: -2.3, zoom: 14, hint: 'Îlot rocheux en baie, face à une cité fortifiée' },
  ],
};

export const LIEUX_MYSTERES = Object.entries(LIEUX_PAR_CATEGORIE).flatMap(([categorie, lieux]) =>
  lieux.map((lieu) => ({ ...lieu, categorie })),
);

export const TOTAL_MANCHES = 5;

// Cartes
export const FRANCE_CENTER = [46.6033, 1.8883];
export const GUESS_ZOOM = 5;
export const CLUE_ZOOM = 13;

// Flux WMTS de la Géoplateforme IGN
export const WMTS_BASE_URL = 'https://data.geopf.fr/wmts';
export const LAYER_LIDAR_SHADOW = 'IGNF_LIDAR-HD_MNT_ELEVATION.ELEVATIONGRIDCOVERAGE.SHADOW';
export const LAYER_PLAN_IGN = 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2';
export const LAYER_ORTHO = 'ORTHOIMAGERY.ORTHOPHOTOS';

// Service WMS raster de la Géoplateforme, pour la vue 3D (altitudes brutes + texture)
export const WMS_R_URL = 'https://data.geopf.fr/wms-r';
export const LAYER_LIDAR_MNT = 'IGNF_LIDAR-HD_MNT_ELEVATION.ELEVATIONGRIDCOVERAGE.WGS84G';
// Exagération verticale adaptée à chaque emprise : on vise un relief haut de
// hauteurCible × la largeur de la scène, dans les limites min et max
export const EXAGERATION_3D = { min: 1.5, max: 10, hauteurCible: 0.12 };

// Score : SCORE_MAX × e^(−distance / SCORE_ECHELLE_KM)
// soit 1000 pts sur place, ~500 à 100 km, ~70 à 400 km
export const SCORE_MAX = 1000;
export const SCORE_ECHELLE_KM = 150;

// Indices disponibles pendant une manche, et part des points qu'ils retirent
export const INDICES = {
  dezoom: { label: 'Dézoomer', cout: 0.2 },
  categorie: { label: 'Catégorie', cout: 0.1 },
  hint: { label: 'Indice', cout: 0.25 },
};
export const DEZOOM_NIVEAUX = 2;
