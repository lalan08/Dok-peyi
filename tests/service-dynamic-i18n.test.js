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

  test('localizes dynamic question labels and placeholders through dedicated keys', async () => {
    const source = await fs.readFile(serviceJsPath, 'utf8');

    assert.match(source, /swTQuestion\(q, 'label'/);
    assert.match(source, /swTQuestion\(q, 'placeholder'/);
    assert.match(source, /wiz_q_\$\{SSW\.svc\}_\$\{SSW\.choice\}_\$\{q\.id\}_\$\{suffix\}/);
    assert.match(source, /wiz_q_\$\{SSW\.svc\}_\$\{q\.id\}_\$\{suffix\}/);
  });

  test('defines dedicated translation keys for dynamic wizard services, fields and feedback', async () => {
    const source = await fs.readFile(langJsPath, 'utf8');

    assert.match(source, /wiz_service_cv_name/);
    assert.match(source, /wiz_choice_cv_scratch_label/);
    assert.match(source, /wiz_form_title_cv/);
    assert.match(source, /wiz_modify_section_default/);
    assert.match(source, /wiz_modify_counter_remaining/);
    assert.match(source, /wiz_loading_interrupted/);
    assert.match(source, /wiz_pay_retry/);
    assert.match(source, /wiz_confirm_home/);
    assert.match(source, /wiz_service_sejour_review_msg/);
    assert.match(source, /wiz_q_cv_scratch_poste_label/);
    assert.match(source, /wiz_q_cv_scratch_poste_placeholder/);
  });

  test('covers lettre and courrier deep wizard catalogs through shared refs and dedicated keys', async () => {
    const serviceSource = await fs.readFile(serviceJsPath, 'utf8');
    const langSource = await fs.readFile(langJsPath, 'utf8');

    assert.match(serviceSource, /q\.i18nRef/);
    assert.match(langSource, /wiz_ref_cv_poste_group_0_label/);
    assert.match(langSource, /wiz_ref_lettre_entreprise_group_0_label/);
    assert.match(langSource, /wiz_ref_lettre_atouts_group_0_option_0/);
    assert.match(langSource, /wiz_ref_courrier_destinataire_group_0_label/);
    assert.match(langSource, /wiz_ref_courrier_objet_type_group_0_option_0/);
    assert.match(langSource, /wiz_q_lettre_create_experience_label/);
    assert.match(langSource, /wiz_q_courrier_objet_placeholder/);
  });

  test('covers active lettre and courrier deep translations for ht, nl and ar locales', async () => {
    const langSource = await fs.readFile(langJsPath, 'utf8');

    assert.match(langSource, /wiz_q_lettre_create_poste_label: 'Pòs vize a \*'/);
    assert.match(langSource, /wiz_q_courrier_objet_label: 'Sijè lèt la \*'/);
    assert.match(langSource, /wiz_q_lettre_create_poste_label: 'Doelfunctie \*'/);
    assert.match(langSource, /wiz_ref_courrier_objet_type_group_0_option_0: 'Aanvraag van documenten'/);
    assert.match(langSource, /wiz_q_lettre_create_poste_label: 'المنصب المستهدف \*'/);
    assert.match(langSource, /wiz_q_courrier_objet_label: 'موضوع الرسالة \*'/);
  });
});
