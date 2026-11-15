/**
 * Runs after `vite build`.
 *
 * The site is a client-rendered single-page app, so without this every URL would be served
 * the homepage's HTML (same title, description and canonical). This script writes a real
 * HTML file for each route into dist/ with its own head tags, structured data and a plain
 * HTML copy of the main content (replaced by React on load), then writes sitemap.xml.
 *
 * Articles come from Contentful when VITE_CONTENTFUL_* variables are set at build time,
 * otherwise from src/data/articles.ts. Articles published after a build are still reachable
 * (vercel.json falls back to the app shell) but only get static HTML on the next deploy.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { transform } from 'esbuild'
import { loadEnv } from 'vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const seo = JSON.parse(readFileSync(resolve(root, 'src/config/seo.json'), 'utf8'))
const template = readFileSync(resolve(dist, 'index.html'), 'utf8')

const escapeHtml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const absolute = (pathOrUrl) =>
  /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${seo.siteUrl}${pathOrUrl === '/' ? '/' : pathOrUrl.replace(/\/+$/, '')}`

const truncate = (text, max = 160) => {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim()
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`
}

// ---------------------------------------------------------------- articles

async function loadLocalArticles() {
  const source = readFileSync(resolve(root, 'src/data/articles.ts'), 'utf8')
  const { code } = await transform(source, { loader: 'ts', format: 'esm' })
  const module = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
  return module.articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    body: a.content,
    image: a.image,
    publishDate: a.publishDate,
    updated: a.publishDate,
  }))
}

async function loadContentfulArticles(env) {
  const space = env.VITE_CONTENTFUL_SPACE_ID
  const token = env.VITE_CONTENTFUL_DELIVERY_TOKEN
  if (!space || !token) return null
  const environment = env.VITE_CONTENTFUL_ENVIRONMENT || 'master'
  const url = `https://cdn.contentful.com/spaces/${space}/environments/${environment}/entries?content_type=article&include=1&limit=1000`
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!response.ok) throw new Error(`Contentful responded ${response.status}`)
  const data = await response.json()
  const assets = new Map((data.includes?.Asset ?? []).map((asset) => [asset.sys.id, asset.fields?.file?.url]))
  return data.items
    .filter((item) => item.fields?.slug && item.fields?.title)
    .map((item) => {
      const assetId = (item.fields.coverImage ?? item.fields.heroImage)?.sys?.id
      const file = assetId ? assets.get(assetId) : undefined
      return {
        slug: item.fields.slug,
        title: item.fields.title,
        excerpt: item.fields.excerpt,
        body: item.fields.body,
        image: file ? `https:${file}` : undefined,
        publishDate: item.fields.publishDate,
        updated: item.sys?.updatedAt,
      }
    })
}

async function loadArticles() {
  const env = { ...loadEnv('production', root, 'VITE_'), ...process.env }
  try {
    const cms = await loadContentfulArticles(env)
    if (cms) {
      console.log(`[seo] ${cms.length} articles from Contentful`)
      return cms
    }
  } catch (error) {
    console.warn(`[seo] Contentful unavailable (${error.message}); using local articles`)
  }
  const local = await loadLocalArticles()
  console.log(`[seo] ${local.length} articles from src/data/articles.ts`)
  return local
}

// ---------------------------------------------------------------- html

function setTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`[seo] index.html is missing a tag matching ${pattern}`)
  return html.replace(pattern, replacement)
}

function renderPage({ path, title, description, image, type = 'website', jsonLd, content }) {
  const url = escapeHtml(absolute(path))
  const img = escapeHtml(absolute(image || seo.defaultImage))
  const t = escapeHtml(title)
  const d = escapeHtml(description)
  let html = template
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
  html = setTag(html, /<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${d}" />`)
  html = setTag(html, /<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${url}" />`)
  html = setTag(html, /<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${t}" />`)
  html = setTag(html, /<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${d}" />`)
  html = setTag(html, /<meta\s+property="og:type"[\s\S]*?\/>/, `<meta property="og:type" content="${type}" />`)
  html = setTag(html, /<meta\s+property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${url}" />`)
  html = setTag(html, /<meta\s+property="og:image"[\s\S]*?\/>/, `<meta property="og:image" content="${img}" />`)
  html = setTag(html, /<meta\s+name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${t}" />`)
  html = setTag(html, /<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${d}" />`)
  html = setTag(html, /<meta\s+name="twitter:image"[\s\S]*?\/>/, `<meta name="twitter:image" content="${img}" />`)
  if (jsonLd) {
    const safe = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
    html = html.replace('</head>', `  <script type="application/ld+json" id="ld-page">${safe}</script>\n  </head>`)
  }
  html = setTag(
    html,
    /<div id="root"><\/div>/,
    `<div id="root"><div style="max-width:720px;margin:0 auto;padding:56px 24px;font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:#10264a;line-height:1.6">${content}</div></div>`
  )
  return html
}

function writeRoute(path, html) {
  const file = path === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${path}`, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

const siteNav = `<nav aria-label="Site"><p>${[
  ['/', 'Home'],
  ['/menopause-assessment', 'Free menopause symptom checker'],
  ['/how-it-works', 'How it works'],
  ['/articles', 'Articles'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
]
  .map(([href, label]) => `<a href="${href}">${label}</a>`)
  .join(' · ')}</p></nav>`

const breadcrumb = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name,
    item: absolute(path),
  })),
})

// ---------------------------------------------------------------- build

const articles = await loadArticles()
const sitemap = []

for (const [path, meta] of Object.entries(seo.routes)) {
  let content = `<h1>${escapeHtml(meta.heading)}</h1><p>${escapeHtml(meta.description)}</p>`
  if (path === '/articles' || path === '/') {
    content += `<h2>Latest articles</h2><ul>${articles
      .map((a) => `<li><a href="/articles/${encodeURIComponent(a.slug)}">${escapeHtml(a.title)}</a></li>`)
      .join('')}</ul>`
  }
  content += siteNav
  const jsonLd =
    path === '/'
      ? null
      : {
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'WebPage', '@id': absolute(path), url: absolute(path), name: meta.title, description: meta.description, inLanguage: 'en-GB', isPartOf: { '@id': `${seo.siteUrl}/#website` } },
            breadcrumb([['Home', '/'], [meta.heading, path]]),
          ],
        }
  writeRoute(path, renderPage({ path, title: meta.title, description: meta.description, jsonLd, content }))
  sitemap.push({ loc: absolute(path), priority: path === '/' ? '1.0' : path === '/menopause-assessment' ? '0.9' : '0.7' })
}

for (const article of articles) {
  const path = `/articles/${article.slug}`
  const description = truncate(article.excerpt || article.body)
  const paragraphs = String(article.body ?? '')
    .split(/\n\s*\n/)
    .filter((p) => p.trim())
    .map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, '<br />')}</p>`)
    .join('')
  const content = `<article><h1>${escapeHtml(article.title)}</h1>${
    article.excerpt ? `<p><strong>${escapeHtml(article.excerpt)}</strong></p>` : ''
  }${paragraphs}</article>${siteNav}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: article.title,
        description,
        image: absolute(article.image || seo.defaultImage),
        ...(article.publishDate ? { datePublished: article.publishDate } : {}),
        ...(article.updated ? { dateModified: article.updated } : {}),
        mainEntityOfPage: absolute(path),
        inLanguage: 'en-GB',
        author: { '@type': 'Organization', name: seo.siteName, url: `${seo.siteUrl}/` },
        publisher: { '@id': `${seo.siteUrl}/#organization` },
      },
      breadcrumb([['Home', '/'], ['Articles', '/articles'], [article.title, path]]),
    ],
  }
  writeRoute(
    path,
    renderPage({ path, title: `${article.title} | ${seo.siteName}`, description, image: article.image, type: 'article', jsonLd, content })
  )
  sitemap.push({ loc: absolute(path), lastmod: (article.updated || article.publishDate || '').slice(0, 10), priority: '0.6' })
}

writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap
    .map(
      (entry) =>
        `  <url><loc>${escapeHtml(entry.loc)}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}<priority>${entry.priority}</priority></url>`
    )
    .join('\n')}\n</urlset>\n`
)

console.log(`[seo] wrote ${sitemap.length} pages and sitemap.xml`)
