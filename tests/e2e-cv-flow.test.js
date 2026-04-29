/**
 * tests/e2e-cv-flow.test.js
 *
 * E2E fonctionnels pour cv-form.js — sans dépendance externe.
 * Stratégie : mock DOM manuel léger + node:vm pour exécuter l'IIFE dans
 * un sandbox isolé, puis invoquer les fonctions exposées via window.*.
 *
 * Scénarios couverts :
 *   1. removeCard — suppression exp-card-2 parmi 3 → renumérotation des titres
 *   2. removeCard — suppression form-card-1 parmi 2 → renumérotation
 *   3. removeCard — suppression lang-card-1 parmi 2 → état cvData synchronisé
 *   4. triggerSuggestions — changement de poste → reset innerHTML + data-frozen
 *      sur tous les containers suggestions-formation_N
 */

import { describe, test, before } from 'node:test';
import assert from 'node:assert/strict';
import fs     from 'node:fs/promises';
import path   from 'node:path';
import { fileURLToPath } from 'node:url';
import vm     from 'node:vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CV_FORM_PATH = path.join(__dirname, '..', 'cv-form.js');

/* ── Minimal DOM Mock ─────────────────────────────────────────────────────── */

function createEnv() {
  const registry = new Map(); // id → element (pour getElementById)
  const heap     = [];        // tous les éléments (pour querySelectorAll global)

  function makeEl(id = '') {
    const el = {
      id,
      innerHTML:  '',
      textContent: '',
      dataset:    {},
      style:      { cssText: '' },
      _attrs:     {},
      _children:  [],
      parentNode: null,
      className:  '',

      getAttribute(n) {
        return Object.prototype.hasOwnProperty.call(this._attrs, n) ? this._attrs[n] : null;
      },
      setAttribute(n, v) { this._attrs[n] = String(v); },
      removeAttribute(n) { delete this._attrs[n]; },

      remove() {
        if (this.parentNode) {
          this.parentNode._children = this.parentNode._children.filter(c => c !== this);
        }
        if (this.id) registry.delete(this.id);
      },
      appendChild(child) {
        this._children.push(child);
        child.parentNode = this;
        if (child.id) registry.set(child.id, child);
        heap.push(child);
      },

      querySelector(sel)    { return _find(this._children, sel); },
      querySelectorAll(sel) { return _findAll(this._children, sel); },

      classList: (() => {
        const s = new Set();
        return {
          add:  c => s.add(c),
          remove: c => s.delete(c),
          toggle(c, f) {
            if (f === undefined) s.has(c) ? s.delete(c) : s.add(c);
            else f ? s.add(c) : s.delete(c);
          },
          contains: c => s.has(c)
        };
      })()
    };
    if (id) { registry.set(id, el); heap.push(el); }
    return el;
  }

  /* Matcher de sélecteur minimal couvrant les cas utilisés dans cv-form.js */
  function _match(el, sel) {
    sel = (sel || '').trim();
    if (!sel) return false;

    /* .class-name */
    if (sel.startsWith('.'))
      return el.className.split(' ').includes(sel.slice(1));

    /* [data-cvf-card-title]  (présence d'attribut) */
    if (sel === '[data-cvf-card-title]')
      return Object.prototype.hasOwnProperty.call(el._attrs, 'data-cvf-card-title');

    /* [id^="prefix"]  (préfixe d'id) */
    const m = sel.match(/^\[id\^="([^"]+)"\]$/);
    if (m) return typeof el.id === 'string' && el.id.startsWith(m[1]);

    return false;
  }

  function _find(children, sel) {
    for (const c of children) {
      if (_match(c, sel)) return c;
      const f = _find(c._children, sel);
      if (f) return f;
    }
    return null;
  }

  function _findAll(children, sel) {
    const r = [];
    for (const c of children) {
      if (_match(c, sel)) r.push(c);
      r.push(..._findAll(c._children, sel));
    }
    return r;
  }

  const doc = {
    getElementById:   id  => registry.get(id) || null,
    querySelectorAll: sel => heap.filter(el  => _match(el, sel)),
    querySelector:    sel => heap.find(el    => _match(el, sel)) || null,
    addEventListener: ()  => {},
    body: {
      classList: { toggle() {}, contains() { return false; }, add() {}, remove() {} }
    },
    createElement: () => makeEl()
  };

  return { registry, heap, makeEl, doc };
}

