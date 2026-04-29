import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cvFormHtmlPath = path.join(__dirname, '..', 'cv-form.html');
const cvFormJsPath = path.join(__dirname, '..', 'cv-form.js');
const langJsPath = path.join(__dirname, '..', 'lang.js');

describe('cv-form i18n', () => {
  test('loads shared i18n assets and exposes translation hooks in the active CV form shell', async () => {
    const html = await fs.readFile(cvFormHtmlPath, 'utf8');

    assert.match(html, /href="\/lang\.css"/);
    assert.match(html, /src="\/lang\.js\?v=/);
    assert.match(html, /class="nav-links"/);
    assert.match(html, /class="mobile-menu"/);
    assert.match(html, /data-i18n="cvf_progress_step"/);
    assert.match(html, /data-i18n="cvf_step1_title"/);
    assert.match(html, /data-i18n="cvf_step6_title"/);
    assert.match(html, /data-i18n="cvf_btn_submit"/);
  });

  test('wires the active CV form dynamic texts to the shared i18n runtime', async () => {
    const js = await fs.readFile(cvFormJsPath, 'utf8');

    assert.match(js, /DokPeyiI18n/);
    assert.match(js, /dokpeyi:langchange/);
    assert.match(js, /cvf_exp_title/);
    assert.match(js, /cvf_suggestions_loading/);
    assert.match(js, /cvf_recap_empty/);
  });

  test('defines dedicated translation keys for the active CV form page', async () => {
    const lang = await fs.readFile(langJsPath, 'utf8');

    assert.match(lang, /cvf_progress_step/);
    assert.match(lang, /cvf_step1_title/);
    assert.match(lang, /cvf_photo_add/);
    assert.match(lang, /cvf_exp_title/);
    assert.match(lang, /cvf_lang_level_placeholder/);
    assert.match(lang, /cvf_suggestions_unavailable/);
    assert.match(lang, /cvf_preview_open/);
    assert.match(lang, /cvf_recap_empty/);
  });
});
