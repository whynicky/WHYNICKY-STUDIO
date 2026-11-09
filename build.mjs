import { access, cp, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories, money, photoPath, productById, productPath, products, sizes } from './src/collection.js';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const origin = process.env.SITE_ORIGIN || '';
const brand = 'WHYNICKY<sup>®</sup>';
const campaign = 'Fault Lines';
const season = 'Autumn / Winter 2026';
const nav = [['/shop/', 'Shop'], ['/lookbook/', 'Lookbook'], ['/about/', 'About']];
const arrow = (direction = 'right') => {
  const paths = {
    right: 'M3 8h10m-4-4 4 4-4 4',
    left: 'M13 8H3m4-4L3 8l4 4',
    down: 'M8 3v10m-4-4 4 4 4-4',
    up: 'M8 13V3m-4 4 4-4 4 4',
    diagonal: 'M4 12 12 4M5 4h7v7',
  };
  return `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="${paths[direction]}" stroke="currentColor" stroke-width="1.2" stroke-linecap="square"/></svg>`;
};
const closeIcon = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20"><path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" stroke-width="1.25"/></svg>';
const link = (url, title, current) => `<a href="${url}"${current ? ' aria-current="page"' : ''}>${title}</a>`;
const image = (path, alt, options = {}) => {
  const { width = 1000, height = 1250, eager = false, extra = '' } = options;
  return `<img src="${path}" alt="${alt}" width="${width}" height="${height}" ${eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'} ${extra}>`;
};
const editorial = (name, alt, options) => image(`/assets/${name}.webp`, alt, options);
const inlineLink = (url, label, direction = 'right') => `<a class="text-link" href="${url}">${label}${arrow(direction)}</a>`;

function header(page) {
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header${page === 'home' ? ' site-header--over-hero' : ''}" id="top">
    <nav class="header-nav" aria-label="Main">${nav.map(([path, label]) => link(path, label, page === label.toLowerCase() || (label === 'Shop' && page === 'product'))).join('')}</nav>
    <button class="mobile-menu" type="button" data-open="menu" aria-haspopup="dialog" aria-label="Menu">
      <span aria-hidden="true" class="menu-lines"></span><span>Menu</span>
    </button>
    <a class="header-brand wordmark" href="/" aria-label="WHYNICKY® home"${page === 'home' ? ' aria-current="page"' : ''}>${brand}</a>
    <div class="header-actions">
      <button class="header-search" type="button" data-open="search" aria-haspopup="dialog">Search</button>
      <button class="header-bag" type="button" data-open="bag" aria-haspopup="dialog">Bag (<span data-bag-count>0</span>)</button>
    </div>
  </header>`;
}

function footer(page) {
  return `<footer class="site-footer">
    <div class="footer-main">
      <a href="/" class="footer-brand wordmark" aria-label="WHYNICKY® home">${brand}</a>
      <nav class="footer-nav" aria-label="Footer">${nav.map(([path, label]) => link(path, label, page === label.toLowerCase())).join('')}</nav>
      <button class="footer-top text-link" type="button" data-back-to-top>Back to top${arrow('up')}</button>
    </div>
    <div class="footer-note">
      <span>© 2026 WHYNICKY®</span>
      <span>Portfolio storefront</span>
      ${link('/store-info/', 'Store information', page === 'info')}
    </div>
  </footer>`;
}

function dialog(id, title, body, className = 'drawer') {
  return `<dialog id="${id}" class="${className}" aria-labelledby="${id}-title">
    <div class="panel">
      <div class="panel-heading"><h2 id="${id}-title">${title}</h2><button class="icon-button" type="button" data-close aria-label="Close ${title.toLowerCase()}">${closeIcon}</button></div>
      ${body}
    </div>
  </dialog>`;
}

function dialogs(page) {
  return dialog('menu', 'Menu', `<nav class="menu-nav" aria-label="Mobile">${nav.map(([path, label]) => link(path, label, page === label.toLowerCase())).join('')}<button type="button" data-open="search" aria-haspopup="dialog">Search</button></nav>
    <span class="menu-foot">${campaign} · ${season}</span>`, 'drawer drawer--menu') +
    dialog('search', 'Search', `<div class="panel-body">
      <label class="search-label" for="product-search">Find a piece</label>
      <div class="search-field"><input id="product-search" type="search" placeholder="Name, material or color" autocomplete="off" maxlength="120" autofocus></div>
      <p class="result-note" role="status" id="search-count"></p><div id="search-results" class="search-results"></div>
    </div>`) +
    dialog('bag', 'Bag', '<div class="panel-body bag-body" id="bag-content"></div><p class="visually-hidden" id="bag-status" role="status"></p>');
}

function document(page, title, description, body, socialImage = '/assets/hero.webp') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="${page === 'home' ? '#272e32' : '#ffffff'}">
  <meta name="robots" content="noindex">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${origin}${socialImage}">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="preload" href="/assets/geist.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/style.css">
  <script type="module" src="/store.js"></script>
</head>
<body data-page="${page}">
  ${header(page)}
  <main id="main" tabindex="-1">${body}</main>
  ${footer(page)}
  ${dialogs(page)}
</body>
</html>`;
}

