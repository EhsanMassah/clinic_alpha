# Clinic Alpha — React prototype

Scaffolded Vite + React + TypeScript project with Tailwind CSS and accessibility-ready defaults.

Quick start

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Build

```bash
npm run build
```

Recommended VS Code extensions: ESLint, Prettier, Tailwind CSS IntelliSense, JSX a11y

Optional: use your attached hero image

- Place the hero image file you attached in your project `public/` directory and name it `hero-attachment.jpg`.
- Start the dev server and open http://localhost:5173/ to preview the hero.

## Contentful integration

Article content now loads from Contentful when credentials are present. If credentials are missing (e.g., in local development), the UI falls back to the sample articles in `src/data/articles.ts`.

1. Create a Contentful space (free “Community” plan is fine).
2. Add a content model named `article` with the following fields:
   - `title` (Text → Short text)
   - `slug` (Text → Short text, unique)
   - `excerpt` (Text → Long text, optional)
   - `body` (Rich text or Long text, optional)
   - `coverImage` (Media → Asset, optional)
   - `tags` (Array → Short text, optional)
   - `featured` (Boolean, optional)
   - `publishDate` (Date & time, optional)
3. Publish at least one entry so the API returns data.
4. Copy the Contentful keys into `.env` (see `.env.example`):

```
VITE_CONTENTFUL_SPACE_ID=xxxxxxxxxxxx
VITE_CONTENTFUL_ENVIRONMENT=master
VITE_CONTENTFUL_DELIVERY_TOKEN=your_delivery_token
VITE_CONTENTFUL_PREVIEW_TOKEN=optional_preview_token
```

5. Restart the dev server. The home page, articles list, detail view, and related stories will now use the CMS data.

If you want to preview unpublished entries, provide the preview token and set `VITE_CONTENTFUL_PREVIEW_TOKEN`; the hooks already respect it when configured.

Performance: supplying AVIF/WebP/JPG images

- For best performance, provide multiple formats for each image in `public/`.
	- Hero: `/public/hero-attachment.avif`, `/public/hero-attachment.webp`, `/public/hero-attachment.jpg`
	- Article images: for the sample article with `image: '/images/understanding-menopause'`, provide `/public/images/understanding-menopause.avif`, `/public/images/understanding-menopause.webp`, `/public/images/understanding-menopause.jpg`
- The app will automatically prefer AVIF, then WebP, then JPEG.
