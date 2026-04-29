import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceCssPath = path.join(__dirname, '..', 'service.css');

describe('service.css integrity', () => {
  test('contains no NUL bytes', async () => {
    const css = await fs.readFile(serviceCssPath);
    assert.equal(css.includes(0), false);
  });

  test('is valid UTF-8 text', async () => {
    const css = await fs.readFile(serviceCssPath);
    assert.doesNotThrow(() => new TextDecoder('utf-8', { fatal: true }).decode(css));
  });
});
