import { LIEUX_MYSTERES, TOTAL_MANCHES, SCORE_MAX, SCORE_ECHELLE_KM, INDICES } from './config.js';
import { distanceKm } from './geo.js';

/** État d'une partie, indépendant de l'affichage. */
export class Game {
  constructor() {
    this.reset();
  }

  reset() {
    this.currentRound = 0;
    this.score = 0;
    this.targetLocation = null;
    this.hasGuessed = false;
    this.hintsUsed = new Set();
    this.history = [];
    this.unusedLocations = [...LIEUX_MYSTERES];
  }

  get isOver() {
    return this.currentRound >= TOTAL_MANCHES || this.unusedLocations.length === 0;
  }

  /** Part des points retirée par les indices utilisés dans la manche (0 à 1). */
  get penalty() {
    let total = 0;
    for (const key of this.hintsUsed) total += INDICES[key].cout;
    return Math.min(total, 1);
  }

  nextRound() {
    if (this.isOver) return false;

    const randomIndex = Math.floor(Math.random() * this.unusedLocations.length);
    this.targetLocation = this.unusedLocations.splice(randomIndex, 1)[0];
    this.hasGuessed = false;
    this.hintsUsed = new Set();
    this.currentRound++;
    return true;
  }

  /** Utilise un indice ; renvoie false s'il est déjà utilisé ou si la manche est jouée. */
  useHint(key) {
    if (this.hasGuessed || this.hintsUsed.has(key)) return false;
    this.hintsUsed.add(key);
    return true;
  }

  /** Enregistre la proposition du joueur et renvoie { distance, points, penalty }. */
  guess(position) {
    const distance = distanceKm(position, this.targetLocation);
    const base = SCORE_MAX * Math.exp(-distance / SCORE_ECHELLE_KM);
    const penalty = this.penalty;
    const points = Math.round(base * (1 - penalty));

    this.hasGuessed = true;
    this.score += points;
    this.history.push({ location: this.targetLocation, distance, points, penalty });
    return { distance, points, penalty };
  }
}
