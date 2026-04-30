/* ===================================================
   cv-templates-render.js — Rendu pixel-perfect des 12 templates CV
   Expose : window.CV_TEMPLATES_RENDER.render(templateId, data)
            window.CV_TEMPLATES_RENDER.list()
   =================================================== */

(function () {
  'use strict';

  /* ── Helpers ── */

  function esc(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderMissions(text) {
    if (!text) return '';
    var lines = String(text).split('\n')
      .map(function (l) { return l.replace(/^\s*[•\-]\s*/, '').trim(); })
      .filter(Boolean);
    if (!lines.length) return '';
    return '<ul style="margin:4px 0 0 0;padding-left:14px;list-style:disc;">' +
      lines.map(function (l) {
        return '<li style="margin:2px 0;font-size:9px;line-height:1.4;">' + esc(l) + '</li>';
      }).join('') + '</ul>';
  }

  function renderAccroche(text) {
    if (!text) return '';
    return esc(text).replace(/\n/g, '<br>');
  }

  function getInitials(prenom, nom) {
    var p = (prenom || '').charAt(0).toUpperCase();
    var n = (nom || '').charAt(0).toUpperCase();
    return p + n || '?';
  }

  function extractData(data) {
    var id = data.identite || {};
    var pr = data.profil || {};
    var ex = data.extras || {};
    var prenom = esc(id.prenom || '');
    var nom    = esc((id.nom || '').toUpperCase());
    var fullName = (prenom + (nom ? ' ' + nom : '')).trim() || 'Prénom NOM';
    var poste    = esc(pr.poste || '');
    var accroche = renderAccroche(pr.accroche || '');
    var email    = esc(id.email    || '');
    var tel      = esc(id.tel      || '');
    var ville    = esc(id.ville    || '');
    var cp       = esc(id.codepostal || '');
    var linkedin = esc(id.linkedin || '');
    var location = [ville, cp].filter(Boolean).join(' ');
    var exps  = (data.experiences || []).filter(Boolean);
    var fors  = (data.formations  || []).filter(Boolean);
    var comps = (data.competences || []).filter(Boolean);
    var langs = (data.langues     || []).filter(Boolean);
    var certs    = (ex.certifications || '').split(',').map(function (c) { return c.trim(); }).filter(Boolean);
    var interets = (ex.interets || '').split(',').map(function (c) { return c.trim(); }).filter(Boolean);
    var infos    = ex.infos || '';
    return {
      prenom: prenom, nom: nom, fullName: fullName,
      poste: poste, accroche: accroche,
      email: email, tel: tel, ville: ville, cp: cp,
      linkedin: linkedin, location: location,
      exps: exps, fors: fors, comps: comps, langs: langs,
      certs: certs, interets: interets, infos: infos
    };
  }

  /* ── T01 — ÉPURÉ ── */
  /* Fond blanc, barre noire 6px gauche, 2 colonnes (exp+form / contact+skills), photo ronde */
  function render01(data) {
    var d = extractData(data);

    var sHead = function (label) {
      return '<div style="text-transform:uppercase;font-size:9px;font-weight:800;' +
        'letter-spacing:2px;color:#111;border-bottom:2px solid #111;' +
        'padding-bottom:4px;margin-bottom:10px">' + label + '</div>';
    };

    var photoHtml = '';
    if (data.withPhoto) {
      photoHtml = data.photo
        ? '<img src="' + esc(data.photo) + '" style="width:60px;height:60px;' +
          'border-radius:50%;object-fit:cover;border:3px solid #111;flex-shrink:0">'
        : '<div style="width:60px;height:60px;border-radius:50%;background:#bbb;' +
          'border:3px solid #111;flex-shrink:0"></div>';
    }

    var expHtml = d.exps.map(function (e) {
      return '<div style="margin-bottom:12px">' +
        '<div style="display:flex;justify-content:space-between">' +
          '<div style="font-size:11px;font-weight:700;color:#111">' + esc(e.entreprise || '') + '</div>' +
          '<div style="font-size:9px;color:#777">' + esc(e.debut || '') + (e.fin ? ' – ' + esc(e.fin) : '') + '</div>' +
        '</div>' +
        '<div style="font-size:9px;color:#555;margin-top:2px;font-style:italic">' +
          esc(e.poste || '') + (e.lieu ? ' · ' + esc(e.lieu) : '') +
        '</div>' +
        (e.missions ? renderMissions(e.missions) : '') +
      '</div>';
    }).join('');

    var forHtml = d.fors.map(function (f) {
      return '<div style="margin-bottom:8px">' +
        '<div style="display:flex;justify-content:space-between">' +
          '<div style="font-size:11px;font-weight:700;color:#111">' + esc(f.diplome || '') + '</div>' +
          '<div style="font-size:9px;color:#777">' + esc(f.annee || '') + '</div>' +
        '</div>' +
        '<div style="font-size:9px;color:#777;margin-top:2px">' + esc(f.etablissement || '') + '</div>' +
      '</div>';
    }).join('');

    var compHtml = d.comps.map(function (c) {
      return '<div style="font-size:9px;color:#333;margin-bottom:3px">' + esc(c) + '</div>' +
        '<div style="height:3px;background:#e0e0e0;border-radius:2px;margin-bottom:7px">' +
          '<div style="width:80%;height:3px;background:#111;border-radius:2px"></div>' +
        '</div>';
    }).join('');

    var langHtml = d.langs.map(function (l) {
      return '<div style="font-size:9px;color:#333;margin-bottom:3px">' +
        esc(l.langue || '') + (l.niveau ? ' — ' + esc(l.niveau) : '') +
      '</div>';
    }).join('');

    var certHtml = d.certs.map(function (c) {
      return '<div style="font-size:9px;color:#333;margin-bottom:3px">' + esc(c) + '</div>';
    }).join('');

    var intHtml = d.interets.map(function (c) {
      return '<div style="font-size:9px;color:#333;margin-bottom:3px">' + esc(c) + '</div>';
    }).join('');

    var contactHtml = '';
    if (d.email || d.tel || d.location || d.linkedin) {
      contactHtml = sHead('Contact') +
        (d.email    ? '<div style="font-size:9px;color:#333;margin-bottom:4px">✉ ' + d.email    + '</div>' : '') +
        (d.tel      ? '<div style="font-size:9px;color:#333;margin-bottom:4px">☎ ' + d.tel      + '</div>' : '') +
        (d.location ? '<div style="font-size:9px;color:#333;margin-bottom:4px">⌖ ' + d.location + '</div>' : '') +
        (d.linkedin ? '<div style="font-size:9px;color:#333;margin-bottom:14px">🔗 ' + d.linkedin + '</div>' : '');
    }

    return '<div style="background:#fff;display:flex;min-height:1122px;' +
      'font-family:Arial,sans-serif;width:794px;box-sizing:border-box">' +
      '<div style="width:6px;background:#111;flex-shrink:0"></div>' +
      '<div style="flex:1;padding:32px 28px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;' +
          'padding-bottom:16px;border-bottom:2.5px solid #111;margin-bottom:16px">' +
          '<div>' +
            '<div style="font-size:28px;font-weight:900;color:#111;letter-spacing:3px">' + d.fullName + '</div>' +
            '<div style="font-size:11px;color:#555;letter-spacing:2px;text-transform:uppercase;margin-top:5px">' + d.poste + '</div>' +
            (d.accroche ? '<div style="font-size:9px;color:#666;margin-top:6px;line-height:1.4;max-width:400px">' + d.accroche + '</div>' : '') +
          '</div>' +
          photoHtml +
        '</div>' +
        '<div style="display:flex;gap:24px">' +
          '<div style="flex:0 0 62%">' +
            (expHtml ? sHead('Expériences Professionnelles') + expHtml : '') +
            (forHtml ? sHead('Formation') + forHtml : '') +
            (d.infos ? sHead('Informations') + '<p style="font-size:9px;color:#444;line-height:1.6">' + renderAccroche(d.infos) + '</p>' : '') +
          '</div>' +
          '<div style="flex:0 0 35%">' +
            contactHtml +
            (compHtml ? sHead('Compétences') + compHtml : '') +
            (langHtml ? sHead('Langues') + langHtml : '') +
            (certHtml ? sHead('Certifications') + certHtml : '') +
            (intHtml  ? sHead('Intérêts') + intHtml : '') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ── T02 — SIDEBAR SOMBRE ── */
  /* Sidebar noire (#1a1a1a), accent bleu #3b82f6, border-left sur exp */
  function render02(data) {
    var d = extractData(data);
    var ACCENT = '#3b82f6';

    var photoHtml = '';
    if (data.withPhoto) {
      photoHtml = '<div style="text-align:center;margin-bottom:12px">' +
        (data.photo
          ? '<img src="' + esc(data.photo) + '" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid ' + ACCENT + ';display:inline-block">'
          : '<div style="width:72px;height:72px;border-radius:50%;background:' + ACCENT + ';border:3px solid ' + ACCENT + ';display:inline-block"></div>') +
        '</div>';
    }

    var sHead = function (label) {
      return '<div style="font-size:9px;font-weight:800;letter-spacing:2px;' +
        'text-transform:uppercase;color:' + ACCENT + ';margin-bottom:10px">' + label + '</div>';
    };

    var sbHead = function (label) {
      return '<div style="color:#94a3b8;font-size:8px;letter-spacing:1.5px;text-transform:uppercase;' +
        'font-weight:700;margin-bottom:7px;border-bottom:1px solid #333;padding-bottom:4px">' + label + '</div>';
    };

    var compHtml = d.comps.map(function (c) {
      return '<div style="color:#ccc;font-size:8px;margin-bottom:3px">' + esc(c) + '</div>' +
        '<div style="height:3px;background:#333;border-radius:2px;margin-bottom:7px">' +
          '<div style="width:80%;height:3px;background:' + ACCENT + ';border-radius:2px"></div>' +
        '</div>';
    }).join('');

    var sidebarHtml = photoHtml +
      '<div style="text-align:center;color:#fff;font-size:13px;font-weight:800;letter-spacing:1px;margin-bottom:3px">' + d.fullName + '</div>' +
      '<div style="text-align:center;color:' + ACCENT + ';font-size:8px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:18px">' + d.poste + '</div>' +
      sbHead('Contact') +
      (d.email    ? '<div style="color:#ccc;font-size:8px;margin-bottom:3px">✉ ' + d.email    + '</div>' : '') +
      (d.tel      ? '<div style="color:#ccc;font-size:8px;margin-bottom:3px">☎ ' + d.tel      + '</div>' : '') +
      (d.location ? '<div style="color:#ccc;font-size:8px;margin-bottom:3px">⌖ ' + d.location + '</div>' : '') +
      (d.linkedin ? '<div style="color:#ccc;font-size:8px;margin-bottom:16px">🔗 ' + d.linkedin + '</div>' : '<div style="margin-bottom:16px"></div>') +
      (compHtml ? sbHead('Compétences') + compHtml : '') +
      (d.langs.length ? sbHead('Langues') +
        d.langs.map(function (l) {
          return '<div style="color:#ccc;font-size:8px;margin-bottom:2px">' +
            esc(l.langue || '') + (l.niveau ? ' — ' + esc(l.niveau) : '') + '</div>';
        }).join('') + '<div style="margin-bottom:14px"></div>' : '') +
      (d.certs.length ? sbHead('Certifications') +
        d.certs.map(function (c) {
          return '<div style="color:#ccc;font-size:8px;margin-bottom:2px">' + esc(c) + '</div>';
        }).join('') : '') +
      (d.interets.length ? '<div style="margin-top:12px">' + sbHead('Intérêts') +
        d.interets.map(function (c) {
          return '<div style="color:#ccc;font-size:8px;margin-bottom:2px">' + esc(c) + '</div>';
        }).join('') + '</div>' : '');

    var expHtml = d.exps.map(function (e, i) {
      var bc = i === 0 ? ACCENT : '#e2e8f0';
      return '<div style="margin-bottom:10px;padding-left:10px;border-left:3px solid ' + bc + '">' +
        '<div style="display:flex;justify-content:space-between">' +
          '<div style="font-size:10px;font-weight:700;color:#111">' + esc(e.entreprise || '') + '</div>' +
          '<div style="font-size:8px;color:#888">' + esc(e.debut || '') + (e.fin ? ' – ' + esc(e.fin) : '') + '</div>' +
        '</div>' +
        '<div style="font-size:8px;color:#555;margin-top:2px;font-style:italic">' + esc(e.poste || '') + (e.lieu ? ' · ' + esc(e.lieu) : '') + '</div>' +
        (e.missions ? renderMissions(e.missions) : '') +
      '</div>';
    }).join('');

    var forHtml = d.fors.map(function (f, i) {
      var bc = i === 0 ? ACCENT : '#e2e8f0';
      return '<div style="margin-bottom:8px;padding-left:10px;border-left:3px solid ' + bc + '">' +
        '<div style="display:flex;justify-content:space-between">' +
          '<div style="font-size:10px;font-weight:700;color:#111">' + esc(f.diplome || '') + '</div>' +
          '<div style="font-size:8px;color:#888">' + esc(f.annee || '') + '</div>' +
        '</div>' +
        '<div style="font-size:8px;color:#777;margin-top:2px">' + esc(f.etablissement || '') + '</div>' +
      '</div>';
    }).join('');

    return '<div style="background:#fff;display:flex;min-height:1122px;' +
      'font-family:Arial,sans-serif;width:794px;box-sizing:border-box">' +
      '<div style="width:270px;background:#1a1a1a;padding:32px 20px;flex-shrink:0">' + sidebarHtml + '</div>' +
      '<div style="flex:1;padding:32px 24px">' +
        (d.accroche ? sHead('Profil') + '<div style="font-size:9px;color:#444;line-height:1.6;margin-bottom:16px">' + d.accroche + '</div>' : '') +
        (expHtml ? sHead('Expériences Professionnelles') + expHtml : '') +
        (forHtml ? '<div style="margin-top:12px">' + sHead('Formation') + forHtml + '</div>' : '') +
        (d.infos ? '<div style="margin-top:12px">' + sHead('Informations') + '<p style="font-size:9px;color:#555;line-height:1.6">' + renderAccroche(d.infos) + '</p></div>' : '') +
      '</div>' +
    '</div>';
  }

  /* ── T03 — BRUN PREMIUM ── */
  /* bg:#f9f4ef, sidebar chocolat #3d2b1f, accent crème #c4a882, stars de compétence, timeline à points */
  function render03(data) {
    var d = extractData(data);
    var DARK   = '#3d2b1f';
    var ACCENT = '#c4a882';
    var BG     = '#f9f4ef';

    var photoHtml = '';
    if (data.withPhoto) {
      photoHtml = '<div style="text-align:center;margin-bottom:12px">' +
        (data.photo
          ? '<img src="' + esc(data.photo) + '" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid ' + ACCENT + ';display:inline-block">'
          : '<div style="width:72px;height:72px;border-radius:50%;background:' + ACCENT + ';border:3px solid ' + ACCENT + ';display:inline-block;margin:0 auto"></div>') +
        '</div>';
    }

    var compHtml = d.comps.map(function (c, i) {
      var stars = (i % 5 < 4) ? '★★★★★' : '★★★★☆';
      return '<div style="display:flex;align-items:center;gap:5px;margin-bottom:5px">' +
        '<span style="color:' + ACCENT + ';font-size:10px">' + stars + '</span>' +
        '<span style="color:#f5e6d3;font-size:8px">' + esc(c) + '</span>' +
      '</div>';
    }).join('');

    var sidebarHtml = photoHtml +
      '<div style="text-align:center;color:#f5e6d3;font-size:12px;font-weight:700;margin-bottom:3px">' + d.fullName + '</div>' +
      '<div style="text-align:center;color:' + ACCENT + ';font-size:8px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:18px">' + d.poste + '</div>' +
      '<div style="color:' + ACCENT + ';font-size:7px;letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-bottom:6px">Contact</div>' +
      (d.email    ? '<div style="color:#f5e6d3;font-size:8px;margin-bottom:3px">✉ ' + d.email    + '</div>' : '') +
      (d.tel      ? '<div style="color:#f5e6d3;font-size:8px;margin-bottom:3px">☎ ' + d.tel      + '</div>' : '') +
      (d.location ? '<div style="color:#f5e6d3;font-size:8px;margin-bottom:3px">⌖ ' + d.location + '</div>' : '') +
      (d.linkedin ? '<div style="color:#f5e6d3;font-size:8px;margin-bottom:14px">🔗 ' + d.linkedin + '</div>' : '<div style="margin-bottom:14px"></div>') +
      (compHtml ? '<div style="color:' + ACCENT + ';font-size:7px;letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-bottom:8px">Compétences</div>' + compHtml + '<div style="margin-bottom:14px"></div>' : '') +
      (d.langs.length ? '<div style="color:' + ACCENT + ';font-size:7px;letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-bottom:6px">Langues</div>' +
        d.langs.map(function (l) {
          return '<div style="color:#f5e6d3;font-size:8px;margin-bottom:2px">' +
            esc(l.langue || '') + (l.niveau ? ' — ' + esc(l.niveau) : '') + '</div>';
        }).join('') + '<div style="margin-bottom:14px"></div>' : '') +
      (d.certs.length ? '<div style="color:' + ACCENT + ';font-size:7px;letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-bottom:6px">Certifications</div>' +
        d.certs.map(function (c) {
          return '<div style="color:#f5e6d3;font-size:8px;margin-bottom:2px">' + esc(c) + '</div>';
        }).join('') : '') +
      (d.interets.length ? '<div style="color:' + ACCENT + ';font-size:7px;letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-bottom:6px;margin-top:12px">Intérêts</div>' +
        d.interets.map(function (c) {
          return '<div style="color:#f5e6d3;font-size:8px;margin-bottom:2px">' + esc(c) + '</div>';
        }).join('') : '');

    var expHtml = d.exps.map(function (e, i) {
      var primary = (i === 0);
      var hasSub  = (i < d.exps.length - 1);
      var dot = primary
        ? '<div style="width:9px;height:9px;border-radius:50%;background:' + DARK + ';margin-top:2px;flex-shrink:0"></div>'
        : '<div style="width:9px;height:9px;border-radius:50%;background:' + ACCENT + ';margin-top:2px;flex-shrink:0"></div>';
      var line = hasSub
        ? '<div style="width:2px;flex:1;background:' + ACCENT + ';margin-top:2px"></div>'
        : '';
      return '<div style="display:flex;gap:10px;margin-bottom:10px">' +
        '<div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">' + dot + line + '</div>' +
        '<div>' +
          '<div style="display:flex;justify-content:space-between">' +
            '<div style="font-size:10px;font-weight:700;color:' + DARK + '">' + esc(e.entreprise || '') + '</div>' +
            '<div style="font-size:8px;color:#8b6347">' + esc(e.debut || '') + (e.fin ? ' – ' + esc(e.fin) : '') + '</div>' +
          '</div>' +
          '<div style="font-size:8px;color:#8b6347;margin-top:1px;font-style:italic">' + esc(e.poste || '') + (e.lieu ? ' · ' + esc(e.lieu) : '') + '</div>' +
          (e.missions ? renderMissions(e.missions) : '') +
        '</div>' +
      '</div>';
    }).join('');

    var forHtml = d.fors.map(function (f, i) {
      var primary = (i === 0);
      var dot = primary
        ? '<div style="width:9px;height:9px;border-radius:50%;background:' + DARK + ';margin-top:2px;flex-shrink:0"></div>'
        : '<div style="width:9px;height:9px;border-radius:50%;background:' + ACCENT + ';margin-top:2px;flex-shrink:0"></div>';
      return '<div style="display:flex;gap:10px;margin-bottom:8px">' +
        '<div style="flex-shrink:0">' + dot + '</div>' +
        '<div>' +
          '<div style="display:flex;justify-content:space-between">' +
            '<div style="font-size:10px;font-weight:700;color:' + DARK + '">' + esc(f.diplome || '') + '</div>' +
            '<div style="font-size:8px;color:#8b6347">' + esc(f.annee || '') + '</div>' +
          '</div>' +
          '<div style="font-size:8px;color:#8b6347;margin-top:1px">' + esc(f.etablissement || '') + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    return '<div style="background:' + BG + ';display:flex;min-height:1122px;' +
      'font-family:Georgia,serif;width:794px;box-sizing:border-box">' +
      '<div style="width:248px;background:' + DARK + ';padding:32px 18px;flex-shrink:0">' + sidebarHtml + '</div>' +
      '<div style="flex:1;padding:32px 24px">' +
        '<div style="background:' + DARK + ';border-radius:6px;padding:10px 18px;margin-bottom:18px">' +
          '<div style="font-size:20px;font-weight:700;color:#fff;letter-spacing:1px">' + d.fullName + '</div>' +
          '<div style="font-size:9px;color:' + ACCENT + ';letter-spacing:2px;text-transform:uppercase;margin-top:3px">' + d.poste + '</div>' +
        '</div>' +
        (d.accroche ? '<div style="font-size:9px;color:#555;line-height:1.5;margin-bottom:14px;border-left:3px solid ' + ACCENT + ';padding-left:10px">' + d.accroche + '</div>' : '') +
        (expHtml ? '<div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:' + DARK + ';margin-bottom:12px">Expériences Professionnelles</div>' + expHtml : '') +
        (forHtml ? '<div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:' + DARK + ';margin-bottom:10px;margin-top:4px">Formation</div>' + forHtml : '') +
        (d.infos ? '<div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:' + DARK + ';margin:12px 0 8px">Informations</div>' +
          '<p style="font-size:9px;color:#555;line-height:1.6">' + renderAccroche(d.infos) + '</p>' : '') +
      '</div>' +
    '</div>';
  }

  /* ── Registre (sera complété livraison 2, 3, 4) ── */
  var TEMPLATE_RENDERERS = {
    '01': render01,
    '02': render02,
    '03': render03
  };

  window.CV_TEMPLATES_RENDER = {
    render: function (templateId, data) {
      var fn = TEMPLATE_RENDERERS[templateId];
      if (!fn) {
        var fallback = TEMPLATE_RENDERERS['01'];
        return fallback ? fallback(data) : '<div>Template not found</div>';
      }
      return fn(data);
    },
    list: function () {
      return Object.keys(TEMPLATE_RENDERERS);
    }
  };

})();
