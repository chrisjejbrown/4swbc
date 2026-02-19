export default function decorate(block) {
  const rows = [...block.children];

  // First row: tab labels (comma separated)
  const tabRow = rows[0];
  if (tabRow) {
    const tabText = tabRow.textContent.trim();
    const tabLabels = tabText.split(',').map((t) => t.trim());
    const tabsDiv = document.createElement('div');
    tabsDiv.className = 'hero-banner-tabs';
    tabLabels.forEach((label, i) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      if (i === 0) btn.classList.add('active');
      btn.addEventListener('click', () => {
        tabsDiv.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
      tabsDiv.append(btn);
    });
    tabRow.replaceWith(tabsDiv);
  }

  // Last row with multiple pictures = image strip
  const lastRow = rows[rows.length - 1];
  const pictures = lastRow ? lastRow.querySelectorAll('picture') : [];
  if (pictures.length > 1) {
    const imagesDiv = document.createElement('div');
    imagesDiv.className = 'hero-banner-images';
    pictures.forEach((pic) => imagesDiv.append(pic));
    lastRow.replaceWith(imagesDiv);
  }

  // Mark subtitle paragraph
  block.querySelectorAll('p').forEach((p) => {
    if (!p.querySelector('a.button') && !p.closest('.hero-banner-tabs') && !p.closest('.hero-banner-images')) {
      const text = p.textContent.trim();
      if (text.length < 60 && text.length > 0 && !p.querySelector('picture')) {
        p.classList.add('hero-subtitle');
      }
    }
  });
}
