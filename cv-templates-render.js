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

  /* ── T01 — ÉPURÉ ──
     Extraction littérale cv-wizard.html data-tpl-id="01" (lignes 75-170).
     width:794px fixe (A4), layout flex : bande 6px noire + padding 28px 24px.
     Header : nom 24px + poste + accroche à gauche, photo 54px cercle à droite.
     Body : col gauche flex 0 0 65% (expériences + formation),
            col droite flex 0 0 32% (contact + compétences barres + langues + certs). */
  function render01(data) {
    var d   = data || {};
    var id  = d.identite || {};
    var pr  = d.profil   || {};
    var ex  = (d.experiences || []).filter(Boolean);
    var fo  = (d.formations  || []).filter(Boolean);
    var co  = (d.competences || []).filter(Boolean);
    var la  = (d.langues     || []).filter(Boolean);
    var et  = d.extras || {};
    var showPhoto = d.withPhoto && d.photo;

    function expBlock(e) {
      var missions = String(e.missions || '')
        .split('\n')
        .map(function (m) { return m.replace(/^\s*[•\-]\s*/, '').trim(); })
        .filter(Boolean);
      var ul = missions.length
        ? '<ul style="font-size:9px;color:#444;margin:5px 0 0 14px;padding:0;line-height:1.5">' +
          missions.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') +
          '</ul>'
        : '';
      return '<div style="margin-bottom:12px">' +
        '<div style="display:flex;justify-content:space-between">' +
          '<div style="font-size:11px;font-weight:700;color:#111">' + esc(e.entreprise || '') + '</div>' +
          '<div style="font-size:9px;color:#777">' + esc(e.debut || '') + (e.fin ? ' – ' + esc(e.fin) : '') + '</div>' +
        '</div>' +
        '<div style="font-size:9px;color:#555;margin-top:2px;font-style:italic">' +
          esc(e.poste || '') + (e.lieu ? ' · ' + esc(e.lieu) : '') +
        '</div>' +
        ul +
      '</div>';
    }

    function forBlock(f) {
      return '<div style="margin-bottom:8px">' +
        '<div style="display:flex;justify-content:space-between">' +
          '<div style="font-size:11px;font-weight:700;color:#111">' +
            esc(f.diplome || '') + (f.mention ? ' — Mention ' + esc(f.mention) : '') +
          '</div>' +
          '<div style="font-size:9px;color:#777">' + esc(f.annee || '') + '</div>' +
        '</div>' +
        '<div style="font-size:9px;color:#777;margin-top:2px">' + esc(f.etablissement || '') + '</div>' +
      '</div>';
    }

    function compBlock(c, i) {
      var pct = i < 3 ? 95 : 80;
      return '<div style="font-size:9px;color:#333;margin-bottom:3px">' + esc(c) + '</div>' +
        '<div style="height:3px;background:#e0e0e0;border-radius:2px;margin-bottom:7px">' +
          '<div style="width:' + pct + '%;height:3px;background:#111;border-radius:2px"></div>' +
        '</div>';
    }

    function langBlock(l) {
      return '<div style="font-size:9px;color:#333;margin-bottom:3px">' +
        esc(l.langue || '') + (l.niveau ? ' — ' + esc(l.niveau) : '') +
      '</div>';
    }

    var photoHtml = showPhoto
      ? '<div class="cv-photo-zone" style="width:54px;height:54px;border-radius:50%;' +
        'background-image:url(\'' + esc(d.photo) + '\');background-size:cover;' +
        'background-position:center;border:3px solid #111;flex-shrink:0"></div>'
      : (d.withPhoto
        ? '<div class="cv-photo-zone" style="width:54px;height:54px;border-radius:50%;' +
          'background:#bbb;border:3px solid #111;flex-shrink:0"></div>'
        : '');

    var ville = [id.codepostal, id.ville].filter(Boolean).join(' ');
    var contactLines = [];
    if (id.email)   contactLines.push('✉ ' + esc(id.email));
    if (id.tel)     contactLines.push('☎ ' + esc(id.tel));
    if (ville)      contactLines.push('⌖ ' + esc(ville));
    if (id.linkedin) contactLines.push('🔗 ' + esc(id.linkedin));
    var contactHtml = contactLines.map(function (c) {
      return '<div style="font-size:9px;color:#333;margin-bottom:4px">' + c + '</div>';
    }).join('');

    return '' +
      '<div style="background:#fff;display:flex;min-height:1123px;width:794px;font-family:Arial,sans-serif">' +
        '<div style="width:6px;background:#111;flex-shrink:0"></div>' +
        '<div style="flex:1;padding:28px 24px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;' +
            'padding-bottom:16px;border-bottom:2.5px solid #111;margin-bottom:16px">' +
            '<div>' +
              '<div style="font-size:24px;font-weight:900;color:#111;letter-spacing:3px">' +
                esc(id.prenom || '') +
                ' <span style="text-transform:uppercase">' + esc(id.nom || '') + '</span>' +
              '</div>' +
              '<div style="font-size:10px;color:#555;letter-spacing:2px;text-transform:uppercase;margin-top:5px">' +
                esc(pr.poste || '') +
              '</div>' +
              (pr.accroche
                ? '<div style="font-size:9px;color:#666;margin-top:6px;line-height:1.4;max-width:340px">' +
                  esc(pr.accroche).replace(/\n/g, '<br>') + '</div>'
                : '') +
            '</div>' +
            photoHtml +
          '</div>' +
          '<div style="display:flex;gap:20px">' +
            '<div style="flex:0 0 65%">' +
              (ex.length
                ? '<div style="text-transform:uppercase;font-size:9px;font-weight:800;' +
                  'letter-spacing:2px;color:#111;border-bottom:2px solid #111;' +
                  'padding-bottom:4px;margin-bottom:10px">Expériences Professionnelles</div>' +
                  ex.map(expBlock).join('')
                : '') +
              (fo.length
                ? '<div style="text-transform:uppercase;font-size:9px;font-weight:800;' +
                  'letter-spacing:2px;color:#111;border-bottom:2px solid #111;' +
                  'padding-bottom:4px;margin:12px 0 10px">Formation</div>' +
                  fo.map(forBlock).join('')
                : '') +
            '</div>' +
            '<div style="flex:0 0 32%">' +
              (contactHtml
                ? '<div style="text-transform:uppercase;font-size:9px;font-weight:800;' +
                  'letter-spacing:2px;color:#111;border-bottom:2px solid #111;' +
                  'padding-bottom:4px;margin-bottom:10px">Contact</div>' +
                  contactHtml +
                  '<div style="height:14px"></div>'
                : '') +
              (co.length
                ? '<div style="text-transform:uppercase;font-size:9px;font-weight:800;' +
                  'letter-spacing:2px;color:#111;border-bottom:2px solid #111;' +
                  'padding-bottom:4px;margin-bottom:10px">Compétences</div>' +
                  co.map(compBlock).join('')
                : '') +
              (la.length
                ? '<div style="text-transform:uppercase;font-size:9px;font-weight:800;' +
                  'letter-spacing:2px;color:#111;border-bottom:2px solid #111;' +
                  'padding-bottom:4px;margin:12px 0 8px">Langues</div>' +
                  la.map(langBlock).join('')
                : '') +
              (et.certifications
                ? '<div style="text-transform:uppercase;font-size:9px;font-weight:800;' +
                  'letter-spacing:2px;color:#111;border-bottom:2px solid #111;' +
                  'padding-bottom:4px;margin:12px 0 8px">Certifications</div>' +
                  '<div style="font-size:9px;color:#333">' +
                  esc(et.certifications).replace(/\n/g, '<br>') + '</div>'
                : '') +
              (et.interets
                ? '<div style="text-transform:uppercase;font-size:9px;font-weight:800;' +
                  'letter-spacing:2px;color:#111;border-bottom:2px solid #111;' +
                  'padding-bottom:4px;margin:12px 0 8px">Centres d\'intérêt</div>' +
                  '<div style="font-size:9px;color:#333">' + esc(et.interets) + '</div>'
                : '') +
              (et.infos
                ? '<div style="text-transform:uppercase;font-size:9px;font-weight:800;' +
                  'letter-spacing:2px;color:#111;border-bottom:2px solid #111;' +
                  'padding-bottom:4px;margin:12px 0 8px">Informations</div>' +
                  '<div style="font-size:9px;color:#333">' +
                  esc(et.infos).replace(/\n/g, '<br>') + '</div>'
                : '') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* ── T02 — SIDEBAR SOMBRE ── */
  /* Sidebar gauche 230px position:absolute, bg #1a1a1a, photo 64px bordure bleue.
     Contact / compétences / langues / certifications / intérêts dans la sidebar.
     Content principal à droite (margin-left:230px), bg blanc.
     Timeline expériences avec border-left:3px #3b82f6 (récent) / #e2e8f0 (anciens). */
  function render02(data) {
    var d = extractData(data);
    var ACCENT = '#3b82f6';

    var photoHtml = '';
    if (data.withPhoto) {
      photoHtml = '<div style="text-align:center;margin-bottom:14px">' +
        (data.photo
          ? '<img src="' + esc(data.photo) + '" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:3px solid ' + ACCENT + ';display:inline-block">'
          : '<div style="width:64px;height:64px;border-radius:50%;background:' + ACCENT + ';border:3px solid ' + ACCENT + ';display:inline-block"></div>') +
        '</div>';
    }

    var sHead = function (label) {
      return '<div style="font-size:10px;font-weight:800;letter-spacing:2px;' +
        'text-transform:uppercase;color:' + ACCENT + ';margin-bottom:12px">' + label + '</div>';
    };

    var sbHead = function (label) {
      return '<div style="color:#94a3b8;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;' +
        'font-weight:700;margin-bottom:8px;border-bottom:1px solid #333;padding-bottom:5px">' + label + '</div>';
    };

    var compHtml = d.comps.map(function (c, i) {
      var pct = (i % 5 === 4) ? 80 : 95;
      return '<div style="color:#ccc;font-size:9px;margin-bottom:4px">' + esc(c) + '</div>' +
        '<div style="height:3px;background:#333;border-radius:2px;margin-bottom:8px">' +
          '<div style="width:' + pct + '%;height:3px;background:' + ACCENT + ';border-radius:2px"></div>' +
        '</div>';
    }).join('');

    var sidebarHtml = photoHtml +
      '<div style="text-align:center;color:#fff;font-size:14px;font-weight:800;letter-spacing:1px;line-height:1.2;margin-bottom:5px">' + d.fullName + '</div>' +
      '<div style="text-align:center;color:' + ACCENT + ';font-size:9px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:20px;line-height:1.3">' + d.poste + '</div>' +
      sbHead('Contact') +
      (d.email    ? '<div style="color:#ccc;font-size:9px;margin-bottom:4px;word-break:break-all">✉ ' + d.email    + '</div>' : '') +
      (d.tel      ? '<div style="color:#ccc;font-size:9px;margin-bottom:4px">☎ ' + d.tel      + '</div>' : '') +
      (d.location ? '<div style="color:#ccc;font-size:9px;margin-bottom:4px">⌖ ' + d.location + '</div>' : '') +
      (d.linkedin ? '<div style="color:#ccc;font-size:9px;margin-bottom:18px;word-break:break-all">🔗 ' + d.linkedin + '</div>' : '<div style="margin-bottom:18px"></div>') +
      (compHtml ? sbHead('Compétences') + compHtml : '') +
      (d.langs.length ? sbHead('Langues') +
        d.langs.map(function (l) {
          return '<div style="color:#ccc;font-size:9px;margin-bottom:3px">' +
            esc(l.langue || '') + (l.niveau ? ' — ' + esc(l.niveau) : '') + '</div>';
        }).join('') + '<div style="margin-bottom:16px"></div>' : '') +
      (d.certs.length ? sbHead('Certifications') +
        d.certs.map(function (c) {
          return '<div style="color:#ccc;font-size:9px;margin-bottom:3px">' + esc(c) + '</div>';
        }).join('') + '<div style="margin-bottom:16px"></div>' : '') +
      (d.interets.length ? sbHead('Intérêts') +
        d.interets.map(function (c) {
          return '<div style="color:#ccc;font-size:9px;margin-bottom:3px">' + esc(c) + '</div>';
        }).join('') : '');

    var expHtml = d.exps.map(function (e, i) {
      var bc = i === 0 ? ACCENT : '#e2e8f0';
      return '<div style="margin-bottom:14px;padding-left:12px;border-left:3px solid ' + bc + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline">' +
          '<div style="font-size:11px;font-weight:700;color:#111">' + esc(e.entreprise || '') + '</div>' +
          '<div style="font-size:9px;color:#888">' + esc(e.debut || '') + (e.fin ? ' – ' + esc(e.fin) : '') + '</div>' +
        '</div>' +
        '<div style="font-size:10px;color:#555;margin-top:2px;font-style:italic">' + esc(e.poste || '') + (e.lieu ? ' · ' + esc(e.lieu) : '') + '</div>' +
        (e.missions ? renderMissions(e.missions) : '') +
      '</div>';
    }).join('');

    var forHtml = d.fors.map(function (f, i) {
      var bc = i === 0 ? ACCENT : '#e2e8f0';
      return '<div style="margin-bottom:10px;padding-left:12px;border-left:3px solid ' + bc + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline">' +
          '<div style="font-size:11px;font-weight:700;color:#111">' + esc(f.diplome || '') + '</div>' +
          '<div style="font-size:9px;color:#888">' + esc(f.annee || '') + '</div>' +
        '</div>' +
        '<div style="font-size:9px;color:#777;margin-top:2px">' + esc(f.etablissement || '') + '</div>' +
      '</div>';
    }).join('');

    return '<div style="position:relative;background:#fff;width:794px;min-height:1122px;' +
      'font-family:Arial,Helvetica,sans-serif;box-sizing:border-box">' +
      /* Sidebar 230px en absolute (full height grâce à top:0;bottom:0) */
      '<div style="position:absolute;top:0;left:0;bottom:0;width:230px;background:#1a1a1a;' +
        'padding:32px 20px;box-sizing:border-box">' + sidebarHtml + '</div>' +
      /* Main content margin-left:230px */
      '<div style="margin-left:230px;padding:36px 28px 36px 30px;background:#fff;color:#111">' +
        (d.accroche ? sHead('Profil') + '<div style="font-size:10px;color:#444;line-height:1.6;margin-bottom:20px">' + d.accroche + '</div>' : '') +
        (expHtml ? sHead('Expériences Professionnelles') + expHtml : '') +
        (forHtml ? '<div style="margin-top:14px">' + sHead('Formation') + forHtml + '</div>' : '') +
        (d.infos ? '<div style="margin-top:14px">' + sHead('Informations') + '<p style="font-size:10px;color:#555;line-height:1.6">' + renderAccroche(d.infos) + '</p></div>' : '') +
      '</div>' +
    '</div>';
  }

  /* ── T03 — BRUN PREMIUM ── */
  /* bg page #f9f4ef (crème). Sidebar gauche 210px position:absolute, bg chocolat #3d2b1f.
     Photo dans la sidebar (top, cercle 64px, bordure beige #c4a882).
     Police Georgia, 'Times New Roman', serif partout.
     Bandeau chocolat arrondi pour le nom (background #3d2b1f, border-radius 4px).
     Compétences en étoiles ★★★★★ couleur #c4a882.
     Timeline à points pour les expériences. */
  function render03(data) {
    var d = extractData(data);
    var DARK    = '#3d2b1f';
    var ACCENT  = '#c4a882';
    var BG      = '#f9f4ef';
    var FONT    = "Georgia, 'Times New Roman', serif";

    var photoHtml = '';
    if (data.withPhoto) {
      photoHtml = '<div style="text-align:center;margin-bottom:14px">' +
        (data.photo
          ? '<img src="' + esc(data.photo) + '" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:3px solid ' + ACCENT + ';display:inline-block">'
          : '<div style="width:64px;height:64px;border-radius:50%;background:' + ACCENT + ';border:3px solid ' + ACCENT + ';display:inline-block;margin:0 auto"></div>') +
        '</div>';
    }

    var compHtml = d.comps.map(function (c, i) {
      var stars = (i % 5 < 4) ? '★★★★★' : '★★★★☆';
      return '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">' +
        '<span style="color:' + ACCENT + ';font-size:11px;letter-spacing:0.5px">' + stars + '</span>' +
        '<span style="color:#f5e6d3;font-size:9px">' + esc(c) + '</span>' +
      '</div>';
    }).join('');

    var sbHead = function (label) {
      return '<div style="color:' + ACCENT + ';font-size:8px;letter-spacing:2px;text-transform:uppercase;' +
        'font-weight:700;margin-bottom:8px;padding-bottom:3px;border-bottom:1px solid rgba(196,168,130,0.3)">' + label + '</div>';
    };

    var sidebarHtml = photoHtml +
      '<div style="text-align:center;color:#f5e6d3;font-size:13px;font-weight:700;line-height:1.2;margin-bottom:5px">' + d.fullName + '</div>' +
      '<div style="text-align:center;color:' + ACCENT + ';font-size:9px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:22px;line-height:1.3">' + d.poste + '</div>' +
      sbHead('Contact') +
      (d.email    ? '<div style="color:#f5e6d3;font-size:9px;margin-bottom:4px;word-break:break-all">✉ ' + d.email    + '</div>' : '') +
      (d.tel      ? '<div style="color:#f5e6d3;font-size:9px;margin-bottom:4px">☎ ' + d.tel      + '</div>' : '') +
      (d.location ? '<div style="color:#f5e6d3;font-size:9px;margin-bottom:4px">⌖ ' + d.location + '</div>' : '') +
      (d.linkedin ? '<div style="color:#f5e6d3;font-size:9px;margin-bottom:18px;word-break:break-all">🔗 ' + d.linkedin + '</div>' : '<div style="margin-bottom:18px"></div>') +
      (compHtml ? sbHead('Compétences') + compHtml + '<div style="margin-bottom:14px"></div>' : '') +
      (d.langs.length ? sbHead('Langues') +
        d.langs.map(function (l) {
          return '<div style="color:#f5e6d3;font-size:9px;margin-bottom:3px">' +
            esc(l.langue || '') + (l.niveau ? ' — ' + esc(l.niveau) : '') + '</div>';
        }).join('') + '<div style="margin-bottom:14px"></div>' : '') +
      (d.certs.length ? sbHead('Certifications') +
        d.certs.map(function (c) {
          return '<div style="color:#f5e6d3;font-size:9px;margin-bottom:3px">' + esc(c) + '</div>';
        }).join('') + '<div style="margin-bottom:14px"></div>' : '') +
      (d.interets.length ? sbHead('Intérêts') +
        d.interets.map(function (c) {
          return '<div style="color:#f5e6d3;font-size:9px;margin-bottom:3px">' + esc(c) + '</div>';
        }).join('') : '');

    var expHtml = d.exps.map(function (e, i) {
      var primary = (i === 0);
      var hasSub  = (i < d.exps.length - 1);
      var dot = primary
        ? '<div style="width:10px;height:10px;border-radius:50%;background:' + DARK + ';margin-top:3px;flex-shrink:0"></div>'
        : '<div style="width:10px;height:10px;border-radius:50%;background:' + ACCENT + ';margin-top:3px;flex-shrink:0"></div>';
      var line = hasSub
        ? '<div style="width:2px;flex:1;background:' + ACCENT + ';margin-top:3px"></div>'
        : '';
      return '<div style="display:flex;gap:12px;margin-bottom:12px">' +
        '<div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">' + dot + line + '</div>' +
        '<div style="flex:1">' +
          '<div style="display:flex;justify-content:space-between;align-items:baseline">' +
            '<div style="font-size:11px;font-weight:700;color:' + DARK + '">' + esc(e.entreprise || '') + '</div>' +
            '<div style="font-size:9px;color:#8b6347">' + esc(e.debut || '') + (e.fin ? ' – ' + esc(e.fin) : '') + '</div>' +
          '</div>' +
          '<div style="font-size:9px;color:#8b6347;margin-top:2px;font-style:italic">' + esc(e.poste || '') + (e.lieu ? ' · ' + esc(e.lieu) : '') + '</div>' +
          (e.missions ? renderMissions(e.missions) : '') +
        '</div>' +
      '</div>';
    }).join('');

    var forHtml = d.fors.map(function (f, i) {
      var primary = (i === 0);
      var dot = primary
        ? '<div style="width:10px;height:10px;border-radius:50%;background:' + DARK + ';margin-top:3px;flex-shrink:0"></div>'
        : '<div style="width:10px;height:10px;border-radius:50%;background:' + ACCENT + ';margin-top:3px;flex-shrink:0"></div>';
      return '<div style="display:flex;gap:12px;margin-bottom:10px">' +
        '<div style="flex-shrink:0">' + dot + '</div>' +
        '<div style="flex:1">' +
          '<div style="display:flex;justify-content:space-between;align-items:baseline">' +
            '<div style="font-size:11px;font-weight:700;color:' + DARK + '">' + esc(f.diplome || '') + '</div>' +
            '<div style="font-size:9px;color:#8b6347">' + esc(f.annee || '') + '</div>' +
          '</div>' +
          '<div style="font-size:9px;color:#8b6347;margin-top:2px">' + esc(f.etablissement || '') + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    var sectionLabel = function (label) {
      return '<div style="font-size:10px;font-weight:700;letter-spacing:2px;' +
        'text-transform:uppercase;color:' + DARK + ';margin-bottom:14px;margin-top:4px">' + label + '</div>';
    };

    return '<div style="position:relative;background:' + BG + ';width:794px;min-height:1122px;' +
      'font-family:' + FONT + ';box-sizing:border-box">' +
      /* Sidebar gauche 210px en absolute (full height) */
      '<div style="position:absolute;top:0;left:0;bottom:0;width:210px;background:' + DARK + ';' +
        'padding:32px 18px;box-sizing:border-box">' + sidebarHtml + '</div>' +
      /* Main content margin-left:210px */
      '<div style="margin-left:210px;padding:36px 28px">' +
        /* Bandeau nom : background chocolat, border-radius 4px */
        '<div style="background:' + DARK + ';border-radius:4px;padding:14px 22px;margin-bottom:22px">' +
          '<div style="font-size:22px;font-weight:700;color:#fff;letter-spacing:1.5px;line-height:1.1">' + d.fullName + '</div>' +
          '<div style="font-size:10px;color:' + ACCENT + ';letter-spacing:2px;text-transform:uppercase;margin-top:5px">' + d.poste + '</div>' +
        '</div>' +
        (d.accroche ? '<div style="font-size:10px;color:#555;line-height:1.6;margin-bottom:18px;border-left:3px solid ' + ACCENT + ';padding-left:12px;font-style:italic">' + d.accroche + '</div>' : '') +
        (expHtml ? sectionLabel('Expériences Professionnelles') + expHtml : '') +
        (forHtml ? sectionLabel('Formation') + forHtml : '') +
        (d.infos ? sectionLabel('Informations') +
          '<p style="font-size:10px;color:#555;line-height:1.6">' + renderAccroche(d.infos) + '</p>' : '') +
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