/* ── Helper : crée une card avec un span [data-cvf-card-title] ─────────────── */

function buildCard(env, cardId, titleText, titleType) {
  const card = env.makeEl(cardId);
  card.className = 'dynamic-card';

  const span = env.makeEl(''); // sans id
  span._attrs['data-cvf-card-title'] = titleType;
  span._attrs['data-cvf-index']      = String(parseInt(titleText.split(' ').pop(), 10));
  span.textContent = titleText;

  card.appendChild(span);
  return card;
}

/* ── Charge cv-form.js dans un vm context isolé ────────────────────────────── */

function loadSandbox(src, env) {
  const sb = {
    document:       env.doc,
    sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    console,
    /* setTimeout no-op : empêche le fetch réel qui partirait 600 ms après */
    setTimeout:   () => 0,
    clearTimeout: () => {},
    fetch:        () => Promise.resolve({ ok: false, json: async () => ({}) }),
    Event:       function (t) { return { type: t }; },
    FormData:    class { append() {} },
    FileReader:  class { readAsDataURL() {} },
    window:      null
  };
  sb.window = sb; // window === contexte global → window.X = X exposé sur sb
  vm.createContext(sb);
  vm.runInContext(src, sb);
  return sb;
}

/* ── Suite de tests ──────────────────────────────────────────────────────────── */

