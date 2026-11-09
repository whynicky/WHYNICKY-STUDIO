import { categories, featuredProducts, money, photoPath, productById, productPath, products, sizes } from './collection.js';

const storageKey = 'whynicky-bag-v1';
const maxQuantity = 99;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const bagContent = document.querySelector('#bag-content');
const bagStatus = document.querySelector('#bag-status');
const checkoutSummary = document.querySelector('#checkout-summary');
const searchInput = document.querySelector('#product-search');

let storageAvailable = true;
let bag = readBag();
let activeDialog;
let returnFocus;

function readBag() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(saved)) return [];
    const lines = new Map();
    for (const item of saved) {
      if (!item || !productById.has(item.id) || !sizes.includes(item.size)) continue;
      if (!Number.isInteger(item.quantity) || item.quantity < 1) continue;
      const key = `${item.id}:${item.size}`;
      const quantity = Math.min(maxQuantity, item.quantity + (lines.get(key)?.quantity || 0));
      lines.set(key, { id: item.id, size: item.size, quantity });
    }
    return [...lines.values()];
  } catch (error) {
    if (!(error instanceof SyntaxError)) storageAvailable = false;
    return [];
  }
}

function updateBag(id, size, action) {
  if (storageAvailable) {
    const saved = readBag();
    if (storageAvailable) bag = saved;
  }
  const index = bag.findIndex(line => line.id === id && line.size === size);
  const line = bag[index];

  if (action === 'add') {
    if (line) line.quantity = Math.min(maxQuantity, line.quantity + 1);
    else bag.push({ id, size, quantity: 1 });
  } else if (line && action === 'remove') {
    bag.splice(index, 1);
  } else if (line && action === 'increase') {
    line.quantity = Math.min(maxQuantity, line.quantity + 1);
  } else if (line && action === 'decrease') {
    line.quantity = Math.max(1, line.quantity - 1);
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(bag));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  renderBag();
}

function bagLine(line, interactive) {
  const product = productById.get(line.id);
  const variant = `${product.name}, size ${line.size}`;
  return `<article class="bag-line" data-line="${line.id}:${line.size}">
    <a href="${productPath(product)}" tabindex="-1" aria-hidden="true"><img src="${photoPath(product, 'front', 'card')}" width="80" height="100" alt=""></a>
    <div>
      <h3><a href="${productPath(product)}">${product.name}</a></h3>
      <p>${product.color} · Size ${line.size}</p>
      ${interactive ? `<div class="bag-line__controls">
        <div class="quantity" role="group" aria-label="Quantity for ${variant}">
          <button type="button" data-bag-action="decrease" aria-label="Decrease quantity of ${variant}" ${line.quantity === 1 ? 'disabled' : ''}>−</button>
          <output aria-label="Quantity">${line.quantity}</output>
          <button type="button" data-bag-action="increase" aria-label="Increase quantity of ${variant}" ${line.quantity === maxQuantity ? 'disabled' : ''}>+</button>
        </div>
        <button type="button" class="bag-line__remove" data-bag-action="remove" aria-label="Remove ${variant}">Remove</button>
      </div>` : `<p>Quantity ${line.quantity}</p>`}
    </div>
    <strong>${money(product.price * line.quantity)}</strong>
  </article>`;
}

function renderBag() {
  const count = bag.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = bag.reduce((sum, line) => sum + line.quantity * productById.get(line.id).price, 0);
  for (const label of document.querySelectorAll('[data-bag-count]')) label.textContent = count;
  document.querySelector('#bag-title').textContent = `Bag (${count})`;
  const empty = `<div class="empty-state"><p>Your bag is empty.</p><a class="text-link" href="/shop/">Explore the collection</a></div>`;
  const subtotalRow = `<p class="bag-subtotal"><span>Subtotal</span><span>${money(subtotal)} USD</span></p>`;
  bagContent.innerHTML = count
    ? `<div>${bag.map(line => bagLine(line, true)).join('')}</div>
      <div class="bag-total">${subtotalRow}
        <p class="muted">Demonstration store. Payment is unavailable.</p>
        ${storageAvailable ? '' : '<p class="muted">This browser is unable to save your bag after reload.</p>'}
        <a class="button-primary" href="/checkout/">Checkout preview <span aria-hidden="true">↗</span></a>
      </div>`
    : empty;
  if (checkoutSummary) {
    checkoutSummary.innerHTML = '<h2>Order summary</h2>' +
      (count ? `${bag.map(line => bagLine(line, false)).join('')}<div class="bag-total">${subtotalRow}</div>` : empty);
  }
}

