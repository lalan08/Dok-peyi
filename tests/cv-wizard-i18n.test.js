import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cvWizardHtmlPath = path.join(__dirname, '..', 'cv-wizard.html');
const cvWizardJsPath = path.join(__dirname, '..', 'cv-wizard.js');
const langJsPath = path.join(__dirname, '..', 'lang.js');

describe('cv-wizard i18n', () => {
  test('loads shared i18n assets and exposes translation hooks in the public nav', async () => {
    const html = await fs.readFile(cvWizardHtmlPath, 'utf8');

    assert.match(html, /href="\/lang\.css"/);
    assert.match(html, /src="\/lang\.js\?v=/);
    assert.match(html, /data-i18n="nav_comment"/);
    assert.match(html, /data-i18n="nav_services"/);
    assert.match(html, /data-i18n="nav_about"/);
  });

  test('wires dynamic tunnel texts to the shared i18n runtime', async () => {
    const js = await fs.readFile(cvWizardJsPath, 'utf8');

    assert.match(js, /DokPeyiI18n/);
    assert.match(js, /dokpeyi:langchange/);
    assert.match(js, /cvw_tpl_01_name/);
  });

  test('defines dedicated translation keys for the CV template tunnel', async () => {
    const lang = await fs.readFile(langJsPath, 'utf8');

    assert.match(lang, /cvw_hero_step/);
    assert.match(lang, /cvw_filter_all/);
    assert.match(lang, /cvw_tpl_01_name/);
    assert.match(lang, /cvw_step2_selected/);
  });
});
