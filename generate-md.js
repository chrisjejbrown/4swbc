/**
 * Helper to generate properly-formatted grid table markdown for md2jcr.
 *
 * Rule: Every line in a grid table MUST be exactly the same length.
 * The | characters in content lines must align with + in separator lines.
 */

function padCell(content, width) {
  // Pad content to exactly width characters
  const padded = content + ' '.repeat(Math.max(0, width - content.length));
  if (padded.length > width) {
    throw new Error(`Content too long for cell width ${width}: "${content}" (${content.length} chars)`);
  }
  return padded;
}

function makeGridTable1Col(blockName, rows, minWidth = 40) {
  // Calculate required width from all content
  let maxContent = blockName.length;
  for (const row of rows) {
    for (const line of (Array.isArray(row) ? row : [row])) {
      if (line.length > maxContent) maxContent = line.length;
    }
  }
  const cellWidth = Math.max(minWidth, maxContent + 2); // +2 for padding

  const sep = '+' + '-'.repeat(cellWidth) + '+';
  const headSep = '+' + '='.repeat(cellWidth) + '+';

  const lines = [];
  lines.push(sep);
  lines.push('| ' + padCell(blockName, cellWidth - 2) + ' |');
  lines.push(headSep);

  for (let i = 0; i < rows.length; i++) {
    const row = Array.isArray(rows[i]) ? rows[i] : [rows[i]];
    for (const line of row) {
      lines.push('| ' + padCell(line, cellWidth - 2) + ' |');
    }
    if (i < rows.length - 1) {
      lines.push(sep);
    }
  }
  lines.push(sep);

  return lines.join('\n');
}

function makeGridTable2Col(blockName, rows, minCol1 = 20, minCol2 = 40) {
  // rows: Array of [col1Content, col2Content] where each can be string or string[]
  let maxCol1 = 0;
  let maxCol2 = 0;

  for (const [c1, c2] of rows) {
    const c1lines = Array.isArray(c1) ? c1 : [c1];
    const c2lines = Array.isArray(c2) ? c2 : [c2];
    for (const l of c1lines) { if (l.length > maxCol1) maxCol1 = l.length; }
    for (const l of c2lines) { if (l.length > maxCol2) maxCol2 = l.length; }
  }

  const col1Width = Math.max(minCol1, maxCol1 + 2);
  const col2Width = Math.max(minCol2, maxCol2 + 2);

  // Block name must fit in combined width
  const totalInner = col1Width + 1 + col2Width; // +1 for middle |

  const sep = '+' + '-'.repeat(col1Width) + '+' + '-'.repeat(col2Width) + '+';
  const headSep = '+' + '='.repeat(col1Width) + '+' + '='.repeat(col2Width) + '+';

  const lines = [];
  lines.push(sep);
  // Header spans both columns
  lines.push('| ' + padCell(blockName, totalInner - 2) + ' |');
  lines.push(headSep);

  for (let i = 0; i < rows.length; i++) {
    const [c1, c2] = rows[i];
    const c1lines = Array.isArray(c1) ? c1 : [c1];
    const c2lines = Array.isArray(c2) ? c2 : [c2];
    const maxLines = Math.max(c1lines.length, c2lines.length);

    for (let j = 0; j < maxLines; j++) {
      const left = c1lines[j] || '';
      const right = c2lines[j] || '';
      lines.push('| ' + padCell(left, col1Width - 2) + ' | ' + padCell(right, col2Width - 2) + ' |');
    }
    if (i < rows.length - 1) {
      lines.push(sep);
    }
  }
  lines.push(sep);

  return lines.join('\n');
}

// ============ BUILD THE PAGE ============

const sections = [];

// --- SECTION 1: Hero Banner ---
const heroBanner = makeGridTable1Col('Hero Banner', [
  // Row 1: Image (empty)
  [''],
  // Row 2: Text content
  [
    '<!-- field:text -->',
    '[Business](/business) · [Financial Institutions](/financial-institutions) · [For All](/for-all)',
    '',
    'Empower Your Business Growth',
    '',
    '# Comprehensive financial solutions tailored for businesses of all sizes',
    '',
    '**[Get in Touch](/contact)**',
    '',
    '*[Learn More](/solutions)*',
  ],
]);
sections.push(heroBanner);

