import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexHtmlPath = path.join(__dirname, '..', 'index.html');
const aboutHtmlPath = path.join(__dirname, '..', 'a-propos.html');
const cvCatalogueHtmlPath = path.join(__dirname, '..', 'cv-catalogue.html');
const serviceHtmlPath = path.join(__dirname, '..', 'service.html');
const vercelConfigPath = path.join(__dirname, '..', 'vercel.json');
const serviceWorkerPath = path.join(__dirname, '..', 'sw.js');

describe('service static asset caching', () => {
  test('public pages cache-bust lang.js to avoid stale i18n bundles', async () => {
    const [indexHtml, aboutHtml, cvCatalogueHtml, serviceHtml] = await Promise.all([
      fs.readFile(indexHtmlPath, 'utf8'),
      fs.readFile(aboutHtmlPath, 'utf8'),
      fs.readFile(cvCatalogueHtmlPath, 'utf8'),
      fs.readFile(serviceHtmlPath, 'utf8'),
    ]);

    assert.match(indexHtml, /src="\/lang\.js\?v=/);
    assert.match(aboutHtml, /src="\/lang\.js\?v=/);
    assert.match(cvCatalogueHtml, /src="\/lang\.js\?v=/);
    assert.match(serviceHtml, /src="\/lang\.js\?v=/);
  });

  test('service.html cache-busts service.css to avoid stale immutable CSS', async () => {
    const html = await fs.readFile(serviceHtmlPath, 'utf8');

    assert.match(html, /href="\/service\.css\?v=/);
  });

  test('vercel.json does not mark non-hashed CSS bundles as immutable', async () => {
    const raw = await fs.readFile(vercelConfigPath, 'utf8');
    const config = JSON.parse(raw);
    const cssHeader = config.headers.find((entry) =>
      entry.source === '/(tokens|styles|service|lang)\\.css'
    );

    assert.ok(cssHeader, 'expected CSS cache header rule');

    const cacheControl = cssHeader.headers.find((header) => header.key === 'Cache-Control');
    assert.ok(cacheControl, 'expected Cache-Control header for CSS');
    assert.doesNotMatch(cacheControl.value, /immutable/);
  });

  test('service worker uses network-first for lang assets', async () => {
    const sw = await fs.readFile(serviceWorkerPath, 'utf8');

    assert.match(sw, /url\.pathname === '\/lang\.js' \|\| url\.pathname === '\/lang\.css'/);
    assert.match(sw, /Network-first for the language system to avoid stale translations after deploys/);
  });
});
