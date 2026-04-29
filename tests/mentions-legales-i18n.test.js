import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const legalHtmlPath = path.join(__dirname, '..', 'mentions-legales.html');
const langJsPath = path.join(__dirname, '..', 'lang.js');

describe('mentions-legales page i18n', () => {
  test('loads shared i18n assets and exposes translation hooks for visible texts', async () => {
    const html = await fs.readFile(legalHtmlPath, 'utf8');

    assert.match(html, /href="\/lang\.css"/);
    assert.match(html, /src="\/lang\.js\?v=/);
    assert.match(html, /class="nav-links"/);
    assert.match(html, /data-i18n="ml_nav_home"/);
    assert.match(html, /data-i18n="ml_title"/);
    assert.match(html, /data-i18n="ml_updated"/);
    assert.match(html, /data-i18n="ml_publisher_title"/);
    assert.match(html, /data-i18n-html="ml_note_html"/);
    assert.match(html, /data-i18n="ml_contact_intro"/);
  });

  test('defines dedicated translation keys for the legal notice page', async () => {
    const lang = await fs.readFile(langJsPath, 'utf8');

    assert.match(lang, /ml_nav_home/);
    assert.match(lang, /ml_title/);
    assert.match(lang, /ml_updated/);
    assert.match(lang, /ml_publisher_title/);
    assert.match(lang, /ml_note_html/);
    assert.match(lang, /ml_host_title/);
    assert.match(lang, /ml_ip_title/);
    assert.match(lang, /ml_law_title/);
  });
});
