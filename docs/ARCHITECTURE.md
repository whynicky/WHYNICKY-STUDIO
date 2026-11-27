# Architecture

WHYNICKY® STUDIO is a static fashion storefront built with native JavaScript modules and CSS. It has no external npm dependencies.

## Project structure

- `build.mjs` generates static pages and production output.
- `serve.mjs` runs the local development server.
- `editorials.mjs` contains editorial page content.
- `src/collection.js` defines product data, categories, sizes and helpers.
- `src/new-pieces.js` contains additional collection entries.
- `src/store.js` handles storefront interactions.
- `src/site-path.js` resolves paths for local development and deployment.
- `src/style.css` contains the storefront styles.
- `src/assets/` stores product photography, campaign images, icons and fonts.

## Storefront state

The storefront module manages the shopping bag, product search, catalog filtering and sorting, product galleries, lookbook navigation and modal dialogs.

The shopping bag is stored in browser localStorage. Stored entries are validated against known product IDs and available sizes before being restored. Quantity changes are capped at 99.

The bag is a demonstration feature: checkout is a preview and orders are disabled.

## Catalog data

Product information is kept separately from interaction logic. The collection module exports product records, category definitions, available sizes, lookup maps and helpers for product routes and image paths.

## Accessibility and interaction

The storefront uses native dialog elements, keyboard navigation, focus restoration, accessible labels and status announcements. Reduced-motion preferences are respected.

Product card images are prepared when cards approach the viewport. If a back-view image fails to load, the front view remains available.

## Development

Requirements: Node.js 20 or later.

Run the development server with npm run dev.

Build for GitHub Pages with:
SITE_BASE_PATH=/WHYNICKY-STUDIO SITE_ORIGIN=https://whynicky.github.io npm run build
