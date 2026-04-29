import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cgvHtmlPath = path.join(__dirname, '..', 'cgv.html');
const langJsPath = path.join(__dirname, '..', 'lang.js');

describe('cgv page i18n', () => {
  test('loads shared i18n assets and exposes translation hooks for visible texts', async () => {
    const html = await fs.readFile(cgvHtmlPath, 'utf8');

    assert.match(html, /href="\/lang\.css"/);
    assert.match(html, /src="\/lang\.js\?v=/);
    assert.match(html, /class="nav-links"/);
    assert.match(html, /data-i18n="cgv_nav_home"/);
    assert.match(html, /data-i18n="cgv_title"/);
    assert.match(html, /data-i18n="cgv_updated"/);
    assert.match(html, /data-i18n="cgv_section_1_title"/);
    assert.match(html, /data-i18n="cgv_table_service"/);
    assert.match(html, /data-i18n-html="cgv_other_option_mods_html"/);
    assert.match(html, /data-i18n-html="cgv_disclaimer_html"/);
    assert.match(html, /data-i18n="cgv_contact_intro"/);
  });

  test('defines dedicated translation keys for the cgv page', async () => {
    const lang = await fs.readFile(langJsPath, 'utf8');

    assert.match(lang, /cgv_nav_home/);
    assert.match(lang, /cgv_title/);
    assert.match(lang, /cgv_section_1_title/);
    assert.match(lang, /cgv_table_service/);
    assert.match(lang, /cgv_cv_option_executive/);
    assert.match(lang, /cgv_refund_delay_html/);
    assert.match(lang, /cgv_disclaimer_html/);
    assert.match(lang, /cgv_jurisdiction_title/);
    assert.match(lang, /cgv_footer_home/);
  });
});
