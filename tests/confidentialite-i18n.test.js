import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const privacyHtmlPath = path.join(__dirname, '..', 'confidentialite.html');
const langJsPath = path.join(__dirname, '..', 'lang.js');

describe('confidentialite page i18n', () => {
  test('loads shared i18n assets and exposes translation hooks for visible texts', async () => {
    const html = await fs.readFile(privacyHtmlPath, 'utf8');

    assert.match(html, /href="\/lang\.css"/);
    assert.match(html, /src="\/lang\.js\?v=/);
    assert.match(html, /class="nav-links"/);
    assert.match(html, /data-i18n="conf_nav_home"/);
    assert.match(html, /data-i18n="conf_title"/);
    assert.match(html, /data-i18n="conf_updated"/);
    assert.match(html, /data-i18n="conf_controller_title"/);
    assert.match(html, /data-i18n="conf_table_purpose"/);
    assert.match(html, /data-i18n-html="conf_rights_intro_html"/);
    assert.match(html, /data-i18n="conf_contact_intro"/);
  });

  test('defines dedicated translation keys for the privacy page', async () => {
    const lang = await fs.readFile(langJsPath, 'utf8');

    assert.match(lang, /conf_nav_home/);
    assert.match(lang, /conf_title/);
    assert.match(lang, /conf_updated/);
    assert.match(lang, /conf_controller_title/);
    assert.match(lang, /conf_data_categories_title/);
    assert.match(lang, /conf_table_purpose/);
    assert.match(lang, /conf_rights_intro_html/);
    assert.match(lang, /conf_security_title/);
    assert.match(lang, /conf_footer_home/);
  });
});