function announceBag(message) {
  bagStatus.textContent = '';
  requestAnimationFrame(() => { bagStatus.textContent = message; });
}

function renderSearch() {
  const query = searchInput.value.toLowerCase().trim();
  const words = query.split(/\s+/).filter(Boolean);
  const matches = words.length ? products.filter(product => {
    const category = categories.find(([id]) => id === product.category)[1];
    const keywords = [product.name, product.color, product.material, product.description, category].join(' ').toLowerCase();
    return words.every(word => keywords.includes(word));
  }) : featuredProducts.slice(0, 4);
  document.querySelector('#search-count').textContent = query
    ? `${matches.length} ${matches.length === 1 ? 'piece' : 'pieces'} found`
    : 'Selected pieces';
  document.querySelector('#search-results').innerHTML = matches.length
    ? matches.map(product => `<a class="search-item" href="${productPath(product)}">
        <img src="${photoPath(product, 'front', 'card')}" width="64" height="80" alt="" loading="lazy">
        <span><strong>${product.name}</strong><small>${product.color}</small></span><span>${money(product.price)}</span>
      </a>`).join('')
    : '<div class="empty-state"><p>Try a name, material or color such as “denim” or “stone”.</p><button type="button" class="text-link" data-clear-search>Clear search</button></div>';
}

function openDialog(id, opener) {
  const dialog = document.getElementById(id);
  if (!dialog || activeDialog === dialog) return;
  if (activeDialog) activeDialog.close();
  else returnFocus = opener;
  if (id === 'search') renderSearch();
  activeDialog = dialog;
  dialog.showModal();
  if (id === 'search') searchInput.focus();
}

function closeDialog() {
  if (!activeDialog) return;
  activeDialog.close();
  activeDialog = undefined;
  returnFocus?.focus({ preventScroll: true });
  returnFocus = undefined;
}

for (const dialog of document.querySelectorAll('dialog')) {
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeDialog();
  });
  let backdropStart = false;
  dialog.addEventListener('pointerdown', event => { backdropStart = event.target === dialog; });
  dialog.addEventListener('click', event => {
    if (event.target === dialog && backdropStart) closeDialog();
    backdropStart = false;
  });
}

document.addEventListener('click', event => {
  const opener = event.target.closest('[data-open]');
  if (opener) openDialog(opener.dataset.open, opener);
  if (event.target.closest('[data-close]')) closeDialog();
  if (event.target.closest('[data-back-to-top]')) {
    document.querySelector('#main').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  if (event.target.closest('[data-clear-search]')) {
    searchInput.value = '';
    renderSearch();
    searchInput.focus();
  }
});

searchInput.addEventListener('input', renderSearch);
bagContent.addEventListener('click', event => {
  const control = event.target.closest('[data-bag-action]');
  if (!control) return;
  const action = control.dataset.bagAction;
  const key = control.closest('[data-line]').dataset.line;
  const [id, size] = key.split(':');
  updateBag(id, size, action);
  const line = bag.find(item => item.id === id && item.size === size);
  const name = productById.get(id).name;
  announceBag(line ? `${name}, size ${size}, quantity ${line.quantity}.` : `${name}, size ${size}, removed.`);
  const row = [...bagContent.querySelectorAll('[data-line]')].find(node => node.dataset.line === key);
  const next = row?.querySelector(`[data-bag-action="${action}"]:enabled`) ||
    row?.querySelector('[data-bag-action]:enabled') ||
    bagContent.querySelector('[data-bag-action="remove"], .empty-state a');
  next?.focus({ preventScroll: true });
});
window.addEventListener('storage', event => {
  if (event.key !== storageKey && event.key !== null) return;
  bag = readBag();
  renderBag();
});
window.addEventListener('pageshow', event => {
  if (!event.persisted) return;
  if (storageAvailable) bag = readBag();
  renderBag();
});
renderBag();

const cardsNearViewport = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const card = entry.target;
    cardsNearViewport.unobserve(card);
    const images = [...card.querySelectorAll('.product-card__turn img')];
    Promise.all(images.map(image => image.decode())).then(() => {
      card.setAttribute('data-views-ready', '');
      card.querySelector('[data-card-view]').hidden = false;
    }).catch(() => {
      // A failed back image leaves the front view usable.
    });
  }
}, { rootMargin: '360px 0px' });
for (const card of document.querySelectorAll('.product-card')) cardsNearViewport.observe(card);

