/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-icon. Base: cards. Source: https://www.swbc.com
 * Model fields per card: image (reference), text (richtext)
 * Selector: div.careers-wrap
 * Extracts career category cards with icon font references and labels
 */
export default function parse(element, { document }) {
  // Find all career category list items
  const listItems = element.querySelectorAll('.lined-grid ul li');

  const cells = [];

  listItems.forEach((li) => {
    const link = li.querySelector('a');
    if (!link) return;

    // Extract icon class name for the icon reference
    const iconEl = link.querySelector('em[class*="icon-"]');
    const iconClass = iconEl ? iconEl.className.trim() : '';

    // Extract career category label (text after the icon)
    const labelText = link.textContent.trim();

    // Build image cell with field hint
    // Use a placeholder image representing the icon
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    if (iconEl) {
      // Preserve the icon element as-is for reference
      const iconImg = document.createElement('img');
      iconImg.src = '';
      iconImg.alt = iconClass.replace('icon-si_', '').replace(/-/g, ' ');
      imageFrag.appendChild(iconImg);
    }

    // Build text cell with field hint (label + link)
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    const heading = document.createElement('h3');
    heading.textContent = labelText;
    textFrag.appendChild(heading);

    const ctaLink = document.createElement('a');
    ctaLink.href = link.href;
    ctaLink.textContent = labelText;
    textFrag.appendChild(ctaLink);

    // Each card = 1 row with [image, text]
    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icon', cells });
  element.replaceWith(block);
}
