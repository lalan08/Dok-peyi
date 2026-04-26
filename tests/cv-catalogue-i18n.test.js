import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cvCatalogueHtmlPath = path.join(__dirname, '..', 'cv-catalogue.html');
const langJsPath = path.join(__dirname, '..', 'lang.js');

describe('cv-catalogue i18n', () => {
  test('loads shared i18n assets and exposes the public navigation hooks', async () => {
    const html = await fs.readFile(cvCatalogueHtmlPath, 'utf8');

    assert.match(html, /href="\/lang\.css"/);
    assert.match(html, /src="\/lang\.js\?v=/);
    assert.match(html, /class="nav-links"/);
    assert.match(html, /class="mobile-menu"/);
    assert.match(html, /data-i18n="nav_comment"/);
    assert.match(html, /data-i18n="nav_services"/);
    assert.match(html, /data-i18n="nav_about"/);
    assert.match(html, /data-i18n="cvcat_nav_back"/);
    assert.match(html, /data-i18n-html="cvcat_title_html"/);
    assert.match(html, /data-i18n="cvcat_note"/);
  });

  test('wires template cards to the shared i18n runtime', async () => {
    const html = await fs.readFile(cvCatalogueHtmlPath, 'utf8');

    assert.match(html, /DokPeyiI18n/);
    assert.match(html, /dokpeyi:langchange/);
    assert.match(html, /cvcat_tpl_classique_name/);
    assert.match(html, /cvcat_btn_choose/);
    assert.match(html, /cvcat_btn_selected/);
  });

  test('defines dedicated translation keys for the CV catalogue page', async () => {
    const lang = await fs.readFile(langJsPath, 'utf8');

    assert.match(lang, /cvcat_nav_back/);
    assert.match(lang, /cvcat_title_html/);
    assert.match(lang, /cvcat_price_included/);
    assert.match(lang, /cvcat_badge_premium/);
    assert.match(lang, /cvcat_tpl_classique_name/);
    assert.match(lang, /cvcat_tpl_executive_desc/);
  });
});
