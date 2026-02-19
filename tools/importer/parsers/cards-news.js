/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-news. Base: cards. Source: https://www.swbc.com
 * Model fields per card: image (reference), text (richtext)
 * Selector: div.edn_1365_article_list_wrapper
 * Extracts news article cards with thumbnail, date, headline, subheadline, read more link
 */
export default function parse(element, { document }) {
  // Find all article items
  const articles = element.querySelectorAll('.edn_article, article');

  const cells = [];

  articles.forEach((article) => {
    // Extract article image
    const img = article.querySelector('figure img, img');

    // Extract date
    const dateEl = article.querySelector('.date, .meta-details .date');
    const dateText = dateEl ? dateEl.textContent.trim() : '';

    // Extract headline
    const headline = article.querySelector('figcaption h2, .edn-content h2, h2');

    // Extract subheadline
    const subheadline = article.querySelector('figcaption h3, .edn-content h3, h3');

    // Extract read more link
    const readMoreLink = article.querySelector('.detail-link a, a');

    // Build image cell with field hint
    const imageFrag = document.createDocumentFragment();
    if (img) {
      imageFrag.appendChild(document.createComment(' field:image '));
      imageFrag.appendChild(img);
    }

    // Build text cell with field hint (date + headline + subheadline + link)
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    if (dateText) {
      const datePara = document.createElement('p');
      datePara.textContent = dateText;
      textFrag.appendChild(datePara);
    }

    if (headline) textFrag.appendChild(headline);
    if (subheadline) textFrag.appendChild(subheadline);

    if (readMoreLink) {
      const link = document.createElement('a');
      link.href = readMoreLink.href;
      link.textContent = readMoreLink.textContent.trim() || 'Read more';
      textFrag.appendChild(link);
    }

    // Each card = 1 row with [image, text]
    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
