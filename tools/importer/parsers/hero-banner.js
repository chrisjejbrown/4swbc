/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero. Source: https://www.swbc.com
 * Model fields: image (reference), imageAlt (collapsed), text (richtext)
 * Selector: div.hero.home-hero
 */
export default function parse(element, { document }) {
  // Extract background image
  const bgImage = element.querySelector(':scope > img, :scope img:first-of-type');

  // Extract heading
  const heading = element.querySelector('h1.title, h1, h2.title');

  // Extract description paragraph
  const description = element.querySelector('.introTXT p, .introTXT, .col-md-8 p');

  // Extract CTA links
  const ctaLinks = Array.from(element.querySelectorAll('a.btn, a.gotoMain:not(.gotoArrow)'));

  // Build cells following hero block library structure:
  // Row 1: image (optional background)
  // Row 2: richtext content (heading + description + CTAs)
  const cells = [];

  // Row 1: Background image with field hint
  if (bgImage) {
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    imageFrag.appendChild(bgImage);
    cells.push([imageFrag]);
  }

  // Row 2: Richtext content with field hint
  const contentFrag = document.createDocumentFragment();
  contentFrag.appendChild(document.createComment(' field:text '));
  if (heading) contentFrag.appendChild(heading);
  if (description) contentFrag.appendChild(description);
  ctaLinks.forEach((cta) => {
    // Filter out the down-arrow navigation link
    if (!cta.classList.contains('gotoArrow') && cta.textContent.trim()) {
      contentFrag.appendChild(cta);
    }
  });
  cells.push([contentFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
