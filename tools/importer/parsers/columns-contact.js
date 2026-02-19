/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-contact. Base: columns. Source: https://www.swbc.com
 * Selector: div.simple-block-wrap
 * Columns blocks do NOT require field hint comments.
 * Extracts two-column contact layout: left = assistance info, right = help + CTA
 */
export default function parse(element, { document }) {
  // Find the two column containers
  const colDivs = element.querySelectorAll(':scope > .col-sm-6, .col-sm-6');

  if (colDivs.length < 2) {
    // Fallback: try simple-block children
    const simpleBlocks = element.querySelectorAll('.simple-block');
    if (simpleBlocks.length >= 2) {
      const col1Content = document.createDocumentFragment();
      const col2Content = document.createDocumentFragment();

      while (simpleBlocks[0].firstChild) col1Content.appendChild(simpleBlocks[0].firstChild);
      while (simpleBlocks[1].firstChild) col2Content.appendChild(simpleBlocks[1].firstChild);

      const cells = [[col1Content, col2Content]];
      const block = WebImporter.Blocks.createBlock(document, { name: 'columns-contact', cells });
      element.replaceWith(block);
      return;
    }
  }

  // Column 1: Need Immediate Assistance? with phone/hours
  const col1 = colDivs[0];
  const col1Content = document.createDocumentFragment();

  const col1Block = col1.querySelector('.simple-block') || col1;
  const col1Heading = col1Block.querySelector('h2');
  const col1Text = col1Block.querySelector('div p, p');

  if (col1Heading) col1Content.appendChild(col1Heading);
  if (col1Text) col1Content.appendChild(col1Text);

  // Column 2: How Can We Help You? with description and CTA
  const col2 = colDivs[1];
  const col2Content = document.createDocumentFragment();

  const col2Block = col2.querySelector('.simple-block') || col2;
  const col2Heading = col2Block.querySelector('h2');
  const col2Text = col2Block.querySelector('div p, p');
  const col2Cta = col2Block.querySelector('a.btn, a');

  if (col2Heading) col2Content.appendChild(col2Heading);
  if (col2Text) col2Content.appendChild(col2Text);
  if (col2Cta) col2Content.appendChild(col2Cta);

  // Build cells: 1 row with 2 columns
  const cells = [[col1Content, col2Content]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-contact', cells });
  element.replaceWith(block);
}