function productCard(product) {
  return `<article class="product-card" data-product="${product.id}">
    <a href="${productPath(product)}" aria-label="${product.name}, ${product.color}, ${money(product.price)}">
      <div class="product-card__image">
        ${image(photoPath(product), '')}
        ${image(photoPath(product, 'back'), '', { extra: 'class="product-card__back" aria-hidden="true"' })}
      </div>
      <div class="product-card__label">
        <div><h3>${product.name}</h3><p>${product.color}</p></div>
        <span>${money(product.price)}</span>
      </div>
    </a>
  </article>`;
}

function catalog(home = false) {
  return `<section class="catalog section-pad${home ? ' catalog--home' : ''}" aria-labelledby="catalog-title">
    <div class="catalog-title">
      <div><p class="eyebrow">${home ? season : 'The collection'}</p>
      <h${home ? 2 : 1} id="catalog-title">${campaign}</h${home ? 2 : 1}></div>
      <p class="catalog-caption">${home ? 'Six pieces in stone, chalk and washed black.' : season}</p>
    </div>
    <div class="catalog-controls">
      <div class="category-controls" role="group" aria-label="Filter by category">
        ${categories.map(([id, label]) => `<button type="button" data-category="${id}" aria-pressed="${id === 'all'}">${label}</button>`).join('')}
      </div>
      <div class="catalog-tools">
        <span id="catalog-count" role="status">6 pieces</span>
        ${home ? '' : `<label class="sort-label"><span class="visually-hidden">Sort products</span>
          <select id="catalog-sort"><option value="featured">Featured</option><option value="price-low">Price, low to high</option><option value="price-high">Price, high to low</option></select>
        </label>`}
      </div>
    </div>
    <div class="product-grid" id="catalog-grid">${products.map(productCard).join('')}</div>
  </section>`;
}

const heroAlt = 'A figure in a stone jacket and black denim stands among slate slopes under a clouded sky.';
const riftAlt = 'A model wears the stone Rift Jacket and washed black Drift Denim on a slate slope.';
const faultAlt = 'A model in the chalk Fault Knit and Drift Denim stands against a dark rock wall.';
const slagAlt = 'A model crosses the quarry in the espresso Slag Bomber and olive Fold Trouser.';

const home = `<section class="hero" aria-labelledby="hero-title">
    <picture>
      <source media="(max-width: 600px)" srcset="/assets/hero-mobile.webp" width="530" height="941">
      ${editorial('hero', heroAlt, { width: 1672, height: 941, eager: true, extra: 'class="hero-photo"' })}
    </picture>
    <h1 id="hero-title" class="hero-wordmark wordmark">${brand}</h1>
    <div class="hero-bottom">
      <div><p>${campaign}</p><p class="hero-season">${season}</p></div>
      ${inlineLink('/shop/', 'Shop collection', 'diagonal')}
    </div>
  </section>
  ${catalog(true)}
  <section class="home-story" aria-labelledby="home-story-title">
    <div class="home-story__image">${editorial('look-rift', riftAlt)}</div>
    <div class="home-story__copy">
      <p class="eyebrow">${season}</p>
      <h2 id="home-story-title">Fault Lines<br>Lookbook</h2>
      <p>Brushed cotton, worn leather and curved denim, photographed in a slate quarry.</p>
      ${inlineLink('/lookbook/', 'View lookbook', 'diagonal')}
    </div>
  </section>`;

