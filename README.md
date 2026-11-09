# WHYNICKY® STUDIO / Fault Lines

A static portfolio storefront for a 24-piece menswear and unisex collection, with a 26-frame shoppable Lookbook. Node.js 20 or later is required. The site has no package dependencies.

```sh
npm run dev
```

Open the local URL printed in the terminal. Run `npm run build` to generate the static site in `dist/`. Set `SITE_ORIGIN` to the deployed origin to generate absolute social image URLs.

Product data lives in `src/collection.js` and `src/new-pieces.js`. Editorial frames and their product links live in `editorials.mjs`. The bag persists in local storage on the current origin. Checkout displays a demonstration order summary. Prices and measurements are illustrative.

Optimized campaign and product photographs are in `src/assets/`. See [the image prompts](IMAGE-PROMPTS.md) for their generation notes.
