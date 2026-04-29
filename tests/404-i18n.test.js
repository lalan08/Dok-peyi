import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const notFoundHtmlPath = path.join(__dirname, '..', '404.html');
const langJsPath = path.join(__dirname, '..', 'lang.js');

describe('404 page i18n', () => {
  test('loads shared i18n assets and exposes translation hooks for visible texts', async () => {
    const html = await fs.readFile(notFoundHtmlPath, 'utf8');

    assert.match(html, /href="\/lang\.css"/);
    assert.match(html, /src="\/lang\.js\?v=/);
    assert.match(html, /class="nav-links"/);
    assert.match(html, /data-i18n="err404_title"/);
    assert.match(html, /data-i18n-html="err404_desc_html"/);
    assert.match(html, /data-i18n="err404_btn_home"/);
    assert.match(html, /data-i18n="err404_btn_services"/);
    assert.match(html, /data-i18n="err404_direct_label"/);
  });

  test('defines dedicated translation keys for the 404 page', async () => {
    const lang = await fs.readFile(langJsPath, 'utf8');

    assert.match(lang, /err404_title/);
    assert.match(lang, /err404_desc_html/);
    assert.match(lang, /err404_btn_home/);
    assert.match(lang, /err404_btn_services/);
    assert.match(lang, /err404_direct_label/);
    assert.match(lang, /err404_link_sejour/);
  });

  test('keeps the page linked to the main service entry points', async () => {
    const html = await fs.readFile(notFoundHtmlPath, 'utf8');

    assert.match(html, /href="\/service\?s=cv"/);
    assert.match(html, /href="\/service\?s=lettre"/);
    assert.match(html, /href="\/service\?s=courrier"/);
    assert.match(html, /href="\/service\?s=dossier"/);
    assert.match(html, /href="\/service\?s=sejour"/);
  });
});
