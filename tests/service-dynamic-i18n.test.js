import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceJsPath = path.join(__dirname, '..', 'service.js');
const langJsPath = path.join(__dirname, '..', 'lang.js');

describe('service.js dynamic i18n', () => {
  test('wires the main wizard dynamic layer to the shared i18n runtime', async () => {
    const source = await fs.readFile(serviceJsPath, 'utf8');

    assert.match(source, /DokPeyiI18n/);
    assert.match(source, /dokpeyi:langchange/);
  });

  test('defines dedicated translation keys for dynamic wizard services and choices', async () => {
    const source = await fs.readFile(langJsPath, 'utf8');

    assert.match(source, /wiz_service_cv_name/);
    assert.match(source, /wiz_choice_cv_scratch_label/);
    assert.match(source, /wiz_form_title_cv/);
  });
});
