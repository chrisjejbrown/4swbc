export default function decorate(block) {
  const textDiv = block.querySelector(':scope > div:last-child');
  if (!textDiv) return;

  // First paragraph with multiple links separated by | = pill nav
  const firstP = textDiv.querySelector('p');
  if (firstP && firstP.querySelectorAll('a').length > 1 && firstP.textContent.includes('|')) {
    const nav = document.createElement('div');
    nav.className = 'hero-banner-pills';
    firstP.querySelectorAll('a').forEach((a, i) => {
      const btn = document.createElement('a');
      btn.href = a.href;
      btn.textContent = a.textContent.trim();
      btn.className = 'hero-pill';
      if (i === 0) btn.classList.add('active');
      nav.append(btn);
    });
    firstP.replaceWith(nav);
  }

  // Mark subtitle paragraph
  block.querySelectorAll('p').forEach((p) => {
    if (!p.querySelector('a.button') && !p.closest('.hero-banner-pills')) {
      const text = p.textContent.trim();
      if (text.length < 60 && text.length > 0 && !p.querySelector('picture')) {
        p.classList.add('hero-subtitle');
      }
    }
  });
}
