/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: SWBC site cleanup.
 * Removes non-authorable content (header, footer, nav, search, DNN chrome).
 * Selectors from captured DOM of swbc.com.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie/consent banners, chat widgets, overlays (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="cookie"]',
      '.chat-widget',
      '#drift-widget',
    ]);

    // Fix overflow issues that may affect block matching
    const overflowEls = element.querySelectorAll('[style*="overflow: hidden"]');
    overflowEls.forEach((el) => { el.style.overflow = 'visible'; });
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header/navigation (DNN header module from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      'header.headerMain',
      '.headerMain',
      '.sb-skinobject-instance',
      '#dnn_avtSearchMob_pnlInput',
    ]);

    // Remove footer (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '.footerMainGap',
      '.footerMain',
      'footer',
    ]);

    // Remove DNN non-content elements (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '.DNNEmptyPane',
      'noscript',
      'link',
      'iframe',
    ]);

    // Clean up DNN tracking/data attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-sf-ec-immutable');
    });
  }
}
