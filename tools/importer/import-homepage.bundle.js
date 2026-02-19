var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(":scope > img, :scope img:first-of-type");
    const heading = element.querySelector("h1.title, h1, h2.title");
    const description = element.querySelector(".introTXT p, .introTXT, .col-md-8 p");
    const ctaLinks = Array.from(element.querySelectorAll("a.btn, a.gotoMain:not(.gotoArrow)"));
    const cells = [];
    if (bgImage) {
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:image "));
      imageFrag.appendChild(bgImage);
      cells.push([imageFrag]);
    }
    const contentFrag = document.createDocumentFragment();
    contentFrag.appendChild(document.createComment(" field:text "));
    if (heading) contentFrag.appendChild(heading);
    if (description) contentFrag.appendChild(description);
    ctaLinks.forEach((cta) => {
      if (!cta.classList.contains("gotoArrow") && cta.textContent.trim()) {
        contentFrag.appendChild(cta);
      }
    });
    cells.push([contentFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-selector.js
  function parse2(element, { document }) {
    const cardElements = element.querySelectorAll(".displayCard");
    const cells = [];
    cardElements.forEach((card) => {
      const img = card.querySelector("img.placeholder, img");
      const cardTitle = card.querySelector(".cardTitle");
      const ctaLink = card.querySelector(".cardClick a.btn");
      const imageFrag = document.createDocumentFragment();
      if (img) {
        imageFrag.appendChild(document.createComment(" field:image "));
        imageFrag.appendChild(img);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (cardTitle) {
        const h3 = document.createElement("h3");
        h3.textContent = cardTitle.textContent.trim();
        textFrag.appendChild(h3);
      }
      if (ctaLink) {
        const link = document.createElement("a");
        link.href = ctaLink.href || "#";
        link.textContent = ctaLink.textContent.trim();
        textFrag.appendChild(link);
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-selector", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-tile.js
  function parse3(element, { document }) {
    const items = element.querySelectorAll(".featuredItem");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".displayCard > img:not(.placeholder)") || item.querySelector("img:not(.placeholder)") || item.querySelector(".displayCard > img:first-child");
      const cardLink = item.querySelector("a.cardLink");
      const imageFrag = document.createDocumentFragment();
      if (img) {
        imageFrag.appendChild(document.createComment(" field:image "));
        imageFrag.appendChild(img);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (cardLink) {
        const heading = document.createElement("h3");
        heading.textContent = cardLink.textContent.trim();
        textFrag.appendChild(heading);
        const link = document.createElement("a");
        link.href = cardLink.href;
        link.textContent = cardLink.textContent.trim();
        textFrag.appendChild(link);
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-tile", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse4(element, { document }) {
    const columns = element.querySelectorAll(".column, .col-md-6");
    if (columns.length < 2) {
      const children = element.querySelectorAll(":scope > div > div");
      if (children.length >= 2) {
        const col1Content2 = document.createDocumentFragment();
        const col2Content2 = document.createDocumentFragment();
        while (children[0].firstChild) col1Content2.appendChild(children[0].firstChild);
        while (children[1].firstChild) col2Content2.appendChild(children[1].firstChild);
        const cells2 = [[col1Content2, col2Content2]];
        const block2 = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells: cells2 });
        element.replaceWith(block2);
        return;
      }
    }
    const col1 = columns[0];
    const col1Content = document.createDocumentFragment();
    const imgLink = col1.querySelector('a[href*="blueprint"], a[href*="pdf"]');
    const img = col1.querySelector('img:not([src*="placeholder"])');
    if (imgLink && img) {
      const link = document.createElement("a");
      link.href = imgLink.href;
      link.appendChild(img);
      col1Content.appendChild(link);
    } else if (img) {
      col1Content.appendChild(img);
    }
    const col2 = columns[1];
    const col2Content = document.createDocumentFragment();
    const descSpan = col2.querySelector(".ui-provider, span, center span");
    if (descSpan) {
      const para = document.createElement("p");
      para.textContent = descSpan.textContent.trim();
      col2Content.appendChild(para);
    }
    const ctaLink = col2.querySelector('a[href*="blueprint"], a[href*="pdf"]');
    if (ctaLink) {
      const link = document.createElement("a");
      link.href = ctaLink.href;
      link.textContent = ctaLink.textContent.trim() || "View Our Blueprint";
      col2Content.appendChild(link);
    }
    const cells = [[col1Content, col2Content]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon.js
  function parse5(element, { document }) {
    const listItems = element.querySelectorAll(".lined-grid ul li");
    const cells = [];
    listItems.forEach((li) => {
      const link = li.querySelector("a");
      if (!link) return;
      const iconEl = link.querySelector('em[class*="icon-"]');
      const iconClass = iconEl ? iconEl.className.trim() : "";
      const labelText = link.textContent.trim();
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:image "));
      if (iconEl) {
        const iconImg = document.createElement("img");
        iconImg.src = "";
        iconImg.alt = iconClass.replace("icon-si_", "").replace(/-/g, " ");
        imageFrag.appendChild(iconImg);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const heading = document.createElement("h3");
      heading.textContent = labelText;
      textFrag.appendChild(heading);
      const ctaLink = document.createElement("a");
      ctaLink.href = link.href;
      ctaLink.textContent = labelText;
      textFrag.appendChild(ctaLink);
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-icon", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse6(element, { document }) {
    const articles = element.querySelectorAll(".edn_article, article");
    const cells = [];
    articles.forEach((article) => {
      const img = article.querySelector("figure img, img");
      const dateEl = article.querySelector(".date, .meta-details .date");
      const dateText = dateEl ? dateEl.textContent.trim() : "";
      const headline = article.querySelector("figcaption h2, .edn-content h2, h2");
      const subheadline = article.querySelector("figcaption h3, .edn-content h3, h3");
      const readMoreLink = article.querySelector(".detail-link a, a");
      const imageFrag = document.createDocumentFragment();
      if (img) {
        imageFrag.appendChild(document.createComment(" field:image "));
        imageFrag.appendChild(img);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (dateText) {
        const datePara = document.createElement("p");
        datePara.textContent = dateText;
        textFrag.appendChild(datePara);
      }
      if (headline) textFrag.appendChild(headline);
      if (subheadline) textFrag.appendChild(subheadline);
      if (readMoreLink) {
        const link = document.createElement("a");
        link.href = readMoreLink.href;
        link.textContent = readMoreLink.textContent.trim() || "Read more";
        textFrag.appendChild(link);
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-contact.js
  function parse7(element, { document }) {
    const colDivs = element.querySelectorAll(":scope > .col-sm-6, .col-sm-6");
    if (colDivs.length < 2) {
      const simpleBlocks = element.querySelectorAll(".simple-block");
      if (simpleBlocks.length >= 2) {
        const col1Content2 = document.createDocumentFragment();
        const col2Content2 = document.createDocumentFragment();
        while (simpleBlocks[0].firstChild) col1Content2.appendChild(simpleBlocks[0].firstChild);
        while (simpleBlocks[1].firstChild) col2Content2.appendChild(simpleBlocks[1].firstChild);
        const cells2 = [[col1Content2, col2Content2]];
        const block2 = WebImporter.Blocks.createBlock(document, { name: "columns-contact", cells: cells2 });
        element.replaceWith(block2);
        return;
      }
    }
    const col1 = colDivs[0];
    const col1Content = document.createDocumentFragment();
    const col1Block = col1.querySelector(".simple-block") || col1;
    const col1Heading = col1Block.querySelector("h2");
    const col1Text = col1Block.querySelector("div p, p");
    if (col1Heading) col1Content.appendChild(col1Heading);
    if (col1Text) col1Content.appendChild(col1Text);
    const col2 = colDivs[1];
    const col2Content = document.createDocumentFragment();
    const col2Block = col2.querySelector(".simple-block") || col2;
    const col2Heading = col2Block.querySelector("h2");
    const col2Text = col2Block.querySelector("div p, p");
    const col2Cta = col2Block.querySelector("a.btn, a");
    if (col2Heading) col2Content.appendChild(col2Heading);
    if (col2Text) col2Content.appendChild(col2Text);
    if (col2Cta) col2Content.appendChild(col2Cta);
    const cells = [[col1Content, col2Content]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-contact", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/swbc-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        '[class*="cookie"]',
        ".chat-widget",
        "#drift-widget"
      ]);
      const overflowEls = element.querySelectorAll('[style*="overflow: hidden"]');
      overflowEls.forEach((el) => {
        el.style.overflow = "visible";
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.headerMain",
        ".headerMain",
        ".sb-skinobject-instance",
        "#dnn_avtSearchMob_pnlInput"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".footerMainGap",
        ".footerMain",
        "footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".DNNEmptyPane",
        "noscript",
        "link",
        "iframe"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-sf-ec-immutable");
      });
    }
  }

  // tools/importer/transformers/swbc-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element };
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: [["style", section.style]]
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(sectionMetadata);
          }
        }
        if (section.id !== "section-1") {
          const hr = document.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-banner": parse,
    "cards-selector": parse2,
    "cards-tile": parse3,
    "columns-promo": parse4,
    "cards-icon": parse5,
    "cards-news": parse6,
    "columns-contact": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Main landing page with hero banner, discover/services selector, featured services cards, blueprint section, careers listing, latest news, and contact support",
    urls: [
      "https://www.swbc.com"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: ["div.hero.home-hero"]
      },
      {
        name: "cards-selector",
        instances: ["#oscar"]
      },
      {
        name: "cards-tile",
        instances: ["div.featuredServicesGrid"]
      },
      {
        name: "columns-promo",
        instances: ["#contentNameIsSWBCBlueprint_HomePage"]
      },
      {
        name: "cards-icon",
        instances: ["div.careers-wrap"]
      },
      {
        name: "cards-news",
        instances: ["div.edn_1365_article_list_wrapper"]
      },
      {
        name: "columns-contact",
        instances: ["div.simple-block-wrap"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "div.heroMain.sectionMain",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Discover How We Can Help",
        selector: "div.DnnModule-SWBC-Oscar",
        style: null,
        blocks: ["cards-selector"],
        defaultContent: ["h2.title:has(> i)"]
      },
      {
        id: "section-3",
        name: "Featured Services",
        selector: "div.slant-wrapper.slant-pattern.slant-body-teal",
        style: "teal",
        blocks: ["cards-tile"],
        defaultContent: ["div.featuredServices > div.col-md-3"]
      },
      {
        id: "section-4",
        name: "Our Blueprint",
        selector: "div.contentNameIsSWBCBlueprint_HomePage",
        style: null,
        blocks: ["columns-promo"],
        defaultContent: ["h2.title:has(> i)"]
      },
      {
        id: "section-5",
        name: "Career Opportunities",
        selector: "div.slant-wrapper.slant-pattern.slant-body-navy",
        style: "navy",
        blocks: ["cards-icon"],
        defaultContent: ["h2.title:has(> small)", "a.btn.btn-primary"]
      },
      {
        id: "section-6",
        name: "Latest News",
        selector: "div.DnnModule-EasyDNNnews",
        style: null,
        blocks: ["cards-news"],
        defaultContent: ["h2.title:has(> i)"]
      },
      {
        id: "section-7",
        name: "Contact Support",
        selector: "div.slant-wrapper.slant-body-white:has(.simple-block-wrap)",
        style: null,
        blocks: ["columns-contact"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            element
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
