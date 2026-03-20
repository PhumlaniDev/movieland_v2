# 🎬 MovieApp — Angular + TMDB

A production-ready Angular movie discovery app using the TMDB API, Angular Signals, and Tailwind CSS.

---

## 🗂 Project Structure

```
src/
└── app/
    ├── core/
    │   ├── services/
    │   │   └── tmdb.service.ts          # All TMDB API calls + watchlist signal
    │   └── interceptors/
    │       └── api.interceptor.ts       # Attaches API key to every request
    ├── shared/
    │   └── components/
    │       └── movie-card/              # Reusable card with watchlist toggle
    └── features/
        ├── home/                        # Hero backdrop + movie carousels
        ├── movie-detail/                # Full detail, cast, trailer modal
        └── search/                      # Debounced search + pagination
```

---

## ⚡ Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Add your TMDB API key

Get a free key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api), then add it to your environment file:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  tmdbApiKey: 'your_api_key_here',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBase: 'https://image.tmdb.org/t/p/',
};
```

### 3. Run the app

```bash
ng serve --open
# → http://localhost:4200
```

---

## 🚀 GitHub Actions CI/CD

The workflow lives at `.github/workflows/ci-cd.yml` and runs on every push and pull request to `main`.

### What it does

| Job        | Trigger             | Steps                          |
| ---------- | ------------------- | ------------------------------ |
| **ci**     | Push / PR to `main` | Install → Lint → Test → Build  |
| **deploy** | Push to `main` only | Deploy build output to Netlify |

### Setup

**1. Get your Netlify credentials:**

- `NETLIFY_AUTH_TOKEN` — go to [app.netlify.com/user/applications](https://app.netlify.com/user/applications) → Personal access tokens → New token
- `NETLIFY_SITE_ID` — go to your Netlify site → Site configuration → Site ID

**2. Add all three values as repository secrets:**
`Settings → Secrets and variables → Actions → New repository secret`

| Secret               | Value                              |
| -------------------- | ---------------------------------- |
| `NETLIFY_AUTH_TOKEN` | Your Netlify personal access token |
| `NETLIFY_SITE_ID`    | Your Netlify site ID               |
| `TMDB_API_KEY`       | Your TMDB API key                  |

**3. Add a `netlify.toml`** in your project root to handle Angular's client-side routing:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Without this, refreshing any route other than `/` will return a 404 on Netlify.

### Workflow file

`.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    name: CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --watch=false --browsers=ChromeHeadless
      - name: Inject API key
        run: |
          sed -i "s|\${TMDB_API_KEY}|${{ secrets.TMDB_API_KEY }}|g" \
            src/environments/environment.prod.ts
      - run: npm run build -- --configuration production
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/movie-app/browser

  deploy:
    name: Deploy
    needs: ci
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist
      - uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: dist
          production-branch: main
          production-deploy: true
          deploy-message: 'Deploy from GitHub Actions — ${{ github.sha }}'
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 🏗 Angular CLI Snippets

```bash
# Generate a new standalone feature component
ng generate component features/watchlist --standalone

# Generate a new service
ng generate service core/services/genre

# Build for production
ng build --configuration production

# Run unit tests
ng test
```

---

## 🛠 Tech Stack

| Layer     | Technology               |
| --------- | ------------------------ |
| Framework | Angular 17+ (standalone) |
| State     | Angular Signals          |
| Styling   | Tailwind CSS v3          |
| Fonts     | Bebas Neue + DM Sans     |
| API       | TMDB v3                  |
| CI/CD     | GitHub Actions           |
| Hosting   | Netlify                  |

---

## ✨ Features

- **Home page** — hero backdrop with trending movies, now playing, top rated, and upcoming carousels
- **Movie detail** — full info, genre tags, cast grid, YouTube trailer modal, similar movies
- **Search** — debounced live search with pagination
- **Watchlist** — add/remove movies, persisted in `localStorage`
- **Skeleton loaders** — shimmer placeholders while data loads
- **Lazy loading** — all feature routes are lazy-loaded for fast initial load

---

## 🔑 API Key Note

The TMDB API key is embedded in the Angular build. This is fine for a TMDB project since the key is free, read-only, and only accesses public movie data. If you ever move to a paid or sensitive API (OpenAI, Stripe, etc.), move the key to a server-side proxy so it never reaches the browser.

---

## 📄 License

MIT