const lookbook = `<section class="lookbook section-pad" aria-labelledby="lookbook-title">
    <div class="editorial-heading"><div><p class="eyebrow">Lookbook · ${season}</p><h1 id="lookbook-title">${campaign}</h1></div>
      <p>Boxy layers and wide cuts against the quarry’s uneven lines.</p></div>
    <figure class="look-wide">
      ${editorial('campaign', heroAlt, { width: 1672, height: 941, eager: true })}
      <figcaption>${link('/product/rift-jacket/', 'Rift Jacket')} <span aria-hidden="true">/</span> ${link('/product/drift-denim/', 'Drift Denim')}</figcaption>
    </figure>
    <div class="look-pair">
      <figure>${editorial('look-slag', slagAlt)}<figcaption>${link('/product/slag-bomber/', 'Slag Bomber')} <span aria-hidden="true">/</span> ${link('/product/fold-trouser/', 'Fold Trouser')}</figcaption></figure>
      <figure>${editorial('look-fault', faultAlt)}<figcaption>${link('/product/fault-knit/', 'Fault Knit')} <span aria-hidden="true">/</span> ${link('/product/drift-denim/', 'Drift Denim')}</figcaption></figure>
    </div>
    ${inlineLink('/shop/', 'Shop collection', 'diagonal')}
  </section>`;

const about = `<section class="about section-pad">
    <div class="about-copy">
      <p class="eyebrow">About the studio</p>
      <h1 class="wordmark">${brand}</h1>
      <p>WHYNICKY® is a concept label built around the way clothes take up space. The cut starts with a single detail: a raised collar, a seam that bends, a fold that opens when you move.</p>
      <p>Fault Lines brings six pieces together in washed denim, moleskin, leather and rib knit. The collection takes its colors from slate, chalk and weathered stone.</p>
      ${inlineLink('/lookbook/', 'View lookbook', 'diagonal')}
    </div>
    <figure>${editorial('look-fault', faultAlt, { eager: true })}<figcaption>${campaign} · ${season}</figcaption></figure>
  </section>`;

const info = `<section class="prose-page section-pad">
    <p class="eyebrow">WHYNICKY®</p><h1>Store information</h1>
    <h2>Portfolio storefront</h2>
    <p>WHYNICKY® is a concept label. Product designs, prices and measurements are part of this demonstration. Ordering, payment and shipping are unavailable.</p>
    <h2>Privacy</h2>
    <p>The bag uses local storage in this browser to remember the pieces you add. You can clear it by removing the pieces or clearing this site’s browser data.</p>
    ${inlineLink('/shop/', 'Return to shop')}
  </section>`;

function sizeGuide(product) {
  const isBottom = product.category === 'bottoms';
  return dialog('size-guide', 'Size guide', `<div class="panel-body size-guide">
    <p>${product.name} · ${product.color}</p>
    <p class="muted">Garment measurements in centimeters. Compare with a similar piece you own.</p>
    <table><caption class="visually-hidden">Garment measurements for ${product.name}</caption>
      <thead><tr><th scope="col">Size</th><th scope="col">${isBottom ? 'Waist' : 'Chest'}</th><th scope="col">${isBottom ? 'Inseam' : 'Length'}</th></tr></thead>
      <tbody>${product.measurements.map(([first, second], index) => `<tr><th scope="row">${sizes[index]}</th><td>${first}</td><td>${second}</td></tr>`).join('')}</tbody>
    </table>
    <p>${product.fit}</p>
  </div>`, 'drawer drawer--small');
}

