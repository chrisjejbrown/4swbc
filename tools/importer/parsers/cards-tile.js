/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-tile. Base: cards. Source: https://www.swbc.com
 * Model fields per card: image (reference), text (richtext)
 * Selector: div.featuredServicesGrid
 * Extracts featured service tiles with images and service names
 */
export default function parse(element, { document }) {
  // Find all featured service items
  const items = element.querySelectorAll('.featuredItem');

  const cells = [];

  items.forEach((item) => {
    // Extract the main service image (not the placeholder)
    // Try multiple selectors: direct child first, then any non-placeholder img
    const img = item.querySelector('.displayCard > img:not(.placeholder)')
      || item.querySelector('img:not(.placeholder)')
      || item.querySelector('.displayCard > img:first-child');

    // Extract the card link with service name
    const cardLink = item.querySelector('a.cardLink');

    // Build image cell with field hint
    const imageFrag = document.createDocumentFragment();
    if (img) {
      imageFrag.appendChild(document.createComment(' field:image '));
      imageFrag.appendChild(img);
    }

    // Build text cell with field hint (service name as heading + link)
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    if (cardLink) {
      const heading = document.createElement('h3');
      heading.textContent = cardLink.textContent.trim();
      textFrag.appendChild(heading);

      const link = document.createElement('a');
      link.href = cardLink.href;
      link.textContent = cardLink.textContent.trim();
      textFrag.appendChild(link);
    }

    // Each card = 1 row with [image, text]
    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tile', cells });
  element.replaceWith(block);
}
