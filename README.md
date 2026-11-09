# WHYNICKY® / Fault Lines

A portfolio storefront for a six-piece concept fashion collection. The site uses statically generated HTML, CSS and JavaScript. Node.js 20 or later is required. There are no package dependencies.

```sh
npm run dev
```

Open the local URL printed in the terminal. To generate the deployable site without starting the preview server, run `npm run build`. The output is in `dist/`. Serve that directory over HTTP with directory indexes enabled.

Product data lives in `src/collection.js`. The bag persists in local storage on the current origin. Checkout shows the order summary in demo mode. Prices and garment measurements are illustrative.

Campaign and product photography were generated for the collection. Optimized originals, alternate views and detail crops are in `src/assets/`. See [the image prompts](IMAGE-PROMPTS.md) for the generation specifications.