// --- SECTION 2: Accordion + Image (two-column) ---
const accordion = makeGridTable2Col('Accordion', [
  ['<!-- field:summary -->Business Solution One', '<!-- field:text -->Tailored financial products designed to help your business grow. From working capital to expansion funding, we provide comprehensive solutions for businesses at every stage.'],
  ['<!-- field:summary -->Business Solution Two', '<!-- field:text -->Strategic advisory services that help you navigate complex financial landscapes. Our experts work alongside your team to develop customized strategies.'],
  ['<!-- field:summary -->Business Solution Three', '<!-- field:text -->Risk management and insurance solutions that protect your business assets. We help you identify and mitigate potential risks before they impact your operations.'],
  ['<!-- field:summary -->Business Solution Four', '<!-- field:text -->Digital banking solutions that streamline your operations. From online payments to automated reconciliation, we make managing finances effortless.'],
]);

const sectionMeta = makeGridTable2Col('Section Metadata', [
  ['style', 'two-column'],
]);

sections.push([
  'Our Business Solutions',
  '',
  '## Comprehensive financial services to help your business thrive',
  '',
  accordion,
  '',
  '![Business solutions](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=500&fit=crop)',
  '',
  sectionMeta,
].join('\n'));

// --- SECTION 3: Stats ---
const stats = makeGridTable2Col('Stats', [
  ['<!-- field:value -->1,250+', '<!-- field:label -->Total banking partners that rely on our global network'],
  ['<!-- field:value -->85M', '<!-- field:label -->Total customers from around the world'],
  ['<!-- field:value -->99.9%', '<!-- field:label -->Client satisfaction rate with our premium business solutions'],
  ['<!-- field:value -->25+', '<!-- field:label -->Years of experience in global corporate financial services'],
]);

sections.push([
  'Trust SMBC as your partner',
  '',
  '## Customer record speaks for itself. Join thousands of businesses who trust SMBC.',
  '',
  '**[Learn More](/about)**',
  '',
  stats,
].join('\n'));

// --- SECTION 4: Cards News ---
const cardsNews = makeGridTable2Col('Cards News', [
  ['<!-- field:image -->![Business news](https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&h=400&fit=crop)', ['<!-- field:text -->Press Release', '### Expansion into New Markets Continues to Grow', 'November 15, 2024']],
  ['<!-- field:image -->![Leadership](https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop)', ['<!-- field:text -->Company News', '### Leadership Perspectives on Future Markets and Growth', 'November 12, 2024']],
  ['<!-- field:image -->![Expansion](https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop)', ['<!-- field:text -->Press Release', '### Expansion into New Markets: Building Global Connections', 'November 8, 2024']],
  ['<!-- field:image -->![Technology](https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop)', ['<!-- field:text -->Spotlight', '### A Spotlight on Our Innovative Technology Solutions', 'November 5, 2024']],
  ['<!-- field:image -->![Partnership](https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop)', ['<!-- field:text -->Events', '### Expansion Into New Markets: Partnership Announcement', 'November 1, 2024']],
  ['<!-- field:image -->![Career](https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop)', ['<!-- field:text -->Press Release', '### Updates on How We Advance Our Careers and Culture', 'October 28, 2024']],
]);

sections.push([
  'News & Outcomes',
  '',
  '## Stay connected with our latest articles, events, announcements and community initiatives',
  '',
  cardsNews,
].join('\n'));

// --- SECTION 5: Social Feed ---
const socialFeed = makeGridTable2Col('Social Feed', [
  ['<!-- field:image -->![Social post 1](https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop)', '<!-- field:text -->Choosing the Right Payroll Provider for Your Business'],
  ['<!-- field:image -->![Social post 2](https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop)', '<!-- field:text -->The Complete Process: Scaling Your Business with Confidence'],
  ['<!-- field:image -->![Social post 3](https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop)', '<!-- field:text -->Knowledge is Power: Financial Insights for Modern Businesses'],
]);

sections.push([
  'Follow SMBC',
  '',
  '## Join the conversation and stay connected with us on social media',
  '',
  socialFeed,
].join('\n'));

// --- SECTION 6: CTA Banner ---
// Simple block: each ROW maps to a field group.
// Row 1 → content (richtext), Row 2 → emailLabel (text)
const ctaBanner = makeGridTable1Col('Cta Banner', [
  // Row 1: content (richtext)
  ['Stay Informed', '', '## Insights and updates delivered to your inbox', '', 'Stay informed with the latest market insights, product updates, and financial strategies delivered directly to your inbox.'],
  // Row 2: emailLabel (text)
  ['Your Email Address'],
]);

sections.push(ctaBanner);

// Combine all sections with --- separators
const output = sections.join('\n\n---\n\n') + '\n';

process.stdout.write(output);