document.addEventListener('click', event => {
  const control = event.target.closest('[data-card-view]');
  if (!control) return;
  const card = control.closest('[data-product]');
  const showBack = card.dataset.cardSide !== 'back';
  const nextView = showBack ? 'Front view' : 'Back view';
  card.dataset.cardSide = showBack ? 'back' : 'front';
  control.setAttribute('aria-pressed', String(showBack));
  control.setAttribute('aria-label', `${nextView} of ${productById.get(card.dataset.product).name}`);
  control.querySelector('span').textContent = nextView;
});

const grid = document.querySelector('#catalog-grid');
if (grid) {
  const filters = [...document.querySelectorAll('[data-category]')];
  const sortSelect = document.querySelector('#catalog-sort');
  const cards = new Map([...grid.children].map(card => [card.dataset.product, card]));
  const query = new URLSearchParams(location.search);
  let category = categories.some(([id]) => id === query.get('category')) ? query.get('category') : 'all';
  let sort = ['price-low', 'price-high'].includes(query.get('sort')) && sortSelect ? query.get('sort') : 'featured';
  if (sortSelect) sortSelect.value = sort;

  function updateCatalog() {
    const order = [...products];
    if (sort !== 'featured') order.sort((first, second) => sort === 'price-low' ? first.price - second.price : second.price - first.price);
    let visibleCount = 0;
    for (const product of order) {
      const card = cards.get(product.id);
      card.hidden = category !== 'all' && product.category !== category;
      if (!card.hidden) visibleCount++;
      grid.append(card);
    }
    for (const filter of filters) filter.setAttribute('aria-pressed', String(filter.dataset.category === category));
    document.querySelector('#catalog-count').textContent = `${visibleCount} ${visibleCount === 1 ? 'piece' : 'pieces'}`;
  }

  function saveFilters() {
    const url = new URL(location.href);
    url.searchParams.delete('category');
    url.searchParams.delete('sort');
    if (category !== 'all') url.searchParams.set('category', category);
    if (sort !== 'featured') url.searchParams.set('sort', sort);
    history.replaceState(null, '', url);
  }

  for (const filter of filters) {
    filter.addEventListener('click', () => {
      category = filter.dataset.category;
      updateCatalog();
      saveFilters();
    });
  }
  sortSelect?.addEventListener('change', () => {
    sort = sortSelect.value;
    updateCatalog();
    saveFilters();
  });
  updateCatalog();
}

