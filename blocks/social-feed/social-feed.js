import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  if (rows[0]) rows[0].className = 'social-feed-header';

  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'social-feed-cards';

  rows.slice(1).forEach((row) => {
    const card = document.createElement('div');
    card.className = 'social-feed-card';
    moveInstrumentation(row, card);
    while (row.firstElementChild) card.append(row.firstElementChild);
    cardsContainer.append(card);
    row.remove();
  });

  block.append(cardsContainer);
}
