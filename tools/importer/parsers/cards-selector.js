/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-selector. Base: cards. Source: https://www.swbc.com
 * Model fields per card: image (reference), text (richtext)
 * Selector: #oscar
 * Extracts category selector cards (Business, Financial Institution, etc.)
 */
export default function parse(element, { document }) {
  // Find all display cards within the oscar component
  const cardElements = element.querySelectorAll('.displayCard');

  const cells = [];

  cardElements.forEach((card) => {
    // Extract card image (placeholder tile image)
    const img = card.querySelector('img.placeholder, img');

    // Extract card title text
    const cardTitle = card.querySelector('.cardTitle');

    // Extract CTA link
    const ctaLink = card.querySelector('.cardClick a.btn');

    // Build image cell with field hint
    const imageFrag = document.createDocumentFragment();
    if (img) {
      imageFrag.appendChild(document.createComment(' field:image '));
      imageFrag.appendChild(img);
    }

    // Build text cell with field hint (title + CTA)
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    if (cardTitle) {
      const h3 = document.createElement('h3');
      h3.textContent = cardTitle.textContent.trim();
      textFrag.appendChild(h3);
    }

    if (ctaLink) {
      const link = document.createElement('a');
      link.href = ctaLink.href || '#';
      link.textContent = ctaLink.textContent.trim();
      textFrag.appendChild(link);
    }

    // Each card = 1 row with [image, text]
    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-selector', cells });
  element.replaceWith(block);
}
