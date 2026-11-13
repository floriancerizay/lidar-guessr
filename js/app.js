import { CATEGORIES } from './config.js';
import { Game } from './game.js';
import { createClueMap, createGuessMap } from './map.js';
import { createRelief3D } from './relief3d.js';
import * as ui from './ui.js';

const game = new Game();
const clueMap = createClueMap('clue-map');
const relief3d = createRelief3D('clue-3d');

const guessMap = createGuessMap('guess-map', {
  onPick(latlng) {
    if (game.hasGuessed) return;
    guessMap.placeGuess(latlng);
    ui.setSubmitEnabled(true);
  },
});

async function afficherRelief3D() {
  ui.set3DStatus('Chargement du relief…');
  try {
    await relief3d.show(clueMap.getExtent());
    ui.set3DStatus('');
  } catch (err) {
    console.error(err);
    ui.set3DStatus('Relief 3D indisponible');
  }
}

function validerPosition() {
  const position = guessMap.getGuess();
  if (!position || game.hasGuessed) return;

  const { distance, points, penalty } = game.guess(position);
  guessMap.showSolution(game.targetLocation);
  relief3d.setActive(false);
  clueMap.revealOrtho();
  ui.showResult({
    location: game.targetLocation,
    distance,
    points,
    penalty,
    score: game.score,
    round: game.currentRound,
    isLast: game.isOver,
  });
}

function utiliserIndice(key) {
  if (!game.useHint(key)) return;

  const lieu = game.targetLocation;
  if (key === 'dezoom') {
    clueMap.dezoom();
    afficherRelief3D();
  }
  ui.revealHint(key, { categorie: CATEGORIES[lieu.categorie], hint: lieu.hint }[key]);
}

function lancerNouvelleManche() {
  if (!game.nextRound()) {
    ui.showEndScreen(game.score, game.history);
    return;
  }

  guessMap.reset();
  clueMap.showTarget(game.targetLocation);
  ui.renderRound(game.currentRound, game.score);
  relief3d.setActive(true);
  afficherRelief3D();
}

function rejouer() {
  game.reset();
  lancerNouvelleManche();
}

ui.bindActions({
  onSubmit: validerPosition,
  onNext: lancerNouvelleManche,
  onReplay: rejouer,
  onHint: utiliserIndice,
  onSwipe: clueMap.setSwipe,
});
lancerNouvelleManche();
