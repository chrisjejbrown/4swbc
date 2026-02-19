/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsSelectorParser from './parsers/cards-selector.js';
import cardsTileParser from './parsers/cards-tile.js';
import columnsPromoParser from './parsers/columns-promo.js';
import cardsIconParser from './parsers/cards-icon.js';
import cardsNewsParser from './parsers/cards-news.js';
import columnsContactParser from './parsers/columns-contact.js';

// TRANSFORMER IMPORTS
import swbcCleanupTransformer from './transformers/swbc-cleanup.js';
import swbcSectionsTransformer from './transformers/swbc-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-selector': cardsSelectorParser,
  'cards-tile': cardsTileParser,
  'columns-promo': columnsPromoParser,
  'cards-icon': cardsIconParser,
  'cards-news': cardsNewsParser,
  'columns-contact': columnsContactParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Main landing page with hero banner, discover/services selector, featured services cards, blueprint section, careers listing, latest news, and contact support',
  urls: [
    'https://www.swbc.com',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: ['div.hero.home-hero'],
    },
    {
      name: 'cards-selector',
      instances: ['#oscar'],
    },
    {
      name: 'cards-tile',
      instances: ['div.featuredServicesGrid'],
    },
    {
      name: 'columns-promo',
      instances: ['#contentNameIsSWBCBlueprint_HomePage'],
    },
    {
      name: 'cards-icon',
      instances: ['div.careers-wrap'],
    },
    {
      name: 'cards-news',
      instances: ['div.edn_1365_article_list_wrapper'],
    },
    {
      name: 'columns-contact',
      instances: ['div.simple-block-wrap'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'div.heroMain.sectionMain',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Discover How We Can Help',
      selector: 'div.DnnModule-SWBC-Oscar',
      style: null,
      blocks: ['cards-selector'],
      defaultContent: ['h2.title:has(> i)'],
    },
    {
      id: 'section-3',
      name: 'Featured Services',
      selector: 'div.slant-wrapper.slant-pattern.slant-body-teal',
      style: 'teal',
      blocks: ['cards-tile'],
      defaultContent: ['div.featuredServices > div.col-md-3'],
    },
    {
      id: 'section-4',
      name: 'Our Blueprint',
      selector: 'div.contentNameIsSWBCBlueprint_HomePage',
      style: null,
      blocks: ['columns-promo'],
      defaultContent: ['h2.title:has(> i)'],
    },
    {
      id: 'section-5',
      name: 'Career Opportunities',
      selector: 'div.slant-wrapper.slant-pattern.slant-body-navy',
      style: 'navy',
      blocks: ['cards-icon'],
      defaultContent: ['h2.title:has(> small)', 'a.btn.btn-primary'],
    },
    {
      id: 'section-6',
      name: 'Latest News',
      selector: 'div.DnnModule-EasyDNNnews',
      style: null,
      blocks: ['cards-news'],
      defaultContent: ['h2.title:has(> i)'],
    },
    {
      id: 'section-7',
      name: 'Contact Support',
      selector: 'div.slant-wrapper.slant-body-white:has(.simple-block-wrap)',
      style: null,
      blocks: ['columns-contact'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  swbcCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [swbcSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