function productPage(product) {
  const views = [['front', 'Front'], ['back', 'Back'], ['detail', 'Detail']];
  return `<section class="product-page section-pad" data-product-page="${product.id}" aria-labelledby="product-title">
    <div class="product-breadcrumb">${inlineLink('/shop/', 'Collection', 'left')}</div>
    <div class="product-layout">
      <div class="product-gallery" aria-label="Product gallery">
        <button class="gallery-main" type="button" data-open="zoom" aria-haspopup="dialog" aria-label="Enlarge product image">
          ${views.map(([id, label], index) => image(photoPath(product, id), `${product.name}, ${label.toLowerCase()} view`, { eager: index === 0, extra: `data-gallery-image="${id}"${index === 0 ? ' class="is-visible"' : ' aria-hidden="true"'}` })).join('')}
          <span class="zoom-mark" aria-hidden="true">${arrow('diagonal')}</span>
        </button>
        <div class="gallery-controls" role="group" aria-label="Choose product view">
          <button class="icon-button" type="button" data-gallery-step="-1" aria-label="Previous image">${arrow('left')}</button>
          ${views.map(([id, label], index) => `<button class="gallery-option" type="button" data-gallery-view="${id}" aria-pressed="${index === 0}">${label}</button>`).join('')}
          <button class="icon-button" type="button" data-gallery-step="1" aria-label="Next image">${arrow()}</button>
        </div>
        <span class="visually-hidden" id="gallery-status" role="status"></span>
      </div>
      <div class="product-intro">
        <p class="eyebrow">${campaign}</p><h1 id="product-title">${product.name}</h1>
        <p class="product-color">${product.color}</p>
      </div>
      <form class="purchase" data-purchase novalidate>
        <p class="product-price">${money(product.price)} <span>USD</span></p>
        <fieldset aria-describedby="size-error">
          <legend>Size</legend>
          <div class="size-options">${sizes.map(size => `<label><input type="radio" name="size" value="${size}" required><span>${size}</span></label>`).join('')}</div>
        </fieldset>
        <button type="button" class="size-guide-link" data-open="size-guide" aria-haspopup="dialog">Size guide</button>
        <p id="size-error" class="form-error" role="alert" hidden>Choose a size to add this piece.</p>
        <button class="button-primary" type="submit">Add to bag${arrow()}</button>
      </form>
      <div class="product-notes">
        <p class="product-description">${product.description}</p>
        <details class="product-details"><summary>Materials &amp; care</summary><p>${product.material}</p><p>${product.care}</p></details>
        <details class="product-details"><summary>Fit</summary><p>${product.fit}</p></details>
      </div>
    </div>
  </section>
  <section class="related section-pad" aria-labelledby="related-title">
    <div class="related-title"><h2 id="related-title">From the collection</h2>${inlineLink('/shop/', 'View all')}</div>
    <div class="product-grid">${product.related.map(id => productCard(productById.get(id))).join('')}</div>
  </section>
  ${sizeGuide(product)}
  ${dialog('zoom', 'Product image', `<div class="zoom-frame"><img id="zoom-image" src="${photoPath(product)}" alt="${product.name}, front view" width="1000" height="1250" loading="lazy"></div>`, 'zoom-dialog')}`;
}

const checkout = `<section class="checkout section-pad">
  <div>
    <p class="eyebrow">Demonstration</p>
    <h1>Checkout preview</h1>
    <p>This portfolio store shows how a bag is reviewed. Payment and order placement are unavailable.</p>
    ${inlineLink('/shop/', 'Continue shopping')}
  </div>
  <div class="checkout-summary" id="checkout-summary"><h2>Order summary</h2><p>Loading your bag…</p></div>
</section>`;

async function save(path, html) {
  const file = join(dist, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

const pages = [
  ['index.html', document('home', 'WHYNICKY® — Fault Lines', 'Fault Lines is the Autumn / Winter 2026 capsule from WHYNICKY®. Explore six pieces and the collection lookbook.', home)],
  ['shop/index.html', document('shop', 'Shop Fault Lines — WHYNICKY®', 'Explore the Fault Lines capsule. Moleskin, worn leather, washed denim and sculptural knitwear.', catalog())],
  ['lookbook/index.html', document('lookbook', 'Fault Lines Lookbook — WHYNICKY®', 'The Fault Lines collection photographed among slate slopes and quarry walls.', lookbook)],
  ['about/index.html', document('about', 'About — WHYNICKY®', 'About WHYNICKY®, the concept label behind the Fault Lines capsule.', about)],
  ['store-info/index.html', document('info', 'Store information — WHYNICKY®', 'About the WHYNICKY® portfolio storefront and its demonstration mode.', info)],
  ['checkout/index.html', document('checkout', 'Checkout preview — WHYNICKY®', 'Review your WHYNICKY® bag in demonstration mode.', checkout)],
  ['404.html', document('missing', 'Page not found — WHYNICKY®', 'Page not found.', `<section class="prose-page section-pad"><p class="eyebrow">404</p><h1>Page not found</h1>${inlineLink('/shop/', 'Browse the collection')}</section>`)],
  ...products.map(product => [`product/${product.id}/index.html`, document('product', `${product.name} — WHYNICKY®`, product.description, productPage(product), photoPath(product))]),
];

const assets = [
  'geist.woff2', 'favicon.svg', 'hero.webp', 'hero-mobile.webp', 'campaign.webp',
  'look-rift.webp', 'look-fault.webp', 'look-slag.webp',
  ...products.flatMap(product => ['front', 'back', 'detail'].map(view => photoPath(product, view).split('/').at(-1))),
];
await Promise.all(assets.map(asset => access(join(root, 'src', 'assets', asset))));
await mkdir(dist, { recursive: true });
await Promise.all([
  cp(join(root, 'src'), dist, { recursive: true }),
  ...pages.map(([path, html]) => save(path, html)),
]);
console.log(`Built ${pages.length} pages.`);
