import { access, cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { archivedProducts, categories, featuredProducts, money, photoPath, productById, productPath, products, sizes } from './src/collection.js';
import { sitePath } from './src/site-path.js';
import { campaignFrames, fittingFor, formats, heroFrame, homeFrames, lookbookFrames, studioCampaignFrames } from './editorials.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const origin = (process.env.SITE_ORIGIN || '').replace(/\/+$/, '');
const brand = 'WHYNICKY® STUDIO';
const wordmark = `<img class="wordmark" src="${sitePath('/assets/brand-wordmark.svg')}" width="1484" height="194" alt="">`;
const emblem = `<img class="brand-emblem" src="${sitePath('/assets/brand-emblem.svg')}" width="874" height="435" alt="">`;
const campaign = 'Fault Lines';
const nav = [['/shop/', 'Shop'], ['/lookbook/', 'Lookbook'], ['/about/', 'About']];
const closeIcon = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20"><path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" stroke-width="1.25"/></svg>';
const zoomIcon = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.25"><circle cx="7.5" cy="7.5" r="5"/><path d="m11 11 4 4M5 7.5h5M7.5 5v5"/></svg>';
const link = (url, title, current) => `<a href="${sitePath(url)}"${current ? ' aria-current="page"' : ''}>${title}</a>`;
const image = (path, alt, options = {}) => {
  const { width = 1000, height = 1250, eager = false, extra = '' } = options;
  return `<img src="${sitePath(path)}" alt="${alt}" width="${width}" height="${height}" ${eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'} ${extra}>`;
};
const inlineLink = (url, label) => `<a class="text-link" href="${sitePath(url)}">${label}</a>`;

function editorial([name, alt, , format], { eager = false, sizes = '100vw' } = {}) {
  const [width, height, smallWidth = 720] = formats[format];
  return image(`/assets/${name}.webp`, alt, {
    width, height, eager,
    extra: `srcset="${sitePath(`/assets/${name}-small.webp`)} ${smallWidth}w, ${sitePath(`/assets/${name}.webp`)} ${width}w" sizes="${sizes}"`,
  });
}

function pieceLinks(pieces) {
  return pieces.map(id => {
    const product = productById.get(id);
    return link(productPath(product), product.name);
  }).join('');
}

function fittingFigure(frame, sizes, className = 'fitting') {
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
    <a class="header-brand" href="${sitePath('/')}" aria-label="${brand} home"${page === 'home' ? ' aria-current="page"' : ''}>${emblem}</a>
    <div class="header-actions">
      <button class="header-search" type="button" data-open="search" aria-haspopup="dialog">Search</button>
      <button class="header-bag" type="button" data-open="bag" aria-haspopup="dialog">Bag (<span data-bag-count>0</span>)</button>
    </div>
  </header>`;
}

function footer(page) {
  return `<footer class="site-footer">
    <a href="${sitePath('/')}" class="footer-brand" aria-label="${brand} home">
      <picture>
        <source media="(max-width: 600px)" srcset="${sitePath('/assets/brand-wordmark-stacked.svg')}" width="919" height="923">
        <img src="${sitePath('/assets/brand-wordmark-tall.svg')}" width="1484" height="458" alt="">
      </picture>
    </a>
    <div class="footer-note">
      <span>© 2026 ${brand}</span>
      <div class="footer-actions">
        ${link('/store-info/', 'Store information', page === 'info')}
        <button type="button" data-back-to-top>Back to top</button>
      </div>
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
  return dialog('menu', 'Menu', `<nav class="menu-nav" aria-label="Mobile">${nav.map(([path, label]) => link(path, label, page === label.toLowerCase())).join('')}<button type="button" data-open="search" aria-haspopup="dialog">Search</button></nav>`, 'drawer drawer--menu') +
    dialog('search', 'Search', `<div class="panel-body">
      <label class="visually-hidden" for="product-search">Search the collection</label>
      <div class="search-field"><input id="product-search" type="search" placeholder="Name, material or color" autocomplete="off" maxlength="120" autofocus></div>
      <p class="visually-hidden" role="status" id="search-count"></p><div id="search-results" class="search-results"></div>
    </div>`) +
    dialog('bag', 'Bag', '<div class="panel-body bag-body" id="bag-content"></div><p class="visually-hidden" id="bag-status" role="status"></p>');
}

function document(page, title, description, body, socialImage = '/assets/banner-hero.webp') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="${page === 'home' ? '#282522' : '#ffffff'}">
  <meta name="robots" content="noindex">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${origin}${sitePath(socialImage)}">
  <link rel="icon" type="image/x-icon" sizes="16x16 32x32 48x48" href="${sitePath('/assets/favicon.ico')}">
  <link rel="icon" type="image/svg+xml" sizes="any" href="${sitePath('/assets/favicon.svg')}">
  <link rel="apple-touch-icon" sizes="180x180" href="${sitePath('/assets/apple-touch-icon.png')}">
  <link rel="preload" href="${sitePath('/assets/geist.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${sitePath('/style.css')}">
  <script type="module" src="${sitePath('/store.js')}"></script>
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
    <a href="${sitePath(productPath(product))}" aria-label="${product.name}, ${product.color}, ${money(product.price)}">
      <div class="product-card__image">
        <div class="product-card__views">
          ${image(photoPath(product, 'front', 'card'), '', { ...card, eager: index < 3, extra: 'class="product-card__front"' })}
          ${image(photoPath(product, 'back', 'card'), '', { ...card, extra: 'class="product-card__back"' })}
        </div>
      </div>
      <div class="product-card__label">
        <h3>${product.name}</h3>
        <span>${money(product.price)}</span>
      </div>
    </a>
    <button class="card-view" type="button" data-card-view hidden aria-pressed="false" aria-label="Back view of ${product.name}">Back view</button>
  </article>`;
}

function catalog() {
  return `<section class="catalog section-pad" aria-labelledby="catalog-title">
    <div class="catalog-title">
      <h1 id="catalog-title">Shop</h1>
    </div>
    <div class="catalog-controls">
      <div class="category-controls" role="group" aria-label="Filter by category">
        ${categories.map(([id, label]) => `<button type="button" data-category="${id}" aria-pressed="${id === 'all'}">${label}</button>`).join('')}
      </div>
      <div class="catalog-tools">
        <span id="catalog-count" class="visually-hidden" role="status">${products.length} pieces</span>
        <label class="sort-label"><span class="visually-hidden">Sort products</span>
          <select id="catalog-sort"><option value="featured">Featured</option><option value="price-low">Price, low to high</option><option value="price-high">Price, high to low</option></select>
        </label>
      </div>
    </div>
    <div class="product-grid" id="catalog-grid">${products.map(productCard).join('')}</div>
  </section>`;
}

const home = `<section class="hero" aria-labelledby="hero-title">
    <picture class="hero-scene">
      <source media="(max-aspect-ratio: 6/5)" type="image/avif" srcset="${sitePath('/assets/banner-hero-mobile-720.avif')} 720w, ${sitePath('/assets/banner-hero-mobile.avif')} 941w" sizes="max(100vw, 56.28svh)">
      <source media="(max-aspect-ratio: 6/5)" srcset="${sitePath('/assets/banner-hero-mobile.webp')}">
      <source type="image/avif" srcset="${sitePath('/assets/banner-hero-1200.avif')} 1200w, ${sitePath('/assets/banner-hero.avif')} 1672w" sizes="max(100vw, 177.68svh)">
      ${image('/assets/banner-hero.webp', heroFrame[1], { width: 1672, height: 941, eager: true, extra: 'class="hero-photo"' })}
    </picture>
    <h1 id="hero-title" class="visually-hidden">${campaign} by ${brand}</h1>
    <div class="hero-bottom">
      ${inlineLink('/shop/', 'Shop collection')}
    </div>
  </section>
  <section class="selection section-pad" aria-labelledby="selection-title">
    <div class="section-line">
      <h2 id="selection-title">Selected pieces</h2>
      ${inlineLink('/shop/', `Shop all ${products.length}`)}
    </div>
    <div class="product-grid">${featuredProducts.map(productCard).join('')}</div>
  </section>
  <section class="campaign-spread section-pad" id="campaign" aria-labelledby="campaign-title">
    <div class="section-line fittings-heading">
      <h2 id="campaign-title">${campaign}</h2>
      ${inlineLink('/lookbook/', 'View lookbook')}
    </div>
    <div class="campaign-images">
      ${fittingFigure(campaignFrames[0], '(max-width: 760px) 100vw, 42vw', 'campaign-shot')}
      ${fittingFigure(campaignFrames[1], '(max-width: 760px) 100vw, 54vw', 'campaign-shot')}
    </div>
  </section>
  <section class="studio-campaign section-pad" id="studio-campaign" aria-labelledby="studio-campaign-title">
    <div class="section-line"><h2 id="studio-campaign-title">Studio campaign</h2></div>
    <div class="studio-campaign-images">
      ${editorial(studioCampaignFrames[0], { sizes: '(max-width: 760px) calc(100vw - 32px), 35vw' })}
      ${editorial(studioCampaignFrames[1], { sizes: '(max-width: 760px) calc(100vw - 32px), 65vw' })}
    </div>
  </section>
  <section class="campaign-spotlight" aria-labelledby="after-hours-title">
    <picture>
      <source media="(max-width: 760px)" srcset="${sitePath(`/assets/${homeFrames[0][0]}-mobile.webp`)}">
      ${editorial(homeFrames[0])}
    </picture>
    <div class="spotlight-copy">
      <h2 id="after-hours-title">After Hours</h2>
      ${inlineLink('/lookbook/#after-hours', 'View lookbook')}
      <div class="spotlight-pieces">${pieceLinks(homeFrames[0][2])}</div>
    </div>
  </section>
  <section class="home-spread section-pad" aria-labelledby="fittings-title">
    <div class="section-line fittings-heading">
      <h2 id="fittings-title">Studio fittings</h2>
      ${inlineLink('/lookbook/#fittings', 'View lookbook')}
    </div>
    <div class="spread-images">
      ${homeFrames.slice(1).map((frame, index) => fittingFigure(frame, index === 0 ? '(max-width: 760px) 100vw, 50vw' : '(max-width: 760px) 50vw, 25vw')).join('')}
    </div>
  </section>`;

const lookbook = `<section class="lookbook section-pad" aria-labelledby="lookbook-title">
    <div class="lookbook-heading"><h1 id="lookbook-title">Lookbook</h1></div>
    <div class="lookbook-grid">
      ${lookbookFrames.map((frame, index) => {
        const [name, alt, pieces] = frame;
        const anchor = name === 'night-01' ? ' id="after-hours"' : name === 'fit-a' ? ' id="fittings"' : '';
        return `<figure class="editorial-frame"${anchor}>
          <a class="lookbook-tile" href="${sitePath(`/assets/${name}.webp`)}" data-look-frame="${index}" aria-label="Open photograph ${index + 1}. ${alt}">
            ${editorial(frame, { eager: index === 0, sizes: '(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw' })}
          </a>
          ${pieces.length ? `<figcaption>${pieceLinks(pieces)}</figcaption>` : ''}
        </figure>`;
      }).join('')}
    </div>
    <div class="lookbook-end">${inlineLink('/shop/', 'Shop collection')}</div>
  </section>
  <dialog id="look-view" class="zoom-dialog look-view" aria-label="Lookbook viewer">
    <button class="icon-button look-view-close" type="button" data-close aria-label="Close lookbook viewer" autofocus>${closeIcon}</button>
    <img class="look-view-image" alt="">
    <div class="look-view-controls">
      <button type="button" data-look-step="-1" aria-label="Previous photograph">Previous</button>
      <div data-look-pieces aria-label="Pieces in this look"></div>
      <button type="button" data-look-step="1" aria-label="Next photograph">Next</button>
    </div>
    <span class="visually-hidden" data-look-status role="status"></span>
  </dialog>`;

const about = `<section class="about section-pad" aria-labelledby="about-title">
    <div class="about-inner">
      <h1 id="about-title"><span class="visually-hidden">About ${brand}</span>${wordmark}</h1>
      <div class="about-copy">
        <p>WHYNICKY® STUDIO is a concept studio for menswear and unisex clothing. Fault Lines starts with familiar pieces and changes where they bend, fold and meet the body.</p>
        <p>Short jackets leave room for wide denim. Curved seams pull the leg forward, while worn leather and heavy cotton hold the shape of a sleeve. The contrast in length and weight gives each layer a purpose.</p>
      </div>
      <a class="text-link" href="${sitePath('/shop/')}">Explore the collection</a>
    </div>
  </section>`;

const info = `<section class="prose-page section-pad">
    <h1>Store information</h1>
    <h2>Portfolio storefront</h2>
    <p>${brand} is a concept label. Product designs, prices and measurements are part of this demonstration. Ordering, payment and shipping are unavailable.</p>
    <h2>Privacy</h2>
    <p>The bag uses local storage in this browser to remember the pieces you add. You can clear it by removing the pieces or clearing this site’s browser data.</p>
    ${inlineLink('/shop/', 'Return to shop')}
  </section>`;

function sizeGuide(product) {
  const isBottom = product.category === 'bottoms';
  return dialog('size-guide', 'Size guide', `<div class="panel-body size-guide">
    <table><caption class="visually-hidden">Garment measurements for ${product.name}</caption>
      <thead><tr><th scope="col">Size</th><th scope="col">${isBottom ? 'Waist' : 'Chest'} (cm)</th><th scope="col">${isBottom ? 'Inseam' : 'Length'} (cm)</th></tr></thead>
      <tbody>${product.measurements.map(([first, second], index) => `<tr><th scope="row">${sizes[index]}</th><td>${first}</td><td>${second}</td></tr>`).join('')}</tbody>
    </table>
    <p>${product.fit}</p>
  </div>`, 'drawer drawer--small');
}

function productPage(product) {
  const fitting = fittingFor(product);
  const views = [
    { id: 'front', label: 'Front', path: photoPath(product) },
    { id: 'back', label: 'Back', path: photoPath(product, 'back') },
  ];
  if (fitting) {
    const [name, alt, , format] = fitting;
    const [width, height] = formats[format];
    views.push({ id: 'worn', label: 'On model', path: `/assets/${name}.webp`, alt, width, height });
  }
  if (product.detail || fitting) views.push({ id: 'detail', label: 'Detail', path: photoPath(product, 'detail') });

  const paired = (fitting?.[2] || []).filter(id => id !== product.id);
  const related = product.related.filter(id => !paired.includes(id));
  return `<section class="product-page section-pad" data-product-page="${product.id}" aria-labelledby="product-title">
    <div class="product-breadcrumb">${inlineLink('/shop/', 'Back to shop')}</div>
    <div class="product-layout">
      <div class="product-gallery" aria-label="Product gallery">
        <button class="gallery-main" type="button" data-open="zoom" aria-haspopup="dialog" aria-label="Enlarge product image">
          ${views.map(({ id, label, path, alt, width, height }, index) => image(path, alt || `${product.name}, ${label.toLowerCase()} view`, {
            width, height, eager: index === 0,
            extra: `data-gallery-image="${id}"${index === 0 ? ' class="is-visible"' : ' aria-hidden="true"'}`,
          })).join('')}
          <span class="zoom-mark" aria-hidden="true">${zoomIcon}</span>
        </button>
        <div class="gallery-controls" role="group" aria-label="Choose product view">
          ${views.map(({ id, label }, index) => `<button class="gallery-option" type="button" data-gallery-view="${id}" aria-pressed="${index === 0}">${label}</button>`).join('')}
        </div>
        <span class="visually-hidden" id="gallery-status" role="status"></span>
      </div>
      <div class="product-intro">
        <h1 id="product-title">${product.name}</h1>
        <p class="product-color">${product.color}</p>
      </div>
      ${product.archived ? `<div class="purchase"><p>This piece is from the previous collection.</p>${inlineLink('/shop/', 'Explore current pieces')}</div>` : `<form class="purchase" data-purchase novalidate>
        <p class="product-price">${money(product.price)}</p>
        <fieldset aria-describedby="size-error">
          <legend>Size</legend>
          <div class="size-options">${sizes.map(size => `<label><input type="radio" name="size" value="${size}" required><span>${size}</span></label>`).join('')}</div>
        </fieldset>
        <button type="button" class="size-guide-link" data-open="size-guide" aria-haspopup="dialog">Size guide</button>
        <p id="size-error" class="form-error" role="alert" hidden>Choose a size to add this piece.</p>
        <button class="button-primary" type="submit">Add to bag</button>
      </form>`}
      <div class="product-notes">
        <p class="product-description">${product.description}</p>
        <details class="product-details"><summary>Materials &amp; care</summary><p>${product.material}</p><p>${product.care}</p></details>
        <details class="product-details"><summary>Fit</summary><p>${product.fit}</p></details>
      </div>
    </div>
  </section>
  ${paired.length ? `<section class="product-pairing section-pad" aria-labelledby="paired-title">
    <div class="related-title"><h2 id="paired-title">Wear it with</h2></div>
    <div class="product-grid">${paired.map((id, index) => productCard(productById.get(id), index + 3)).join('')}</div>
  </section>` : ''}
  ${related.length ? `<section class="related section-pad" aria-labelledby="related-title">
    <div class="related-title"><h2 id="related-title">From the collection</h2>${inlineLink('/shop/', 'View all')}</div>
    <div class="product-grid">${related.map((id, index) => productCard(productById.get(id), index + 3)).join('')}</div>
  </section>` : ''}
  ${product.archived ? '' : sizeGuide(product)}
  ${dialog('zoom', 'Product image', `<div class="zoom-frame"><img id="zoom-image" src="${sitePath(photoPath(product))}" alt="${product.name}, front view" width="1000" height="1250" loading="lazy"></div>`, 'zoom-dialog')}`;
}

const checkout = `<section class="checkout section-pad">
  <div>
    <h1>Checkout preview</h1>
    <p>This is a demo. You cannot place an order.</p>
    ${inlineLink('/shop/', 'Continue shopping')}
  </div>
  <div class="checkout-summary" id="checkout-summary"><h2>Order summary</h2></div>
</section>`;

async function save(path, html) {
  const file = join(dist, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

const pages = [
  ['index.html', document('home', `${brand} | Fault Lines`, 'Fault Lines is the Autumn / Winter 2026 collection of menswear and unisex clothing from WHYNICKY® STUDIO.', home)],
  ['shop/index.html', document('shop', `Shop Fault Lines | ${brand}`, 'Explore 24 pieces in washed denim, worn leather, waxed canvas and heavy knits.', catalog())],
  ['lookbook/index.html', document('lookbook', `Lookbook | ${brand}`, `See the shapes, fabrics and fits of the Fault Lines collection in ${lookbookFrames.length} editorial photographs.`, lookbook)],
  ['about/index.html', document('about', `About | ${brand}`, 'Meet the concept studio for menswear and unisex clothing behind Fault Lines.', about)],
  ['store-info/index.html', document('info', `Store information | ${brand}`, 'About the portfolio storefront and its demonstration mode.', info)],
  ['checkout/index.html', document('checkout', `Checkout preview | ${brand}`, 'Review your bag in demonstration mode.', checkout)],
  ['404.html', document('missing', `Page not found | ${brand}`, 'Page not found.', `<section class="prose-page section-pad"><h1>Page not found</h1>${inlineLink('/shop/', 'Back to shop')}</section>`)],
  ...[...products, ...archivedProducts].map(product => [`product/${product.id}/index.html`, document('product', `${product.name} | ${brand}`, product.description, productPage(product), photoPath(product))]),
];

const assets = [
  'geist.woff2', 'geist-license.txt', 'brand-emblem.svg', 'brand-wordmark.svg', 'brand-wordmark-tall.svg', 'brand-wordmark-stacked.svg',
  'favicon.svg', 'favicon.ico', 'apple-touch-icon.png',
  'banner-hero.avif', 'banner-hero-1200.avif', 'banner-hero-mobile.avif', 'banner-hero-mobile-720.avif', 'banner-hero-mobile.webp', `${homeFrames[0][0]}-mobile.webp`,
  ...[...lookbookFrames, ...homeFrames, ...campaignFrames, ...studioCampaignFrames]
    .flatMap(([name]) => [`${name}.webp`, `${name}-small.webp`]),
  ...[...products, ...archivedProducts].flatMap(product => [
    photoPath(product), photoPath(product, 'back'), photoPath(product, 'front', 'card'), photoPath(product, 'back', 'card'),
    ...(product.detail || fittingFor(product) ? [photoPath(product, 'detail')] : []),
  ].map(path => path.split('/').at(-1))),
  ...products.map(product => `${fittingFor(product)[0]}.webp`),
];
const uniqueAssets = [...new Set(assets)];
await Promise.all(uniqueAssets.map(asset => access(join(root, 'src', 'assets', asset))));
await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, 'assets'), { recursive: true });
await Promise.all([
  ...['style.css', 'store.js', 'collection.js', 'new-pieces.js', 'site-path.js'].map(file => cp(join(root, 'src', file), join(dist, file))),
  ...uniqueAssets.map(file => cp(join(root, 'src', 'assets', file), join(dist, 'assets', file))),
  ...pages.map(([path, html]) => save(path, html)),
]);
console.log(`Built ${pages.length} pages.`);
