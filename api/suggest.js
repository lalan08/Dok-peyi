export const config = { runtime: 'edge' };

/* ── POST /api/suggest ─────────────────────────────────────────────────────
   Génère des suggestions IA pour les champs du formulaire CV.
   Body : { field, poste, context? }
   Retourne : { suggestions: string[] }
   ─────────────────────────────────────────────────────────────────────── */

import { rateLimit } from '../lib/rate-limit.js';
import { CORS }      from '../lib/edge-response.js';

const VALID_FIELDS = ['accroche', 'missions', 'competences', 'interets'];

const SYSTEM = 'Tu es un expert en rédaction de CV professionnels en France et en Guyane française. Tu génères des suggestions courtes, précises et professionnelles adaptées au contexte guyanais. Réponds UNIQUEMENT en JSON valide sans markdown.';

function buildPrompt(field, poste, context) {
  var p = poste || 'ce poste';
  if (field === 'accroche')
    return 'Génère 4 accroches professionnelles courtes (2-3 phrases max) pour un(e) ' + p + '. Contexte Guyane française. Réponds en JSON : {"suggestions": ["...", ...]}';
  if (field === 'missions')
    return 'Génère 5 missions professionnelles courtes (1 ligne chacune) typiques pour un(e) ' + p + '.' +
      (context ? ' Entreprise : ' + context : '') +
      ' Commence chaque mission par un verbe d\'action. Réponds en JSON : {"suggestions": ["...", ...]}';
  if (field === 'competences')
    return 'Génère 8 compétences clés recherchées pour un(e) ' + p + ' en Guyane française. Compétences courtes (2-4 mots max). Réponds en JSON : {"suggestions": ["...", ...]}';
  if (field === 'interets')
    return 'Génère 6 centres d\'intérêt professionnellement valorisants pour un(e) ' + p + '. Courts, variés, adaptés au contexte guyanais et caribéen. Réponds en JSON : {"suggestions": ["...", ...]}';
}

export default async function handler(req) {
  const jsonH = { ...CORS, 'content-type': 'application/json' };

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST')
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: jsonH });

  const rl = rateLimit(req, { max: 10, windowMs: 60_000 });
  if (!rl.ok)
    return new Response(JSON.stringify({ error: 'Trop de requêtes — réessayez dans une minute.' }), {
      status: 429, headers: { ...jsonH, 'Retry-After': '60' }
    });

  let body;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: 'Corps JSON invalide.' }), { status: 400, headers: jsonH });
  }

  const { field, poste, context } = body || {};
  if (!field || !VALID_FIELDS.includes(field))
    return new Response(JSON.stringify({ error: 'Champ invalide. Valeurs acceptées : ' + VALID_FIELDS.join(', ') }), {
      status: 400, headers: jsonH
    });

  const apiKey = process.env.CLAUD_API_KEY;
  console.log('[suggest] env keys available:', Object.keys(process.env).filter(function(k) { return k.includes('CLAUD') || k.includes('API'); }));
  console.log('[suggest] CLAUD_API_KEY present:', !!process.env.CLAUD_API_KEY);
  console.log('[suggest] field received:', field);
  console.log('[suggest] poste received:', poste);
  if (!apiKey)
    return new Response(JSON.stringify({ error: 'Service IA indisponible.' }), { status: 503, headers: jsonH });

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key':           apiKey,
        'anthropic-version':   '2023-06-01',
        'content-type':        'application/json'
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system:     SYSTEM,
        messages:   [{ role: 'user', content: buildPrompt(field, poste, context) }]
      })
    });
    console.log('[suggest] anthropic status:', upstream.status);
    const rawText = await upstream.text();
    console.log('[suggest] raw response:', rawText.substring(0, 200));
    if (!upstream.ok) throw new Error('Anthropic ' + upstream.status);
    const anthropicData = JSON.parse(rawText);
    const text   = anthropicData.content?.[0]?.text || '{}';
    const parsed = JSON.parse(text);
    return new Response(JSON.stringify({ suggestions: parsed.suggestions || [] }), { status: 200, headers: jsonH });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Erreur génération suggestions.', suggestions: [] }), {
      status: 500, headers: jsonH
    });
  }
}
