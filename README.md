# LS Exit Audit v0.3.0 — Sales Page

Deploy-ready static sales page for **LS Exit Audit v0.3.0**, a Lemon Squeezy migration inventory CLI.

- Price: US$29 one time
- Payment: 29 USDT on TRON (TRC20), after purchase-request confirmation
- Purchase request: https://github.com/twappleon/ls-exit-audit/issues/new?template=purchase.yml
- Runtime dependencies: none

## Local verification

```bash
npm test
python3 -m http.server 4173 --directory dist
```

Then open `http://127.0.0.1:4173/`.

## Zero-cost deployment

Recommended: **GitHub Pages** from this public repository, because the site is static and the existing purchase flow already uses GitHub Issues. Publish the repository root from the `main` branch, or deploy `dist/` with a GitHub Actions Pages workflow.

Also compatible with Cloudflare Pages or Netlify: build command `npm run build`, output directory `dist`.

The paid release package is delivered privately after verified settlement. This public repository contains only the sales page, purchase terms, a sanitized demo image, and a sanitized generated demo report. It does not contain the paid ZIP or product source code.
