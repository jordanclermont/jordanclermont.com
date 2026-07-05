# jordanclermont.com

Personal portfolio site — static HTML/CSS, no build step.

**Live site:** https://jordanclermont-com.pages.dev

Hosted on Cloudflare Pages, which deploys automatically on every push to `main`.

## Previewing locally

Don't open `index.html` directly from Finder — the site uses root-relative links (`/design`, `/music`, …) that only resolve over HTTP. Instead, serve the folder:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.
