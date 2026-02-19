/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: SWBC section breaks and section-metadata.
 * Adds <hr> section dividers and section-metadata blocks for styled sections.
 * Runs in afterTransform only. Uses payload.template.sections from page-templates.json.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element };

    // Process sections in reverse order to avoid index shifting
    const sections = [...template.sections].reverse();

    sections.forEach((section) => {
      // Find the section element using the selector(s)
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) return;

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: [['style', section.style]],
        });
        // Insert section-metadata after the section content
        if (sectionEl.nextSibling) {
          sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
        } else {
          sectionEl.parentNode.appendChild(sectionMetadata);
        }
      }

      // Add <hr> section break before the section (except the first section)
      if (section.id !== 'section-1') {
        const hr = document.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    });
  }
}
