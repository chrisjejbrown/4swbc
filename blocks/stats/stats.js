export default function decorate(block) {
  const rows = [...block.children];
  const introRow = rows[0];
  if (introRow) introRow.className = 'stats-intro';

  const statsGrid = document.createElement('div');
  statsGrid.className = 'stats-grid';

  rows.slice(1).forEach((row, idx) => {
    const statItem = document.createElement('div');
    statItem.className = 'stats-item';
    if (idx === 0) statItem.classList.add('stats-item-accent');

    const cols = [...row.children];
    if (cols[0]) {
      const value = document.createElement('div');
      value.className = 'stats-value';
      value.textContent = cols[0].textContent.trim();
      statItem.append(value);
    }
    if (cols[1]) {
      const label = document.createElement('div');
      label.className = 'stats-label';
      label.textContent = cols[1].textContent.trim();
      statItem.append(label);
    }
    statsGrid.append(statItem);
    row.remove();
  });

  block.append(statsGrid);
}
