import { access, cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { archivedProducts, categories, featuredProducts, money, photoPath, productById, productPath, products, sizes } from './src/collection.js';
import { formats, homeFrames, lookbookFrames } from './editorials.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const origin = process.env.SITE_ORIGIN || '';
const brand = 'WHYNICKY® STUDIO';
const wordmark = `<span class="wordmark" aria-hidden="true"><span class="wordmark-name">WHYNICKY<sup>®</sup></span> <span class="wordmark-studio">STUDIO</span></span>`;
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
const inlineLink = (url, label, direction = 'right') => `<a class="text-link" href="${url}">${label}${arrow(direction)}</a>`;

function editorial([name, alt, , format], { eager = false, sizes = '100vw' } = {}) {
  const [width, height] = formats[format];
  return image(`/assets/${name}.webp`, alt, {
    width, height, eager,
    extra: `srcset="/assets/${name}-small.webp 720w, /assets/${name}.webp ${width}w" sizes="${sizes}"`,
  });
}

function pieceLinks(pieces) {
  return pieces.map(id => {
    const product = productById.get(id);
    return link(productPath(product), product.name);
  }).join('<span aria-hidden="true">/</span>');
}

function editorialFigure(frame, className = '', sizes) {
  const [, , pieces] = frame;
  return `<figure class="editorial-frame ${className}">
    ${editorial(frame, { sizes })}
    <figcaption>${pieceLinks(pieces)}</figcaption>
  </figure>`;
}

function header(page) {
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header${page === 'home' ? ' site-header--over-hero' : ''}" id="top">
    <nav class="header-nav" aria-label="Main">${nav.map(([path, label]) => link(path, label, page === label.toLowerCase() || (label === 'Shop' && page === 'product'))).join('')}</nav>
    <button class="mobile-menu" type="button" data-open="menu" aria-haspopup="dialog" aria-label="Menu">
      <span aria-hidden="true" class="menu-lines"></span><span>Menu</span>
    </button>
    <a class="header-brand" href="/" aria-label="${brand} home"${page === 'home' ? ' aria-current="page"' : ''}>${wordmark}</a>
    <div class="header-actions">
      <button class="header-search" type="button" data-open="search" aria-haspopup="dialog">Search</button>
      <button class="header-bag" type="button" data-open="bag" aria-haspopup="dialog">Bag (<span data-bag-count>0</span>)</button>
    </div>
  </header>`;
}

function footer(page) {
  return `<footer class="site-footer">
    <div class="footer-main">
      <nav class="footer-nav" aria-label="Footer">${nav.map(([path, label]) => link(path, label, page === label.toLowerCase())).join('')}</nav>
      <button class="footer-top text-link" type="button" data-back-to-top>Back to top${arrow('up')}</button>
    </div>
    <div class="footer-mark"><a href="/" class="footer-brand" aria-label="${brand} home">${wordmark}</a></div>
    <div class="footer-note">
      <span>© 2026 ${brand}</span>
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

function document(page, title, description, body, socialImage = '/assets/studio-stage.webp') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="${page === 'home' ? '#0e1725' : '#ffffff'}">
  <meta name="robots" content="noindex">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${origin}${socialImage}">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
  <link rel="preload" href="/assets/anton.ttf" as="font" type="font/ttf" crossorigin>
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

function productCard(product, index) {
  const card = { width: 520, height: 650 };
  return `<article class="product-card" data-product="${product.id}">
    <a href="${productPath(product)}" aria-label="${product.name}, ${product.color}, ${money(product.price)}">
      <div class="product-card__image">
        <div class="product-card__turn">
          ${image(photoPath(product, 'front', 'card'), '', { ...card, eager: index < 3, extra: 'class="product-card__front"' })}
          ${image(photoPath(product, 'back', 'card'), '', { ...card, extra: 'class="product-card__back"' })}
        </div>
      </div>
      <div class="product-card__label">
        <div><h3>${product.name}</h3><p>${product.color}</p></div>
        <span>${money(product.price)}</span>
      </div>
    </a>
    <button class="card-view" type="button" data-card-view hidden aria-pressed="false" aria-label="Back view of ${product.name}">
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 8a5 5 0 1 1-1.4-3.5L14 7M14 3v4h-4" stroke="currentColor" stroke-width="1.2"/></svg>
      <span>Back view</span>
    </button>
  </article>`;
}

function catalog() {
  return `<section class="catalog section-pad" aria-labelledby="catalog-title">
    <div class="catalog-title">
      <h1 id="catalog-title">Shop</h1>
      <p class="catalog-caption">${campaign} · ${season}</p>
    </div>
    <div class="catalog-controls">
      <div class="category-controls" role="group" aria-label="Filter by category">
        ${categories.map(([id, label]) => `<button type="button" data-category="${id}" aria-pressed="${id === 'all'}">${label}</button>`).join('')}
      </div>
      <div class="catalog-tools">
        <span id="catalog-count" role="status">${products.length} pieces</span>
        <label class="sort-label"><span class="visually-hidden">Sort products</span>
          <select id="catalog-sort"><option value="featured">Featured</option><option value="price-low">Price, low to high</option><option value="price-high">Price, high to low</option></select>
        </label>
      </div>
    </div>
    <div class="product-grid" id="catalog-grid">${products.map(productCard).join('')}</div>
  </section>`;
}

const home = `<section class="hero" aria-labelledby="hero-title">
    <div class="hero-scene">
      <picture class="hero-distance">
        <source media="(max-width: 760px)" srcset="/assets/studio-stage-mobile.webp">
        ${image('/assets/studio-stage.webp', 'The Rift Jacket and Drift Denim hang in a shaft of blue studio light.', { width: 1672, height: 941, eager: true, extra: 'class="hero-photo"' })}
      </picture>
      <div class="hero-plane" aria-hidden="true"></div>
    </div>
    <h1 id="hero-title" class="hero-wordmark"><span class="visually-hidden">${brand}</span>${wordmark}</h1>
    <div class="hero-bottom">
      ${inlineLink('/shop/', 'Shop collection', 'diagonal')}
    </div>
  </section>
  <section class="selection section-pad" aria-labelledby="selection-title">
    <div class="section-line">
      <h2 id="selection-title">Selected pieces</h2>
      ${inlineLink('/shop/', `Shop all ${products.length}`)}
    </div>
    <div class="product-grid">${featuredProducts.map(productCard).join('')}</div>
  </section>
  <section class="campaign-spotlight" aria-labelledby="after-hours-title">
    ${editorial(homeFrames[0])}
    <div class="spotlight-copy">
      <p class="eyebrow">${season}</p>
      <h2 id="after-hours-title">After Hours</h2>
      ${inlineLink('/lookbook/#after-hours', 'View lookbook', 'diagonal')}
    </div>
  </section>
  <section class="home-spread section-pad" aria-labelledby="fittings-title">
    <div class="section-line">
      <h2 id="fittings-title">Studio fittings</h2>
      ${inlineLink('/lookbook/#fittings', 'View lookbook', 'diagonal')}
    </div>
    <div class="spread-images">
      ${homeFrames.slice(1).map(frame => editorialFigure(frame, '', '(max-width: 760px) 55vw, 33vw')).join('')}
    </div>
  </section>`;

const lookbook = `<section class="lookbook section-pad" aria-labelledby="lookbook-title">
    <div class="lookbook-heading"><h1 id="lookbook-title">Lookbook</h1><p>${campaign} · ${season}</p></div>
    <div class="lookbook-grid">
      ${lookbookFrames.map((frame, index) => {
        const [name, alt, pieces] = frame;
        const anchor = name === 'night-01' ? ' id="after-hours"' : name === 'fit-a' ? ' id="fittings"' : '';
        return `<figure class="editorial-frame"${anchor}>
          <a class="lookbook-tile" href="/assets/${name}.webp" data-look-frame="${index}" aria-label="Open photograph ${index + 1}. ${alt}">
            ${editorial(frame, { eager: index === 0, sizes: '(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw' })}
          </a>
          <figcaption>${pieceLinks(pieces)}</figcaption>
        </figure>`;
      }).join('')}
    </div>
    <div class="lookbook-end">${inlineLink('/shop/', 'Shop the collection', 'diagonal')}</div>
  </section>
  ${dialog('look-view', 'Lookbook photograph', `<div class="look-view-body">
    <img class="look-view-image" alt="">
    <div class="look-view-controls">
      <button class="icon-button" type="button" data-look-step="-1" aria-label="Previous photograph">${arrow('left')}</button>
      <div class="look-view-meta"><span data-look-status role="status"></span><div data-look-pieces aria-label="Pieces in this look"></div></div>
      <button class="icon-button" type="button" data-look-step="1" aria-label="Next photograph">${arrow()}</button>
    </div>
  </div>`, 'zoom-dialog look-view')}`;

const about = `<section class="about section-pad" aria-labelledby="about-title">
    <div class="about-inner">
      <header><p class="eyebrow">About</p><h1 id="about-title"><span class="visually-hidden">${brand}</span>${wordmark}</h1></header>
      <div class="about-copy">
        <p>WHYNICKY® STUDIO is a concept studio for menswear and unisex clothing. We start with how a piece sits on the body. A jacket can stop at the waist while its sleeves fall past the wrist. A pair of jeans can stay wide through the knee, then bend inward as the hem meets the shoe. The point is to make room for a shape that feels particular to the person wearing it.</p>
        <p>In Fault Lines, the weight of a fabric guides the cut. Waxed cotton holds the shoulder of a long coat. Washed denim softens at the places it folds. A dense wool sleeve draws into a ribbed cuff. The seams that give these pieces their volume are often visible, so you can follow the way a garment is put together.</p>
        <p>Each piece can change the balance of the rest of an outfit. Wear a cropped overshirt over a long jersey layer, or pull a heavy knit down over broad trousers. A fitted shoulder on one person may sit low on another. We leave room for both, and for the way a garment changes with wear.</p>
      </div>
      <a class="text-link" href="/shop/">Explore the collection</a>
    </div>
  </section>`;

const info = `<section class="prose-page section-pad">
    <p class="eyebrow">${brand}</p><h1>Store information</h1>
    <h2>Portfolio storefront</h2>
    <p>${brand} is a concept label. Product designs, prices and measurements are part of this demonstration. Ordering, payment and shipping are unavailable.</p>
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
  const views = [['front', 'Front'], ['back', 'Back']];
  if (product.detail) views.push(['detail', 'Detail']);
  if (product.worn) views.push(['worn', 'On model', `/assets/${product.worn}.webp`]);
  return `<section class="product-page section-pad" data-product-page="${product.id}" aria-labelledby="product-title">
    <div class="product-breadcrumb">${inlineLink('/shop/', 'Collection', 'left')}</div>
    <div class="product-layout">
      <div class="product-gallery" aria-label="Product gallery">
        <button class="gallery-main" type="button" data-open="zoom" aria-haspopup="dialog" aria-label="Enlarge product image">
          ${views.map(([id, label, path], index) => image(path || photoPath(product, id), `${product.name}, ${id === 'worn' ? 'on model' : label.toLowerCase() + ' view'}`, { eager: index === 0, extra: `data-gallery-image="${id}"${index === 0 ? ' class="is-visible"' : ' aria-hidden="true"'}` })).join('')}
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
      ${product.archived ? `<div class="purchase"><p>This piece is from the previous collection.</p>${inlineLink('/shop/', 'Explore current pieces')}</div>` : `<form class="purchase" data-purchase novalidate>
        <p class="product-price">${money(product.price)} <span>USD</span></p>
        <fieldset aria-describedby="size-error">
          <legend>Size</legend>
          <div class="size-options">${sizes.map(size => `<label><input type="radio" name="size" value="${size}" required><span>${size}</span></label>`).join('')}</div>
        </fieldset>
        <button type="button" class="size-guide-link" data-open="size-guide" aria-haspopup="dialog">Size guide</button>
        <p id="size-error" class="form-error" role="alert" hidden>Choose a size to add this piece.</p>
        <button class="button-primary" type="submit">Add to bag${arrow()}</button>
      </form>`}
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
  ${product.archived ? '' : sizeGuide(product)}
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
  ['index.html', document('home', `${brand} | Fault Lines`, 'Fault Lines is the Autumn / Winter 2026 collection of menswear and unisex clothing from WHYNICKY® STUDIO.', home)],
  ['shop/index.html', document('shop', `Shop Fault Lines | ${brand}`, 'Explore 24 pieces in washed denim, worn leather, waxed canvas and heavy knits.', catalog())],
  ['lookbook/index.html', document('lookbook', `Lookbook | ${brand}`, 'See the shapes, fabrics and fits of the Fault Lines collection in 26 editorial photographs.', lookbook, '/assets/night-01.webp')],
  ['about/index.html', document('about', `About | ${brand}`, 'Meet the concept studio for menswear and unisex clothing behind Fault Lines.', about)],
  ['store-info/index.html', document('info', `Store information | ${brand}`, 'About the portfolio storefront and its demonstration mode.', info)],
  ['checkout/index.html', document('checkout', `Checkout preview | ${brand}`, 'Review your bag in demonstration mode.', checkout)],
  ['404.html', document('missing', `Page not found | ${brand}`, 'Page not found.', `<section class="prose-page section-pad"><p class="eyebrow">404</p><h1>Page not found</h1>${inlineLink('/shop/', 'Browse the collection')}</section>`)],
  ...[...products, ...archivedProducts].map(product => [`product/${product.id}/index.html`, document('product', `${product.name} | ${brand}`, product.description, productPage(product), photoPath(product))]),
];

const assets = [
  'geist.woff2', 'geist-license.txt', 'anton.ttf', 'anton-OFL.txt', 'favicon.svg', 'studio-stage.webp', 'studio-stage-mobile.webp',
  ...[...lookbookFrames, ...homeFrames]
    .flatMap(([name]) => [`${name}.webp`, `${name}-small.webp`]),
  ...[...products, ...archivedProducts].flatMap(product => [
    photoPath(product), photoPath(product, 'back'), photoPath(product, 'front', 'card'), photoPath(product, 'back', 'card'),
    ...(product.detail ? [photoPath(product, 'detail')] : []),
  ].map(path => path.split('/').at(-1))),
];
const uniqueAssets = [...new Set(assets)];
await Promise.all(uniqueAssets.map(asset => access(join(root, 'src', 'assets', asset))));
await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, 'assets'), { recursive: true });
await Promise.all([
  ...['style.css', 'store.js', 'collection.js', 'new-pieces.js'].map(file => cp(join(root, 'src', file), join(dist, file))),
  ...uniqueAssets.map(file => cp(join(root, 'src', 'assets', file), join(dist, 'assets', file))),
  ...pages.map(([path, html]) => save(path, html)),
]);
console.log(`Built ${pages.length} pages.`);