describe('e2e cv-form — removeCard & triggerSuggestions', () => {
  let src;

  before(async () => {
    src = await fs.readFile(CV_FORM_PATH, 'utf8');
  });

  /* ── Scénario 1 : supprimer exp-card-2 parmi 3 ──────────────────────────── */
  test('removeCard — suppression exp-card-2 : état cvData + renumérotation titres', () => {
    const env = createEnv();
    const sb  = loadSandbox(src, env);

    const ctr = env.makeEl('experiences-container');
    const c1  = buildCard(env, 'exp-card-1', 'Expérience 1', 'experience');
    const c2  = buildCard(env, 'exp-card-2', 'Expérience 2', 'experience');
    const c3  = buildCard(env, 'exp-card-3', 'Expérience 3', 'experience');
    ctr.appendChild(c1);
    ctr.appendChild(c2);
    ctr.appendChild(c3);

    sb.cvData.experiences = [{ poste: 'A' }, { poste: 'B' }, { poste: 'C' }];

    sb.removeCard('exp-card-2', 'experiences', 2);

    /* état des données */
    assert.equal(sb.cvData.experiences.length, 2, 'deux expériences restantes');
    assert.equal(sb.cvData.experiences[0].poste, 'A', 'expérience A conservée en position 0');
    assert.equal(sb.cvData.experiences[1].poste, 'C', 'expérience C décalée en position 1');

    /* état du DOM : exp-card-2 absente, les deux autres présentes */
    assert.equal(env.registry.has('exp-card-2'), false, 'exp-card-2 retirée du registry');
    assert.equal(env.registry.has('exp-card-1'), true,  'exp-card-1 toujours présente');
    assert.equal(env.registry.has('exp-card-3'), true,  'exp-card-3 toujours présente (id stable, titre renommé)');

    /* renumérotation des titres */
    const s1 = env.registry.get('exp-card-1').querySelector('[data-cvf-card-title]');
    const s3 = env.registry.get('exp-card-3').querySelector('[data-cvf-card-title]');
    assert.ok(s1 !== null, 'span titre exp-card-1 présent');
    assert.ok(s3 !== null, 'span titre exp-card-3 présent');
    assert.ok(s1.textContent.endsWith(' 1'), `exp-card-1 doit se terminer par " 1" (reçu : "${s1.textContent}")`);
    assert.ok(s3.textContent.endsWith(' 2'), `exp-card-3 renommée "Expérience 2" (reçu : "${s3.textContent}")`);
  });

  /* ── Scénario 2 : supprimer form-card-1 parmi 2 ─────────────────────────── */
  test('removeCard — suppression form-card-1 : renumérotation formation', () => {
    const env = createEnv();
    const sb  = loadSandbox(src, env);

    const ctr = env.makeEl('formations-container');
    const f1  = buildCard(env, 'form-card-1', 'Formation 1', 'formation');
    const f2  = buildCard(env, 'form-card-2', 'Formation 2', 'formation');
    ctr.appendChild(f1);
    ctr.appendChild(f2);

    sb.cvData.formations = [{ diplome: 'BTS' }, { diplome: 'Licence' }];

    sb.removeCard('form-card-1', 'formations', 1);

    /* état */
    assert.equal(sb.cvData.formations.length, 1, 'une formation restante');
    assert.equal(sb.cvData.formations[0].diplome, 'Licence', 'la Licence reste en position 0');

    /* DOM */
    assert.equal(env.registry.has('form-card-1'), false, 'form-card-1 retirée du registry');
    assert.equal(env.registry.has('form-card-2'), true,  'form-card-2 conservée');

    /* renommage */
    const span = env.registry.get('form-card-2').querySelector('[data-cvf-card-title]');
    assert.ok(span !== null, 'span titre form-card-2 trouvé');
    assert.ok(span.textContent.endsWith(' 1'), `form-card-2 renommée "Formation 1" (reçu : "${span.textContent}")`);
  });

  /* ── Scénario 3 : supprimer lang-card-1 parmi 2 ─────────────────────────── */
  test('removeCard — suppression lang-card-1 : état cvData synchronisé', () => {
    const env = createEnv();
    const sb  = loadSandbox(src, env);

    const ctr = env.makeEl('langues-container');
    const l1  = buildCard(env, 'lang-card-1', 'Langue 1', 'langue');
    const l2  = buildCard(env, 'lang-card-2', 'Langue 2', 'langue');
    ctr.appendChild(l1);
    ctr.appendChild(l2);

    sb.cvData.langues = [
      { langue: 'Français', niveau: 'Natif'  },
      { langue: 'Créole',   niveau: 'Courant' }
    ];

    sb.removeCard('lang-card-1', 'langues', 1);

    /* état */
    assert.equal(sb.cvData.langues.length, 1, 'une langue restante');
    assert.equal(sb.cvData.langues[0].langue, 'Créole', 'la langue Créole reste');

    /* DOM */
    assert.equal(env.registry.has('lang-card-1'), false, 'lang-card-1 retirée du registry');
    assert.equal(env.registry.has('lang-card-2'), true,  'lang-card-2 conservée');

    /* renommage */
    const span = env.registry.get('lang-card-2').querySelector('[data-cvf-card-title]');
    assert.ok(span !== null, 'span titre lang-card-2 trouvé');
    assert.ok(span.textContent.endsWith(' 1'), `lang-card-2 renommée "Langue 1" (reçu : "${span.textContent}")`);
  });

  /* ── Scénario 4 : reset suggestions-formation_N au changement de poste ──── */
  test('triggerSuggestions — nouveau poste vide les containers formation_N et retire data-frozen', () => {
    const env = createEnv();
    const sb  = loadSandbox(src, env);

    /*
     * suggestions-accroche doit exister sinon triggerSuggestions retourne
     * immédiatement (container null en début de fonction).
     */
    env.makeEl('suggestions-accroche');

    /* Deux containers formation avec contenu et data-frozen = 'true' */
    const sf1 = env.makeEl('suggestions-formation_1');
    sf1.innerHTML           = 'chip-existant-1';
    sf1._attrs['data-frozen'] = 'true';

    const sf2 = env.makeEl('suggestions-formation_2');
    sf2.innerHTML           = 'chip-existant-2';
    sf2._attrs['data-frozen'] = 'true';

    /*
     * lastPoste est '' (DOMContentLoaded non déclenché dans le sandbox).
     * 'NouveauPoste' !== '' et length >= 3 → le bloc isPosteField s'exécute.
     */
    sb.triggerSuggestions('accroche', 'NouveauPoste', '');

    assert.equal(sf1.innerHTML, '',
      'suggestions-formation_1 : innerHTML vidé après changement de poste');
    assert.equal(sf1.getAttribute('data-frozen'), null,
      'suggestions-formation_1 : data-frozen retiré');

    assert.equal(sf2.innerHTML, '',
      'suggestions-formation_2 : innerHTML vidé après changement de poste');
    assert.equal(sf2.getAttribute('data-frozen'), null,
      'suggestions-formation_2 : data-frozen retiré');
  });
});
