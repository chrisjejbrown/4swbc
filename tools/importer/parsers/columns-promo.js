/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo. Base: columns. Source: https://www.swbc.com
 * Selector: #contentNameIsSWBCBlueprint_HomePage
 * Columns blocks do NOT require field hint comments.
 * Extracts two-column layout: left = blueprint cover image, right = description + CTA
 */
export default function parse(element, { document }) {
  // Find the two column containers
  const columns = element.querySelectorAll('.column, .col-md-6');

  if (columns.length < 2) {
    // Fallback: try to find any side-by-side children
    const children = element.querySelectorAll(':scope > div > div');
    if (children.length >= 2) {
      const col1Content = document.createDocumentFragment();
      const col2Content = document.createDocumentFragment();

      // Move children content
      while (children[0].firstChild) col1Content.appendChild(children[0].firstChild);
      while (children[1].firstChild) col2Content.appendChild(children[1].firstChild);

      const cells = [[col1Content, col2Content]];
      const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
      element.replaceWith(block);
      return;
    }
  }

  // Column 1: Blueprint cover image with link
  const col1 = columns[0];
  const col1Content = document.createDocumentFragment();

  // Find image link in column 1
  const imgLink = col1.querySelector('a[href*="blueprint"], a[href*="pdf"]');
  const img = col1.querySelector('img:not([src*="placeholder"])');

  if (imgLink && img) {
    const link = document.createElement('a');
    link.href = imgLink.href;
    link.appendChild(img);
    col1Content.appendChild(link);
  } else if (img) {
    col1Content.appendChild(img);
  }

  // Column 2: Description text and CTA
  const col2 = columns[1];
  const col2Content = document.createDocumentFragment();

  // Extract description text
  const descSpan = col2.querySelector('.ui-provider, span, center span');
  if (descSpan) {
    const para = document.createElement('p');
    para.textContent = descSpan.textContent.trim();
    col2Content.appendChild(para);
  }

  // Extract CTA link
  const ctaLink = col2.querySelector('a[href*="blueprint"], a[href*="pdf"]');
  if (ctaLink) {
    const link = document.createElement('a');
    link.href = ctaLink.href;
    link.textContent = ctaLink.textContent.trim() || 'View Our Blueprint';
    col2Content.appendChild(link);
  }

  // Build cells: 1 row with 2 columns
  const cells = [[col1Content, col2Content]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