const productPage = document.querySelector('[data-product-page]');
if (productPage) {
  const product = productById.get(productPage.dataset.productPage);
  const main = productPage.querySelector('.gallery-main');
  const galleryImages = [...productPage.querySelectorAll('[data-gallery-image]')];
  const galleryOptions = [...productPage.querySelectorAll('[data-gallery-view]')];
  const form = productPage.querySelector('[data-purchase]');
  const sizeError = form?.querySelector('#size-error');
  const zoomImage = document.querySelector('#zoom-image');
  let activeView = 0;

  function showView(index) {
    activeView = (index + galleryImages.length) % galleryImages.length;
    galleryImages.forEach((image, position) => {
      image.classList.toggle('is-visible', position === activeView);
      image.setAttribute('aria-hidden', String(position !== activeView));
    });
    galleryOptions.forEach((option, position) => {
      option.setAttribute('aria-pressed', String(position === activeView));
    });
    productPage.querySelector('#gallery-status').textContent = galleryImages[activeView].alt;
  }

  main.addEventListener('click', () => {
    zoomImage.src = galleryImages[activeView].src;
    zoomImage.alt = galleryImages[activeView].alt;
  });
  galleryOptions.forEach((option, index) => option.addEventListener('click', () => showView(index)));
  for (const step of productPage.querySelectorAll('[data-gallery-step]')) {
    step.addEventListener('click', () => showView(activeView + Number(step.dataset.galleryStep)));
  }
  productPage.querySelector('.product-gallery').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    showView(activeView + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  let touchStart;
  main.addEventListener('touchstart', event => { touchStart = event.changedTouches[0]; }, { passive: true });
  main.addEventListener('touchend', event => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const shift = touch.clientX - touchStart.clientX;
    const drift = touch.clientY - touchStart.clientY;
    touchStart = undefined;
    if (Math.abs(shift) > 48 && Math.abs(shift) > 1.4 * Math.abs(drift)) {
      if (event.cancelable) event.preventDefault();
      showView(activeView + (shift > 0 ? -1 : 1));
    }
  }, { passive: false });

  form?.addEventListener('change', () => { sizeError.hidden = true; });
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const size = new FormData(form).get('size');
    if (!sizes.includes(size)) {
      sizeError.hidden = false;
      form.querySelector('input').focus();
      return;
    }
    const previous = bag.find(item => item.id === product.id && item.size === size)?.quantity;
    updateBag(product.id, size, 'add');
    openDialog('bag', event.submitter);
    announceBag(previous === maxQuantity ? 'This size has reached the maximum bag quantity.' : `${product.name}, size ${size}, added to bag.`);
  });
}

const lookbook = document.querySelector('.lookbook-grid');
if (lookbook) {
  const tiles = [...lookbook.querySelectorAll('[data-look-frame]')];
  const viewer = document.getElementById('look-view');
  const photo = viewer.querySelector('.look-view-image');
  const pieces = viewer.querySelector('[data-look-pieces]');
  const status = viewer.querySelector('[data-look-status]');
  let activeFrame = 0;

  function showFrame(index) {
    activeFrame = (index + tiles.length) % tiles.length;
    const tile = tiles[activeFrame];
    const thumbnail = tile.querySelector('img');
    photo.src = tile.href;
    photo.alt = thumbnail.alt;
    pieces.replaceChildren(...[...tile.nextElementSibling.childNodes].map(node => node.cloneNode(true)));
    status.textContent = `Photograph ${activeFrame + 1} of ${tiles.length}`;
  }

  lookbook.addEventListener('click', event => {
    const tile = event.target.closest('[data-look-frame]');
    if (!tile || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showFrame(Number(tile.dataset.lookFrame));
    openDialog('look-view', tile);
  });

  for (const button of viewer.querySelectorAll('[data-look-step]')) {
    button.addEventListener('click', () => showFrame(activeFrame + Number(button.dataset.lookStep)));
  }
  viewer.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || event.altKey || event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    showFrame(activeFrame + (event.key === 'ArrowLeft' ? -1 : 1));
  });
}

const hero = document.querySelector('.hero');
if (hero) {
  const header = document.querySelector('.site-header');
  const scene = hero.querySelector('.hero-scene');
  const layeredMotion = matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let frame = 0;
  function setPointer(x, y) {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      scene.style.setProperty('--pointer-x', x);
      scene.style.setProperty('--pointer-y', y);
    });
  }
  hero.addEventListener('pointermove', event => {
    if (!layeredMotion.matches || event.pointerType === 'touch') return;
    const bounds = hero.getBoundingClientRect();
    setPointer((event.clientX - bounds.left) / bounds.width * 2 - 1, (event.clientY - bounds.top) / bounds.height * 2 - 1);
  }, { passive: true });
  hero.addEventListener('pointerleave', () => setPointer(0, 0));
  layeredMotion.addEventListener('change', () => setPointer(0, 0));

  let observer;
  new ResizeObserver(() => {
    observer?.disconnect();
    observer = new IntersectionObserver(([entry]) => {
      header.classList.toggle('site-header--over-hero', entry.isIntersecting);
    }, { rootMargin: `-${header.offsetHeight}px 0px 0px 0px` });
    observer.observe(hero);
  }).observe(header);
}
