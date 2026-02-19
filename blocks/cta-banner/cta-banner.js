export default function decorate(block) {
  const rows = [...block.children];

  const contentCol = document.createElement('div');
  contentCol.className = 'cta-banner-content';

  const formCol = document.createElement('div');
  formCol.className = 'cta-banner-form';

  if (rows[0]) {
    contentCol.append(...rows[0].children[0].childNodes);
    rows[0].remove();
  }

  if (rows[1]) {
    const labelText = rows[1].textContent.trim();
    const form = document.createElement('div');
    form.className = 'cta-banner-email';
    form.innerHTML = `
      <label for="cta-email">${labelText}</label>
      <input type="email" id="cta-email" placeholder="Enter your email address">
      <button type="button">Subscribe</button>
    `;
    formCol.append(form);
    rows[1].remove();
  }

  block.textContent = '';
  block.append(contentCol, formCol);
}
