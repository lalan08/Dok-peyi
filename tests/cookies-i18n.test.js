import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cookiesHtmlPath = path.join(__dirname, '..', 'cookies.html');
const langJsPath = path.join(__dirname, '..', 'lang.js');

describe('cookies page i18n', () => {
  test('loads shared i18n assets and exposes translation hooks for visible texts', async () => {
    const html = await fs.readFile(cookiesHtmlPath, 'utf8');

    assert.match(html, /href="\/lang\.css"/);
    assert.match(html, /src="\/lang\.js\?v=/);
    assert.match(html, /class="nav-links"/);
    assert.match(html, /data-i18n="cookies_nav_home"/);
    assert.match(html, /data-i18n="cookies_title"/);
    assert.match(html, /data-i18n="cookies_updated"/);
    assert.match(html, /data-i18n-html="cookies_summary_html"/);
    assert.match(html, /data-i18n="cookies_table_name"/);
    assert.match(html, /data-i18n="cookies_consent_title"/);
    assert.match(html, /data-i18n="cookies_contact_intro"/);
  });

  test('defines dedicated translation keys for the cookies page', async () => {
    const lang = await fs.readFile(langJsPath, 'utf8');

    assert.match(lang, /cookies_nav_home/);
    assert.match(lang, /cookies_title/);
    assert.match(lang, /cookies_updated/);
    assert.match(lang, /cookies_summary_html/);
    assert.match(lang, /cookies_table_name/);
    assert.match(lang, /cookies_cookie_lang_purpose/);
    assert.match(lang, /cookies_manage_title/);
    assert.match(lang, /cookies_changes_title/);
    assert.match(lang, /cookies_footer_home/);
  });
});
