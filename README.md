# BetterPitch – website demo project

A multi-page marketing website for **BetterPitch**, a fictional AI voice and chat agent product.
Built with plain HTML, CSS and JavaScript. No framework and no build step.

## Run it locally

Requires [Node.js](https://nodejs.org) (any recent version).

```
node server.mjs
```

Then open http://localhost:8080. Pass a port to use a different one: `node server.mjs 3000`.

You can also open `index.html` directly in a browser. Everything except the 404 page works without the server.

## Pages

| File | Page |
|---|---|
| `index.html` | Home: hero, simulated demo call, platform, languages, use cases, results, pricing teaser |
| `product-voice.html` | Voice Agent product page |
| `product-chat.html` | Chat Agent (WhatsApp / SMS / web) with animated chat |
| `solutions.html` | Solutions by industry |
| `pricing.html` | Plans, monthly/yearly toggle, comparison table, FAQ |
| `case-studies.html` | Customer stories with industry filter |
| `blog.html`, `blog/*.html` | Blog index and 3 articles |
| `compare/*.html` | BetterPitch vs call center / IVR / in-house hire |
| `contact.html` | Book-a-demo form |
| `privacy-policy.html`, `terms.html`, `404.html` | Legal and error pages |

## Structure

```
assets/style.css   base design system (colours, buttons, cards, grid, nav, footer)
assets/pages.css   components for inner pages (pricing, FAQ, forms, articles…)
assets/main.js     shared header + footer, mobile menu, scroll animations, demo forms
assets/favicon.svg logo icon
server.mjs         tiny static file server
```

The header and footer are defined once in `assets/main.js`. Edit them there.
Colours are CSS variables at the top of `assets/style.css` (`--accent`, `--accent2`, `--bg` …).

## Notes

- All company names, customer stories, figures, prices, phone numbers and legal text are sample data for a demo.
- Forms do not send data. They show a confirmation message only.
- The "Start call" demo on the home page is simulated.
