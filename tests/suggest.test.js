import { describe, test, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const suggestPath = path.join(__dirname, '..', 'api', 'suggest.js');

describe('api/suggest.js — structure', () => {
  let src;
  before(async () => { src = await fs.readFile(suggestPath, 'utf8'); });

  test('exports edge runtime config', () => {
    assert.match(src, /export const config\s*=\s*\{[^}]*runtime\s*:\s*['"]edge['"]/);
  });

  test('imports rateLimit from lib/rate-limit.js', () => {
    assert.match(src, /from ['"]\.\.\/lib\/rate-limit\.js['"]/);
  });

  test('imports CORS from lib/edge-response.js', () => {
    assert.match(src, /from ['"]\.\.\/lib\/edge-response\.js['"]/);
  });

  test('validates only accepted fields', () => {
    assert.match(src, /VALID_FIELDS/);
    assert.match(src, /accroche/);
    assert.match(src, /missions/);
    assert.match(src, /competences/);
    assert.match(src, /interets/);
  });

  test('returns 400 on invalid field', () => {
    assert.match(src, /400/);
    assert.match(src, /Champ invalide/);
  });

  test('returns 503 when CLAUD_API_KEY is absent', () => {
    assert.match(src, /503/);
    assert.match(src, /No API key/);
  });

  test('returns 429 on rate limit exceeded', () => {
    assert.match(src, /429/);
    assert.match(src, /Trop de requêtes/);
  });

  test('calls claude-haiku model', () => {
    assert.match(src, /claude-haiku-4-5-20251001/);
  });

  test('max_tokens is 300', () => {
    assert.match(src, /max_tokens\s*:\s*300/);
  });

  test('buildPrompt generates prompt for each field', () => {
    assert.match(src, /accroches professionnelles/);
    assert.match(src, /missions professionnelles/);
    assert.match(src, /comp.tences cl.s/);
    assert.match(src, /centres d/);
  });

  test('returns suggestions array in success response', () => {
    assert.match(src, /Array\.isArray\(suggestions\)/);
  });
});

describe('api/suggest.js — handler logic (mock)', () => {
  test('POST without body returns 400', async () => {
    const handler = (await import(suggestPath)).default;
    const req = new Request('http://localhost/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json'
    });
    const res = await handler(req);
    assert.equal(res.status, 400);
  });

  test('POST with invalid field returns 400', async () => {
    const handler = (await import(suggestPath)).default;
    const req = new Request('http://localhost/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field: 'invalid_field', poste: 'test' })
    });
    const res = await handler(req);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.match(data.error, /Champ invalide/);
  });

  test('POST with valid field but no CLAUD_API_KEY returns 503', async () => {
    const savedKey = process.env.CLAUD_API_KEY;
    delete process.env.CLAUD_API_KEY;
    const mod = await import(suggestPath + '?bust=' + Date.now());
    const handler = mod.default;
    const req = new Request('http://localhost/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field: 'accroche', poste: 'Assistant' })
    });
    const res = await handler(req);
    assert.equal(res.status, 503);
    const data = await res.json();
    assert.match(data.error, /No API key/);
    if (savedKey) process.env.CLAUD_API_KEY = savedKey;
  });
});
