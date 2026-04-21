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
});
