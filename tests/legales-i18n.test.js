import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const legacyLegalHtmlPath = path.join(__dirname, '..', 'legales.html');
const langJsPath = path.join(__dirname, '..', 'lang.js');

describe('legales page i18n', () => {
  test('loads shared i18n assets and exposes translation hooks for visible texts', async () => {
    const html = await fs.readFile(legacyLegalHtmlPath, 'utf8');

    assert.match(html, /href="\/lang\.css"/);
    assert.match(html, /src="\/lang\.js\?v=/);
    assert.match(html, /class="nav-links"/);
    assert.match(html, /data-i18n="leg_nav_home"/);
    assert.match(html, /data-i18n="leg_title"/);
    assert.match(html, /data-i18n-html="leg_compat_html"/);
    assert.match(html, /data-i18n="leg_toc_title"/);
    assert.match(html, /data-i18n="leg_cgu_title"/);
    assert.match(html, /data-i18n-html="leg_cgu_warning_html"/);
    assert.match(html, /data-i18n="leg_open_terms"/);
    assert.match(html, /data-i18n="leg_open_privacy"/);
    assert.match(html, /data-i18n="leg_open_cookies"/);
  });

  test('defines dedicated translation keys for the legacy legal hub page', async () => {
    const lang = await fs.readFile(langJsPath, 'utf8');

    assert.match(lang, /leg_nav_home/);
    assert.match(lang, /leg_title/);
    assert.match(lang, /leg_subtitle/);
    assert.match(lang, /leg_compat_html/);
    assert.match(lang, /leg_toc_title/);
    assert.match(lang, /leg_cgu_title/);
    assert.match(lang, /leg_cgu_warning_html/);
    assert.match(lang, /leg_cgv_title/);
    assert.match(lang, /leg_conf_title/);
    assert.match(lang, /leg_cookies_title/);
    assert.match(lang, /leg_footer_home/);
  });
});
