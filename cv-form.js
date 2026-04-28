/* ===================================================
   cv-form.js — Tunnel CV : Page 3 Formulaire
   =================================================== */

(function () {
  'use strict';

  var currentStep = 1;
  var totalSteps  = 6;

  var cvData = {
    template:     sessionStorage.getItem('cv_template')   || '01',
    withPhoto:    sessionStorage.getItem('cv_with_photo') !== 'false',
    mode:         sessionStorage.getItem('cv_mode')       || 'scratch',
    photo:        null,
    identite:     {},
    profil:       {},
    experiences:  [],
    formations:   [],
    competences:  [],
    langues:      [],
    extras:       {}
  };

  var expCount = 0;
  var formCount = 0;
  var langueCount = 0;
  var CVF_MENTION_OPTIONS = [
    { value: '', key: 'cvf_form_mention_none', fallback: '— Sans mention —' },
    { value: 'Passable', key: 'cvf_mention_passable', fallback: 'Passable' },
    { value: 'Assez bien', key: 'cvf_mention_ab', fallback: 'Assez bien' },
    { value: 'Bien', key: 'cvf_mention_bien', fallback: 'Bien' },
    { value: 'Très bien', key: 'cvf_mention_tb', fallback: 'Très bien' }
  ];
  var CVF_LANG_LEVELS = [
    { value: 'Notions', key: 'cvf_level_notions', fallback: 'Notions' },
    { value: 'Intermédiaire', key: 'cvf_level_intermediate', fallback: 'Intermédiaire' },
    { value: 'Courant', key: 'cvf_level_fluent', fallback: 'Courant' },
    { value: 'Bilingue', key: 'cvf_level_bilingual', fallback: 'Bilingue' },
    { value: 'Langue maternelle', key: 'cvf_level_native', fallback: 'Langue maternelle' }
  ];

  function cvfT(key, fallback) {
    if (window.DokPeyiI18n && typeof window.DokPeyiI18n.t === 'function') {
      return window.DokPeyiI18n.t(key, undefined, fallback || '');
    }
    return fallback || key;
  }

  function cvfFormat(key, values, fallback) {
    var text = cvfT(key, fallback || '');
    Object.entries(values || {}).forEach(function (entry) {
      text = text.replaceAll('{' + entry[0] + '}', String(entry[1]));
    });
    return text;
  }

  function renderSuggestionState(container, state) {
    if (!container) return;
    container.dataset.state = state;
    if (state === 'loading') {
      container.innerHTML = '<span class="suggestions-loading">' + cvfT('cvf_suggestions_loading', "✦ L'IA génère des suggestions…") + '</span>';
      return;
    }
    if (state === 'error') {
      container.innerHTML = '<span class="suggestions-loading">' + cvfT('cvf_suggestions_unavailable', 'Suggestions indisponibles') + '</span>';
      return;
    }
    delete container.dataset.state;
  }

  function buildMentionOptions(selected) {
    return CVF_MENTION_OPTIONS.map(function (option) {
      var selectedAttr = option.value === selected ? ' selected' : '';
      return '<option value="' + option.value + '"' + selectedAttr + '>' + cvfT(option.key, option.fallback) + '</option>';
    }).join('');
  }

  function buildLangLevelOptions(selected) {
    var placeholder = '<option value="">' + cvfT('cvf_lang_level_placeholder', '— Choisir —') + '</option>';
    var options = CVF_LANG_LEVELS.map(function (option) {
      var selectedAttr = option.value === selected ? ' selected' : '';
      return '<option value="' + option.value + '"' + selectedAttr + '>' + cvfT(option.key, option.fallback) + '</option>';
    }).join('');
    return placeholder + options;
  }

  function setPdfUploadState(state) {
    var label = document.getElementById('pdf-upload-label');
    if (!label) return;
    label.dataset.cvfPdfState = state;
    var key = 'cvf_pdf_upload';
    var fallback = 'Cliquez pour importer votre CV (PDF)';
    if (state === 'loading') {
      key = 'cvf_pdf_upload_loading';
      fallback = 'Extraction en cours…';
    } else if (state === 'success') {
      key = 'cvf_pdf_upload_success';
      fallback = 'CV importé — informations extraites';
    } else if (state === 'error') {
      key = 'cvf_pdf_upload_error';
      fallback = 'Erreur extraction — remplissez manuellement';
    }
    label.textContent = cvfT(key, fallback);
  }

  function applyCvFormDynamicTranslations() {
    document.querySelectorAll('[data-cvf-card-title="experience"]').forEach(function (el) {
      el.textContent = cvfT('cvf_exp_title', 'Expérience') + ' ' + el.dataset.cvfIndex;
    });
    document.querySelectorAll('[data-cvf-card-title="formation"]').forEach(function (el) {
      el.textContent = cvfT('cvf_form_title', 'Formation') + ' ' + el.dataset.cvfIndex;
    });
    document.querySelectorAll('[data-cvf-card-title="langue"]').forEach(function (el) {
      el.textContent = cvfT('cvf_lang_title', 'Langue') + ' ' + el.dataset.cvfIndex;
    });
    document.querySelectorAll('[data-cvf-label-html]').forEach(function (el) {
      el.innerHTML = cvfT(el.dataset.cvfLabelHtml, el.innerHTML);
    });
    document.querySelectorAll('[data-cvf-ph]').forEach(function (el) {
      el.placeholder = cvfT(el.dataset.cvfPh, el.placeholder);
    });
    document.querySelectorAll('[data-cvf-remove-button]').forEach(function (btn) {
      var label = cvfT('cvf_btn_remove_aria', 'Supprimer');
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
    document.querySelectorAll('[data-cvf-select="mention"]').forEach(function (select) {
      var currentValue = select.value;
      select.innerHTML = buildMentionOptions(currentValue);
      select.value = currentValue;
    });
    document.querySelectorAll('[data-cvf-select="lang-level"]').forEach(function (select) {
      var currentValue = select.value;
      select.innerHTML = buildLangLevelOptions(currentValue);
      select.value = currentValue;
    });
    document.querySelectorAll('.suggestions-wrap').forEach(function (container) {
      if (container.dataset.state === 'loading' || container.dataset.state === 'error') {
        renderSuggestionState(container, container.dataset.state);
      }
    });
    if (document.getElementById('pdf-upload-label')) {
      setPdfUploadState(document.getElementById('pdf-upload-label').dataset.cvfPdfState || 'idle');
    }
    renderTags('competences');
    updateRecap();
  }

  function updateCvData(section, field, value) {
    if (!cvData[section]) cvData[section] = {};
    cvData[section][field] = value;
  }

  /* ── Expériences dynamiques ── */
  function addExperience() {
    expCount++;
    var n = expCount;
    var card = document.createElement('div');
    card.className = 'dynamic-card';
    card.id = 'exp-card-' + n;
    card.innerHTML =
      '<div class="dynamic-card-header">' +
        '<span class="dynamic-card-title" data-cvf-card-title="experience" data-cvf-index="' + n + '">' + cvfT('cvf_exp_title', 'Expérience') + ' ' + n + '</span>' +
        '<button class="btn-remove-card" data-cvf-remove-button="true" aria-label="' + cvfT('cvf_btn_remove_aria', 'Supprimer') + '" title="' + cvfT('cvf_btn_remove_aria', 'Supprimer') + '" onclick="removeCard(\'exp-card-' + n + '\',\'experiences\',' + n + ')">×</button>' +
      '</div>' +
      '<div class="field-group"><label class="field-label" data-cvf-label-html="cvf_exp_poste_html">' + cvfT('cvf_exp_poste_html', 'Intitulé du poste <span class="field-required">*</span>') + '</label>' +
        '<input class="field-input" type="text" data-cvf-ph="cvf_exp_poste_ph" placeholder="' + cvfT('cvf_exp_poste_ph', 'Ex : Assistant Administratif') + '"' +
        ' oninput="updateExp(' + n + ',\'poste\',this.value);updatePreview();var _mc=document.getElementById(\'suggestions-missions_' + n + '\');if(_mc){_mc.innerHTML=\'\';_mc.removeAttribute(\'data-frozen\');}triggerSuggestions(\'missions_' + n + '\',this.value,\'\')">' +
      '</div>' +
      '<div class="field-group"><label class="field-label" data-cvf-label-html="cvf_exp_entreprise_html">' + cvfT('cvf_exp_entreprise_html', 'Entreprise / Organisation <span class="field-required">*</span>') + '</label>' +
        '<input class="field-input" type="text" data-cvf-ph="cvf_exp_entreprise_ph" placeholder="' + cvfT('cvf_exp_entreprise_ph', 'Ex : Préfecture de Guyane') + '"' +
        ' oninput="updateExp(' + n + ',\'entreprise\',this.value);updatePreview()">' +
      '</div>' +
      '<div class="field-row">' +
        '<div class="field-group"><label class="field-label" data-cvf-label-html="cvf_exp_debut_html">' + cvfT('cvf_exp_debut_html', 'Date de début <span class="field-required">*</span>') + '</label>' +
          '<input class="field-input" type="text" data-cvf-ph="cvf_exp_debut_ph" placeholder="' + cvfT('cvf_exp_debut_ph', 'Jan 2022') + '"' +
          ' oninput="updateExp(' + n + ',\'debut\',this.value);updatePreview()"></div>' +
        '<div class="field-group"><label class="field-label" data-cvf-label-html="cvf_exp_fin_html">' + cvfT('cvf_exp_fin_html', 'Date de fin <span class="field-required">*</span>') + '</label>' +
          '<input class="field-input" type="text" data-cvf-ph="cvf_exp_fin_ph" placeholder="' + cvfT('cvf_exp_fin_ph', 'Déc 2024 ou Présent') + '"' +
          ' oninput="updateExp(' + n + ',\'fin\',this.value);updatePreview()"></div>' +
      '</div>' +
      '<div class="field-group"><label class="field-label" data-cvf-label-html="cvf_exp_missions">' + cvfT('cvf_exp_missions', 'Missions') + '</label>' +
        '<textarea class="field-textarea" data-cvf-ph="cvf_exp_missions_ph" placeholder="' + cvfT('cvf_exp_missions_ph', '• Géré les dossiers administratifs&#10;• Accueilli 50+ usagers/semaine') + '"' +
        ' oninput="updateExp(' + n + ',\'missions\',this.value);updatePreview();' +
        'triggerSuggestions(\'missions_' + n + '\',cvData.profil.poste||cvData.experiences[' + (n - 1) + ']&&cvData.experiences[' + (n - 1) + '].poste||\'\',cvData.experiences[' + (n - 1) + ']&&cvData.experiences[' + (n - 1) + '].entreprise||\'\')"></textarea>' +
        '<div class="suggestions-wrap" id="suggestions-missions_' + n + '"></div>' +
      '</div>';
    var container = document.getElementById('experiences-container');
    if (container) container.appendChild(card);
    if (!cvData.experiences[n - 1]) cvData.experiences[n - 1] = {};
  }

  function updateExp(n, field, value) {
    if (!cvData.experiences[n - 1]) cvData.experiences[n - 1] = {};
    cvData.experiences[n - 1][field] = value;
    updatePreview();
  }

  function removeCard(cardId, section, n) {
    var card = document.getElementById(cardId);
    if (card) card.remove();
    if (Array.isArray(cvData[section])) cvData[section][n - 1] = null;
  }

  /* ── Formations dynamiques ── */
  function addFormation() {
    formCount++;
    var n = formCount;
    var card = document.createElement('div');
    card.className = 'dynamic-card';
    card.id = 'form-card-' + n;
    card.innerHTML =
      '<div class="dynamic-card-header">' +
        '<span class="dynamic-card-title" data-cvf-card-title="formation" data-cvf-index="' + n + '">' + cvfT('cvf_form_title', 'Formation') + ' ' + n + '</span>' +
        '<button class="btn-remove-card" data-cvf-remove-button="true" aria-label="' + cvfT('cvf_btn_remove_aria', 'Supprimer') + '" title="' + cvfT('cvf_btn_remove_aria', 'Supprimer') + '" onclick="removeCard(\'form-card-' + n + '\',\'formations\',' + n + ')">×</button>' +
      '</div>' +
      '<div class="field-group"><label class="field-label" data-cvf-label-html="cvf_form_diplome_html">' + cvfT('cvf_form_diplome_html', 'Diplôme / Certification <span class="field-required">*</span>') + '</label>' +
        '<input class="field-input" type="text" data-cvf-ph="cvf_form_diplome_ph" placeholder="' + cvfT('cvf_form_diplome_ph', 'Ex : BTS Gestion de la PME') + '"' +
        ' oninput="updateFormation(' + n + ',\'diplome\',this.value);updatePreview();triggerSuggestions(\'formation_' + n + '\',cvData.profil.poste||\'\',\'\')">' +
        '<div class="suggestions-wrap" id="suggestions-formation_' + n + '"></div>' +
      '</div>' +
      '<div class="field-group"><label class="field-label" data-cvf-label-html="cvf_form_etablissement_html">' + cvfT('cvf_form_etablissement_html', 'Établissement <span class="field-required">*</span>') + '</label>' +
        '<input class="field-input" type="text" data-cvf-ph="cvf_form_etablissement_ph" placeholder="' + cvfT('cvf_form_etablissement_ph', 'Ex : Lycée Melkior-Garré, Cayenne') + '"' +
        ' oninput="updateFormation(' + n + ',\'etablissement\',this.value);updatePreview()">' +
      '</div>' +
      '<div class="field-row">' +
        '<div class="field-group"><label class="field-label" data-cvf-label-html="cvf_form_annee_html">' + cvfT('cvf_form_annee_html', 'Année d\'obtention <span class="field-required">*</span>') + '</label>' +
          '<input class="field-input" type="text" data-cvf-ph="cvf_form_annee_ph" placeholder="' + cvfT('cvf_form_annee_ph', '2021') + '"' +
          ' oninput="updateFormation(' + n + ',\'annee\',this.value);updatePreview()"></div>' +
        '<div class="field-group"><label class="field-label" data-cvf-label-html="cvf_form_mention">' + cvfT('cvf_form_mention', 'Mention') + '</label>' +
          '<select class="field-select" data-cvf-select="mention" onchange="updateFormation(' + n + ',\'mention\',this.value);updatePreview()">' +
            buildMentionOptions('') +
          '</select></div>' +
      '</div>';
    var container = document.getElementById('formations-container');
    if (container) container.appendChild(card);
    if (!cvData.formations[n - 1]) cvData.formations[n - 1] = {};
  }

  function updateFormation(n, field, value) {
    if (!cvData.formations[n - 1]) cvData.formations[n - 1] = {};
    cvData.formations[n - 1][field] = value;
    updatePreview();
  }

  /* ── Compétences (tags) ── */
  var COMP_SUGGESTIONS = [
    'Pack Office', 'Word', 'Excel', 'PowerPoint', 'Outlook',
    'Accueil du public', 'Gestion de dossiers', 'Classement/Archivage',
    'Rédaction administrative', 'Prise de notes', 'Gestion agenda',
    'Saisie informatique', 'Logiciels comptables', 'Travail en équipe'
  ];

  function handleTagInput(e, section) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      var input = e.target;
      var val = input.value.trim().replace(/,$/, '');
      if (val) addTag(section, val);
      input.value = '';
    }
  }

  function addTag(section, value) {
    if (!value) return;
    var arr = cvData[section];
    if (!Array.isArray(arr)) { cvData[section] = []; arr = cvData[section]; }
    if (arr.indexOf(value) !== -1) return;
    arr.push(value);
    renderTags(section);
    updatePreview();
  }

  function removeTag(section, value) {
    if (!Array.isArray(cvData[section])) return;
    cvData[section] = cvData[section].filter(function (t) { return t !== value; });
    renderTags(section);
    updatePreview();
  }

  function renderTags(section) {
    var list = document.getElementById(section + '-tags');
    if (!list) return;
    var arr = cvData[section] || [];
    list.innerHTML = arr.map(function (t) {
      return '<span class="tag-chip">' + t +
        '<button class="tag-remove" onclick="removeTag(\'' + section + '\',\'' + t.replace(/'/g, "\\'") + '\')" aria-label="' + cvfT('cvf_btn_remove_aria', 'Supprimer') + '" title="' + cvfT('cvf_btn_remove_aria', 'Supprimer') + '">×</button>' +
        '</span>';
    }).join('');
  }

  function initCompSuggestions() {
    var container = document.getElementById('suggestions-competences');
    if (!container) return;
    container.innerHTML = COMP_SUGGESTIONS.map(function (s) {
      return '<span class="suggestion-chip" onclick="addTag(\'competences\',\'' + s.replace(/'/g, "\\'") + '\')">' + s + '</span>';
    }).join('');
  }

  /* ── Langues dynamiques ── */
  function addLangue() {
    langueCount++;
    var n = langueCount;
    var card = document.createElement('div');
    card.className = 'dynamic-card langue-card';
    card.id = 'lang-card-' + n;
    card.innerHTML =
      '<div class="dynamic-card-header">' +
        '<span class="dynamic-card-title" data-cvf-card-title="langue" data-cvf-index="' + n + '">' + cvfT('cvf_lang_title', 'Langue') + ' ' + n + '</span>' +
        '<button class="btn-remove-card" data-cvf-remove-button="true" aria-label="' + cvfT('cvf_btn_remove_aria', 'Supprimer') + '" title="' + cvfT('cvf_btn_remove_aria', 'Supprimer') + '" onclick="removeCard(\'lang-card-' + n + '\',\'langues\',' + n + ')">×</button>' +
      '</div>' +
      '<div class="field-row">' +
        '<div class="field-group"><label class="field-label" data-cvf-label-html="cvf_lang_name_html">' + cvfT('cvf_lang_name_html', 'Langue <span class="field-required">*</span>') + '</label>' +
          '<input class="field-input" type="text" data-cvf-ph="cvf_lang_name_ph" placeholder="' + cvfT('cvf_lang_name_ph', 'Ex : Portugais') + '"' +
          ' oninput="updateLangue(' + n + ',\'langue\',this.value);updatePreview()"></div>' +
        '<div class="field-group"><label class="field-label" data-cvf-label-html="cvf_lang_level_html">' + cvfT('cvf_lang_level_html', 'Niveau <span class="field-required">*</span>') + '</label>' +
          '<select class="field-select" data-cvf-select="lang-level" onchange="updateLangue(' + n + ',\'niveau\',this.value);updatePreview()">' +
            buildLangLevelOptions('') +
          '</select></div>' +
      '</div>';
    var container = document.getElementById('langues-container');
    if (container) container.appendChild(card);
    if (!cvData.langues[n - 1]) cvData.langues[n - 1] = {};
  }

  function updateLangue(n, field, value) {
    if (!cvData.langues[n - 1]) cvData.langues[n - 1] = {};
    cvData.langues[n - 1][field] = value;
  }

  /* ── Récapitulatif (step 6) ── */
  function updateRecap() {
    var box = document.getElementById('recap-body');
    if (!box) return;
    var lines = [];
    var id = cvData.identite;
    if (id.prenom || id.nom) lines.push('<strong>' + (id.prenom || '') + ' ' + (id.nom || '') + '</strong>');
    if (cvData.profil.poste) lines.push(cvfFormat('cvf_recap_poste', { value: cvData.profil.poste }, 'Poste visé : {value}'));
    var exps = cvData.experiences.filter(Boolean);
    if (exps.length) lines.push(cvfFormat('cvf_recap_experiences_count', { count: exps.length }, '{count} expérience(s)'));
    var forms = cvData.formations.filter(Boolean);
    if (forms.length) lines.push(cvfFormat('cvf_recap_formations_count', { count: forms.length }, '{count} formation(s)'));
    var comps = (cvData.competences || []).filter(Boolean);
    if (comps.length) lines.push(cvfFormat('cvf_recap_competences', { value: comps.join(', ') }, 'Compétences : {value}'));
    var langs = (cvData.langues || []).filter(Boolean);
    if (langs.length) lines.push(cvfFormat('cvf_recap_langues', {
      value: langs.filter(function (l) { return l.langue; }).map(function (l) {
        return l.langue + (l.niveau ? ' (' + l.niveau + ')' : '');
      }).join(', ')
    }, 'Langues : {value}'));
    box.innerHTML = lines.length ? lines.join('<br>') : cvfT('cvf_recap_empty', 'Complétez les étapes précédentes pour voir le récapitulatif.');
  }

  /* ── Upload PDF ── */
  function handlePdfUpload(file) {
    if (!file) return;
    setPdfUploadState('loading');
    var formData = new FormData();
    formData.append('file', file);
    fetch('/api/extract-doc', { method: 'POST', body: formData })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.prenom)      cvData.identite.prenom   = data.prenom;
        if (data.nom)         cvData.identite.nom      = data.nom;
        if (data.email)       cvData.identite.email    = data.email;
        if (data.tel)         cvData.identite.tel      = data.tel;
        if (data.poste)       cvData.profil.poste      = data.poste;
        if (data.accroche)    cvData.profil.accroche   = data.accroche;
        if (data.experiences) cvData.experiences       = data.experiences;
        updatePreview();
        setPdfUploadState('success');
      })
      .catch(function () {
        setPdfUploadState('error');
      });
  }

  /* ── Upload photo ── */
  function handlePhotoUpload(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      cvData.photo = e.target.result;
      var zone = document.getElementById('photo-upload-zone');
      if (zone) zone.innerHTML = '<img src="' + e.target.result + '" alt="photo">';
      updatePreview();
    };
    reader.readAsDataURL(file);
  }

  /* ── Suggestions IA ── */
  var suggestDebounceTimer = {};
  var lastPoste = '';

  function triggerSuggestions(field, poste, context) {
    var container = document.getElementById('suggestions-' + field);
    if (!container) return;

    // Changement de poste → vider uniquement les champs liés au poste visé
    var isPosteField = field === 'accroche' || field === 'competences' || field === 'interets';
    if (isPosteField && poste && poste !== lastPoste) {
      var fieldsToReset = ['accroche', 'competences', 'interets', 'certifications', 'infos_complementaires'];
      fieldsToReset.forEach(function (f) {
        var c = document.getElementById('suggestions-' + f);
        if (c) c.innerHTML = '';
      });
      lastPoste = poste;
    }

    // missions/formation : gel manuel via data-frozen — les autres : freeze classique
    if (field.startsWith('missions') || field.startsWith('formation')) {
      if (container.getAttribute('data-frozen') === 'true') return;
    } else {
      if (container.querySelector('.suggestion-chip')) return;
      if (container.querySelector('.suggestions-loading')) return;
    }

    if (!poste || poste.length < 3) return;
    if (suggestDebounceTimer[field]) clearTimeout(suggestDebounceTimer[field]);
    renderSuggestionState(container, 'loading');
    suggestDebounceTimer[field] = setTimeout(function () {
      fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: field, poste: poste, context: context || '' })
      })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (data) {
          var suggestions = data.suggestions || [];
          if (!suggestions.length) { container.innerHTML = ''; return; }
          var isMutable = field.startsWith('missions') || field.startsWith('formation');
          container.innerHTML = suggestions.map(function (s) {
            return '<span class="suggestion-chip" onclick="' +
              (isMutable ? 'this.parentNode.setAttribute(\'data-frozen\',\'true\');' : '') +
              'applySuggestion(\'' + field + '\',this.textContent.trim());this.remove()">' + s + '</span>';
          }).join('');
        })
        .catch(function () {
          renderSuggestionState(container, 'error');
        });
    }, 600);
  }

  function applySuggestion(field, value) {
    value = (value || '').trim();
    if (!value) return;
    if (field === 'accroche') {
      var el = document.querySelector('textarea[data-field="accroche"]');
      if (el) {
        var sep = el.value.trim() ? '\n' : '';
        el.value = el.value.trim() + sep + value;
        el.dispatchEvent(new Event('input'));
      }
    } else if (field.startsWith('missions')) {
      var idx = field.split('_')[1];
      var sel = idx ? '#exp-card-' + idx + ' textarea' : '.dynamic-card textarea';
      var ta = document.querySelector(sel);
      if (ta) { ta.value += (ta.value ? '\n' : '') + '• ' + value; ta.dispatchEvent(new Event('input')); }
    } else if (field.startsWith('formation')) {
      var fidx = field.split('_')[1];
      var finput = document.querySelector('#form-card-' + fidx + ' input.field-input');
      if (finput) {
        if (!finput.value.trim()) {
          finput.value = value;
          finput.dispatchEvent(new Event('input'));
        } else {
          addFormation();
          var newForInput = document.querySelector('#form-card-' + formCount + ' input.field-input');
          if (newForInput) { newForInput.value = value; newForInput.dispatchEvent(new Event('input')); }
        }
      }
    } else if (field === 'competences') {
      if (cvData.competences.indexOf(value) === -1) {
        cvData.competences.push(value);
        renderTags('competences');
        updatePreview();
      }
    } else if (field === 'interets') {
      var inp = document.querySelector('input[data-field="interets"]');
      if (inp) {
        var sep = inp.value.trim() ? ', ' : '';
        inp.value = inp.value.trim() + sep + value;
        inp.dispatchEvent(new Event('input'));
      }
    } else if (field === 'certifications') {
      var elCert = document.querySelector('input[data-field="certifications"]');
      if (elCert) {
        var sep = elCert.value.trim() ? ', ' : '';
        elCert.value = elCert.value.trim() + sep + value;
        elCert.dispatchEvent(new Event('input'));
      }
    } else if (field === 'infos_complementaires') {
      var elInfo = document.querySelector('textarea[data-field="complement"]');
      if (elInfo) {
        var sep = elInfo.value.trim() ? '\n' : '';
        elInfo.value = elInfo.value.trim() + sep + value;
        elInfo.dispatchEvent(new Event('input'));
      }
    }
  }

  function buildExpContext() {
    return (cvData.experiences || []).filter(Boolean)
      .map(function(e) { return e.poste || ''; }).filter(Boolean).join(', ');
  }

  /* ── Preview ── */
  function getTemplateStyles(tpl) {
    var map = {
      '01': { bg:'#fff', sidebar:'#f8f8f8', accent:'#000', text:'#333', chipBg:'#f0f0f0', chipText:'#333', layout:'two-col-right' },
      '02': { bg:'#fff', sidebar:'#1a1a1a', accent:'#3b82f6', text:'#fff', chipBg:'#3b82f6', chipText:'#fff', layout:'sidebar-left' },
      '03': { bg:'#fdf6ee', sidebar:'#3d2b1f', accent:'#c9a84c', text:'#f5e6d3', chipBg:'rgba(201,168,76,0.2)', chipText:'#3d2b1f', layout:'sidebar-left' },
      '04': { bg:'#fff', sidebar:'#1e3a5f', accent:'#1e3a5f', text:'#fff', chipBg:'#1e3a5f', chipText:'#fff', layout:'sidebar-left' },
      '05': { bg:'#1a1a1a', sidebar:'#111', accent:'#fff', text:'#fff', chipBg:'rgba(255,255,255,0.1)', chipText:'#fff', layout:'sidebar-left' },
      '06': { bg:'#111', sidebar:'#111', accent:'#22c55e', text:'#fff', chipBg:'rgba(34,197,94,0.15)', chipText:'#22c55e', layout:'two-col-dark' },
      '07': { bg:'#fff', sidebar:'#1a1a1a', accent:'#dc2626', text:'#fff', chipBg:'rgba(220,38,38,0.1)', chipText:'#dc2626', layout:'sidebar-left' },
      '08': { bg:'#fff', sidebar:'#2d2d2d', accent:'#3b82f6', text:'#fff', chipBg:'rgba(59,130,246,0.1)', chipText:'#3b82f6', layout:'sidebar-left' },
      '09': { bg:'#fff', sidebar:'#fff', accent:'#c9a84c', text:'#333', chipBg:'rgba(201,168,76,0.15)', chipText:'#8a6a1a', layout:'centered-gold' },
      '10': { bg:'#fff', sidebar:'#fff', accent:'#1e3a5f', text:'#333', chipBg:'rgba(30,58,95,0.08)', chipText:'#1e3a5f', layout:'two-col-right' },
      '11': { bg:'#fff', sidebar:'#1a1a1a', accent:'#eab308', text:'#fff', chipBg:'rgba(234,179,8,0.15)', chipText:'#854d0e', layout:'sidebar-left' },
      '12': { bg:'#0d0d1a', sidebar:'#0d0d1a', accent:'#ec4899', text:'#fff', chipBg:'rgba(236,72,153,0.15)', chipText:'#ec4899', layout:'sidebar-left' }
    };
    return map[tpl] || map['01'];
  }

  function buildLayout(tpl, s, d) {
    var base = 'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:12px;line-height:1.5;color:' + s.text + ';background:' + s.bg + ';min-height:297mm;width:210mm;box-sizing:border-box;';
    var sectionHead = function (label) {
      return '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:' + s.accent + ';margin-bottom:10px;padding-bottom:4px;border-bottom:2px solid ' + s.accent + '">' + label + '</div>';
    };
    var contactBlock = (d.email ? '<div style="font-size:10px;margin-bottom:4px">✉ ' + d.email + '</div>' : '') +
      (d.tel ? '<div style="font-size:10px;margin-bottom:4px">📱 ' + d.tel + '</div>' : '') +
      (d.ville ? '<div style="font-size:10px;margin-bottom:16px">📍 ' + d.ville + '</div>' : '');

    if (s.layout === 'sidebar-left' || s.layout === 'sidebar-left-dark') {
      var mainColor = (s.layout === 'sidebar-left-dark') ? s.text : '#333';
      return '<div style="' + base + 'display:grid;grid-template-columns:35% 65%">' +
        '<div style="background:' + s.sidebar + ';padding:32px 20px;color:' + s.text + '">' +
        (d.photoHtml ? '<div style="text-align:center;margin-bottom:20px">' + d.photoHtml + '</div>' : '') +
        '<div style="font-size:17px;font-weight:800;margin-bottom:4px">' + d.name + '</div>' +
        '<div style="font-size:10px;opacity:0.8;margin-bottom:20px;letter-spacing:0.05em">' + d.poste + '</div>' +
        (contactBlock ? '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;opacity:0.6">Contact</div>' + contactBlock : '') +
        (d.compHtml ? '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;opacity:0.6">Compétences</div><div>' + d.compHtml + '</div>' : '') +
        (d.langHtml ? '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:16px 0 8px;opacity:0.6">Langues</div>' + d.langHtml : '') +
        '</div>' +
        '<div style="padding:32px 24px;background:' + s.bg + ';color:' + mainColor + '">' +
        (d.accroche ? '<div style="font-size:12px;color:#555;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #eee;line-height:1.7">' + d.accroche + '</div>' : '') +
        (d.expHtml ? sectionHead('Expériences') + d.expHtml : '') +
        (d.forHtml ? '<div style="margin-top:16px">' + sectionHead('Formation') + d.forHtml + '</div>' : '') +
        '</div></div>';
    }

    // two-col-right (01, 10) + fallbacks (06, 09)
    return '<div style="' + base + 'padding:40px">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid ' + s.accent + '">' +
      '<div>' + (d.photoHtml ? d.photoHtml : '') +
      '<div style="font-size:22px;font-weight:800;letter-spacing:-0.02em">' + d.name + '</div>' +
      '<div style="font-size:11px;color:' + s.accent + ';letter-spacing:0.08em;text-transform:uppercase;margin-top:4px">' + d.poste + '</div>' +
      '</div>' +
      '<div style="text-align:right;font-size:10px;color:#666;line-height:1.8">' +
      (d.email ? d.email + '<br>' : '') + (d.tel ? d.tel + '<br>' : '') + (d.ville || '') +
      '</div></div>' +
      (d.accroche ? '<p style="font-size:12px;color:#555;margin-bottom:20px">' + d.accroche + '</p>' : '') +
      (d.expHtml ? sectionHead('Expériences') + d.expHtml : '') +
      (d.forHtml ? '<div style="margin-top:16px">' + sectionHead('Formation') + d.forHtml + '</div>' : '') +
      (d.compHtml ? '<div style="margin-top:16px">' + sectionHead('Compétences') + '<div>' + d.compHtml + '</div></div>' : '') +
      (d.langHtml ? '<div style="margin-top:16px">' + sectionHead('Langues') + d.langHtml + '</div>' : '') +
      '</div>';
  }

  function renderTemplate(data) {
    var tpl = data.template || '01';
    var s   = getTemplateStyles(tpl);
    var name = ((data.identite.prenom || '') + ' ' + (data.identite.nom || '').toUpperCase()).trim() || 'Prénom NOM';
    var poste   = data.profil.poste    || '';
    var accroche = data.profil.accroche || '';
    var accrocheHtml = accroche
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
    var exps  = (data.experiences || []).filter(Boolean);
    var fors  = (data.formations  || []).filter(Boolean);
    var comps = (data.competences || []).filter(Boolean);
    var langs = (data.langues     || []).filter(Boolean);

    var expHtml = exps.map(function (e) {
      return '<div style="margin-bottom:12px">' +
        '<div style="font-weight:700;font-size:13px">' + (e.poste || '') + '</div>' +
        '<div style="font-size:11px;color:' + s.accent + '">' + (e.entreprise || '') + (e.debut ? ' · ' + e.debut + ' – ' + (e.fin || '…') : '') + '</div>' +
        (e.missions ? '<div style="font-size:11px;margin-top:4px;white-space:pre-line;color:#555">' + e.missions + '</div>' : '') +
        '</div>';
    }).join('');

    var forHtml = fors.map(function (f) {
      return '<div style="margin-bottom:10px">' +
        '<div style="font-weight:600;font-size:12px">' + (f.diplome || '') + '</div>' +
        '<div style="font-size:11px;color:#666">' + (f.etablissement || '') + (f.annee ? ' · ' + f.annee : '') + '</div>' +
        '</div>';
    }).join('');

    var compHtml = comps.map(function (c) {
      return '<span style="display:inline-block;margin:2px 4px 2px 0;padding:3px 10px;background:' + s.chipBg + ';color:' + s.chipText + ';border-radius:999px;font-size:10px">' + c + '</span>';
    }).join('');

    var langHtml = langs.map(function (l) {
      return '<div style="font-size:11px;margin-bottom:4px"><span style="font-weight:600">' + (l.langue || '') + '</span>' + (l.niveau ? ' — ' + l.niveau : '') + '</div>';
    }).join('');

    var photoHtml = '';
    if (data.withPhoto && data.photo) {
      photoHtml = '<img src="' + data.photo + '" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid ' + s.accent + '">';
    }

    return buildLayout(tpl, s, {
      name: name, poste: poste, accroche: accrocheHtml,
      email: data.identite.email || '', tel: data.identite.tel || '',
      ville: data.identite.ville || '', linkedin: data.identite.linkedin || '',
      expHtml: expHtml, forHtml: forHtml,
      compHtml: compHtml, langHtml: langHtml, photoHtml: photoHtml
    });
  }

  function updatePreview() {
    var preview = document.getElementById('preview-cv');
    if (!preview) return;
    try {
      var html = renderTemplate(cvData);
      preview.style.cssText =
        'display:block;visibility:visible;opacity:1;' +
        'background:white;width:794px;' +
        'transform-origin:top center;';
      preview.innerHTML = html;
      requestAnimationFrame(function () {
        var panel = document.getElementById('preview-panel');
        if (!panel) return;
        var panelW = panel.offsetWidth - 40;
        if (panelW <= 0) panelW = 600;
        var scale = Math.min(panelW / 794, 1);
        preview.style.transform = 'scale(' + scale + ')';
      });
    } catch (e) {
      console.error('[preview] error:', e);
    }
    updateRecap();
  }

  /* ── Navigation ── */
  function showStep(n) {
    document.querySelectorAll('.form-step').forEach(function (s) {
      s.style.display = 'none';
    });
    var step = document.querySelector('.form-step[data-step="' + n + '"]');
    if (step) step.style.display = 'block';

    var pct = (n / totalSteps * 100).toFixed(1) + '%';
    var fill = document.getElementById('progress-fill');
    var cur  = document.getElementById('step-current');
    var prev = document.getElementById('btn-prev');
    var next = document.getElementById('btn-next');
    var sub  = document.getElementById('btn-submit');

    if (fill) fill.style.width = pct;
    if (cur)  cur.textContent = n;
    if (prev) prev.style.display = n === 1 ? 'none' : 'block';
    if (next) next.style.display = n === totalSteps ? 'none' : 'block';
    if (sub)  sub.style.display  = n === totalSteps ? 'block' : 'none';

    currentStep = n;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (n === 4) triggerSuggestions('formation_1', cvData.profil.poste || '', '');
    if (n === 5) triggerSuggestions('competences', cvData.profil.poste || '', '');
    if (n === 6) {
      var ctx6 = buildExpContext();
      triggerSuggestions('certifications', cvData.profil.poste || '', ctx6);
      triggerSuggestions('interets', cvData.profil.poste || '', ctx6);
    }
  }

  function nextStep() {
    if (currentStep < totalSteps) showStep(currentStep + 1);
  }

  function prevStep() {
    if (currentStep > 1) showStep(currentStep - 1);
  }

  /* ── Mobile preview overlay ── */
  function toggleMobilePreview() {
    document.body.classList.toggle('preview-overlay-open');
    var closeBtn = document.getElementById('btn-close-preview');
    var isOpen   = document.body.classList.contains('preview-overlay-open');
    if (closeBtn) closeBtn.style.display = isOpen ? 'block' : 'none';
  }

  /* ── Submit ── */
  function submitForm() {
    console.log('[cv-form] submitForm — cvData:', cvData);
    // S3-D : génération IA — à implémenter
  }

  /* ── Navbar scroll ── */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── Hamburger ── */
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    showStep(1);
    lastPoste = cvData.profil.poste || '';

    // Re-lire withPhoto depuis sessionStorage (source de vérité unique, jamais réécrite ici)
    var storedPhoto = sessionStorage.getItem('cv_with_photo');
    cvData.withPhoto = storedPhoto !== 'false';

    // Masquer la zone photo si sans photo
    var photoZone = document.getElementById('photo-upload-zone');
    if (photoZone) photoZone.style.display = cvData.withPhoto ? '' : 'none';

    // Afficher l'offre ciblée uniquement en mode target
    if (cvData.mode === 'target') {
      var offreSection = document.getElementById('offre-cible-section');
      if (offreSection) offreSection.style.display = 'block';
    }

    // Mode improve : afficher upload PDF, masquer saisie manuelle
    if (cvData.mode === 'improve') {
      var pdfSection = document.getElementById('pdf-upload-section');
      var expSection = document.getElementById('experiences-section');
      if (pdfSection) pdfSection.style.display = 'block';
      if (expSection) expSection.style.display = 'none';
    } else {
      addExperience();
    }

    // Suggestions initiales
    triggerSuggestions('poste', '');
    initCompSuggestions();

    // Première formation et langue vides
    addFormation();
    addLangue();

    // Preview en dernier — après que tous les containers soient prêts
    updatePreview();
    applyCvFormDynamicTranslations();
  });

  document.addEventListener('dokpeyi:langchange', function () {
    applyCvFormDynamicTranslations();
  });

  /* ── Expose globals for inline onclick ── */
  window.nextStep            = nextStep;
  window.prevStep            = prevStep;
  window.submitForm          = submitForm;
  window.toggleMobilePreview = toggleMobilePreview;
  window.updateCvData        = updateCvData;
  window.updateExp           = updateExp;
  window.removeCard          = removeCard;
  window.addExperience       = addExperience;
  window.handlePdfUpload     = handlePdfUpload;
  window.handlePhotoUpload   = handlePhotoUpload;
  window.triggerSuggestions  = triggerSuggestions;
  window.applySuggestion     = applySuggestion;
  window.updatePreview       = updatePreview;
  window.addFormation        = addFormation;
  window.updateFormation     = updateFormation;
  window.addLangue           = addLangue;
  window.updateLangue        = updateLangue;
  window.handleTagInput      = handleTagInput;
  window.addTag              = addTag;
  window.removeTag           = removeTag;
  window.cvData              = cvData;
  window.buildExpContext     = buildExpContext;

})();
