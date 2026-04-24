import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceHtmlPath = path.join(__dirname, '..', 'service.html');
const vercelConfigPath = path.join(__dirname, '..', 'vercel.json');

describe('service static asset caching', () => {
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
});
