import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceHtmlPath = path.join(__dirname, '..', 'service.html');

describe('service.html navigation', () => {
  test('exposes the main navigation links used across the public site', async () => {
    const html = await fs.readFile(serviceHtmlPath, 'utf8');

    assert.match(html, /href="\/#comment"/);
    assert.match(html, /href="\/#services"/);
    assert.match(html, /href="\/a-propos"/);
    assert.match(html, /Retour à l'accueil/);
  });

  test('reuses the premium landing navigation structure on service pages', async () => {
    const html = await fs.readFile(serviceHtmlPath, 'utf8');

    assert.match(html, /<nav class="navbar" id="navbar"/);
    assert.match(html, /class="container nav-inner"/);
    assert.match(html, /class="nav-links"/);
    assert.match(html, /class="nav-cta"/);
  });
});
