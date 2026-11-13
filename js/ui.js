import { TOTAL_MANCHES, CATEGORIES, INDICES } from './config.js';

const $ = (id) => document.getElementById(id);

const el = {
  round: $('round-num'),
  score: $('total-score'),
  progress: $('progress-bar'),
  roundBar: $('round-bar'),
  submitBtn: $('submit-btn'),
  nextBtn: $('next-btn'),
  hints: $('hints'),
  hintReveals: $('hint-reveals'),
  clue3d: $('clue-3d'),
  clue3dStatus: $('clue-3d-status'),
  swipe: $('swipe'),
  swipeLine: $('swipe-line'),
  swipeRange: $('swipe-range'),
  resultBox: $('result-box'),
  resultName: $('result-name'),
  resultCategory: $('result-category'),
  resultHint: $('result-hint'),
  resultPenalty: $('result-penalty'),
  resultDistance: $('result-distance'),
  resultPoints: $('result-points'),
  endDialog: $('end-dialog'),
  endScore: $('end-score'),
  endHistory: $('end-history'),
  replayBtn: $('replay-btn'),
};

function scoreColor(points) {
  if (points >= 800) return 'text-green-800';
  if (points >= 400) return 'text-amber-800';
  return 'text-red-800';
}

const hintButtons = Object.fromEntries(
  Object.entries(INDICES).map(([key, { label, cout }]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className =
      'btn border border-neutral-400 bg-white px-3 py-1.5 text-sm font-medium !text-neutral-900 enabled:hover:bg-neutral-100';
    btn.textContent = `${label} −${Math.round(cout * 100)} %`;
    return [key, btn];
  }),
);
el.hints.append(...Object.values(hintButtons));

export function bindActions({ onSubmit, onNext, onReplay, onHint, onSwipe }) {
  for (const [key, btn] of Object.entries(hintButtons)) {
    btn.addEventListener('click', () => onHint(key));
  }
  el.swipeRange.addEventListener('input', () => {
    el.swipeLine.style.left = `${el.swipeRange.value}%`;
    onSwipe(el.swipeRange.value / 100);
  });
  el.submitBtn.addEventListener('click', onSubmit);
  el.nextBtn.addEventListener('click', onNext);
  el.replayBtn.addEventListener('click', () => el.endDialog.close());
  // Fermer l'écran de fin (bouton ou Échap) relance une partie
  el.endDialog.addEventListener('close', onReplay);
}

export function renderRound(round, score) {
  el.round.textContent = `${round} / ${TOTAL_MANCHES}`;
  el.score.textContent = `${score} pts`;
  el.progress.style.width = `${((round - 1) / TOTAL_MANCHES) * 100}%`;
  el.resultBox.hidden = true;
  el.roundBar.hidden = false;
  el.submitBtn.disabled = true;

  for (const btn of Object.values(hintButtons)) btn.disabled = false;
  el.hints.hidden = false;
  el.hintReveals.replaceChildren();
  el.swipe.hidden = true;
  el.clue3d.hidden = false;
  el.swipeRange.value = 50;
  el.swipeLine.style.left = '50%';
}

/** Message affiché au centre de la vue 3D (chargement, erreur) ; vide pour le masquer. */
export function set3DStatus(text) {
  el.clue3dStatus.textContent = text;
}

/** Marque un indice comme utilisé, et affiche son contenu s'il en a un. */
export function revealHint(key, text) {
  hintButtons[key].disabled = true;
  if (!text) return;
  const li = document.createElement('li');
  li.textContent = `${INDICES[key].label} : ${text}`;
  el.hintReveals.append(li);
}

export function setSubmitEnabled(enabled) {
  el.submitBtn.disabled = !enabled;
}

export function showResult({ location, distance, points, penalty, score, round, isLast }) {
  el.resultName.textContent = location.nom;
  el.resultCategory.textContent = CATEGORIES[location.categorie];
  el.resultHint.textContent = location.hint;
  el.resultPenalty.textContent = penalty ? `(indices −${Math.round(penalty * 100)} %)` : '';
  el.resultDistance.textContent = distance;
  el.resultPoints.textContent = `+${points} pts`;
  el.resultPoints.className = `tabular-nums ${scoreColor(points)}`;
  el.score.textContent = `${score} pts`;
  el.progress.style.width = `${(round / TOTAL_MANCHES) * 100}%`;
  el.nextBtn.textContent = isLast ? 'Voir le résultat' : 'Manche suivante';

  el.roundBar.hidden = true;
  el.clue3d.hidden = true;
  el.swipe.hidden = false;
  el.resultBox.hidden = false;
  el.nextBtn.focus();
}

export function showEndScreen(score, history) {
  el.endScore.textContent = `${score} pts`;
  el.endHistory.replaceChildren(
    ...history.map(({ location, distance, points }, i) => {
      const li = document.createElement('li');
      li.className = 'flex justify-between gap-3 border-b border-neutral-200 py-2';

      const label = document.createElement('span');
      label.className = 'text-neutral-700';
      label.textContent = `${i + 1}. ${location.nom}`;

      const result = document.createElement('span');
      result.className = `shrink-0 tabular-nums ${scoreColor(points)}`;
      result.textContent = `${distance} km · ${points} pts`;

      li.append(label, result);
      return li;
    }),
  );
  el.endDialog.showModal();
}
