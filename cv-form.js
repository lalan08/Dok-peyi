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
        '<span class="dynamic-card-title">Expérience ' + n + '</span>' +
        '<button class="btn-remove-card" onclick="removeCard(\'exp-card-' + n + '\',\'experiences\',' + n + ')">×</button>' +
      '</div>' +
      '<div class="field-group"><label class="field-label">Intitulé du poste <span class="field-required">*</span></label>' +
        '<input class="field-input" type="text" placeholder="Ex : Assistant Administratif"' +
        ' oninput="updateExp(' + n + ',\'poste\',this.value);updatePreview();triggerSuggestions(\'missions_' + n + '\',cvData.profil.poste||\'\')">' +
      '</div>' +
      '<div class="field-group"><label class="field-label">Entreprise / Organisation <span class="field-required">*</span></label>' +
        '<input class="field-input" type="text" placeholder="Ex : Préfecture de Guyane"' +
        ' oninput="updateExp(' + n + ',\'entreprise\',this.value);updatePreview()">' +
      '</div>' +
      '<div class="field-row">' +
        '<div class="field-group"><label class="field-label">Date de début <span class="field-required">*</span></label>' +
          '<input class="field-input" type="text" placeholder="Jan 2022"' +
          ' oninput="updateExp(' + n + ',\'debut\',this.value);updatePreview()"></div>' +
        '<div class="field-group"><label class="field-label">Date de fin <span class="field-required">*</span></label>' +
          '<input class="field-input" type="text" placeholder="Déc 2024 ou Présent"' +
          ' oninput="updateExp(' + n + ',\'fin\',this.value);updatePreview()"></div>' +
      '</div>' +
      '<div class="field-group"><label class="field-label">Missions</label>' +
        '<textarea class="field-textarea" placeholder="• Géré les dossiers administratifs&#10;• Accueilli 50+ usagers/semaine"' +
        ' oninput="updateExp(' + n + ',\'missions\',this.value);updatePreview()"></textarea>' +
        '<div class="suggestions-wrap" id="suggestions-exp-' + n + '"></div>' +
      '</div>';
    var container = document.getElementById('experiences-container');
    if (container) container.appendChild(card);
    if (!cvData.experiences[n - 1]) cvData.experiences[n - 1] = {};
  }

  function updateExp(n, field, value) {
    if (!cvData.experiences[n - 1]) cvData.experiences[n - 1] = {};
    cvData.experiences[n - 1][field] = value;
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
        '<span class="dynamic-card-title">Formation ' + n + '</span>' +
        '<button class="btn-remove-card" onclick="removeCard(\'form-card-' + n + '\',\'formations\',' + n + ')">×</button>' +
      '</div>' +
      '<div class="field-group"><label class="field-label">Diplôme / Certification <span class="field-required">*</span></label>' +
        '<input class="field-input" type="text" placeholder="Ex : BTS Gestion de la PME"' +
        ' oninput="updateFormation(' + n + ',\'diplome\',this.value);updatePreview()">' +
      '</div>' +
      '<div class="field-group"><label class="field-label">Établissement <span class="field-required">*</span></label>' +
        '<input class="field-input" type="text" placeholder="Ex : Lycée Melkior-Garré, Cayenne"' +
        ' oninput="updateFormation(' + n + ',\'etablissement\',this.value);updatePreview()">' +
      '</div>' +
      '<div class="field-row">' +
        '<div class="field-group"><label class="field-label">Année d\'obtention <span class="field-required">*</span></label>' +
          '<input class="field-input" type="text" placeholder="2021"' +
          ' oninput="updateFormation(' + n + ',\'annee\',this.value);updatePreview()"></div>' +
        '<div class="field-group"><label class="field-label">Mention</label>' +
          '<select class="field-select" onchange="updateFormation(' + n + ',\'mention\',this.value);updatePreview()">' +
            '<option value="">— Sans mention —</option>' +
            '<option>Passable</option><option>Assez bien</option>' +
            '<option>Bien</option><option>Très bien</option>' +
          '</select></div>' +
      '</div>';
    var container = document.getElementById('formations-container');
    if (container) container.appendChild(card);
    if (!cvData.formations[n - 1]) cvData.formations[n - 1] = {};
  }

  function updateFormation(n, field, value) {
    if (!cvData.formations[n - 1]) cvData.formations[n - 1] = {};
    cvData.formations[n - 1][field] = value;
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
        '<button class="tag-remove" onclick="removeTag(\'' + section + '\',\'' + t.replace(/'/g, "\\'") + '\')" aria-label="Supprimer">×</button>' +
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
  var LANGUE_NIVEAUX = ['Notions', 'Intermédiaire', 'Courant', 'Bilingue', 'Langue maternelle'];

  function addLangue() {
    langueCount++;
    var n = langueCount;
    var card = document.createElement('div');
    card.className = 'dynamic-card langue-card';
    card.id = 'lang-card-' + n;
    card.innerHTML =
      '<div class="dynamic-card-header">' +
        '<span class="dynamic-card-title">Langue ' + n + '</span>' +
        '<button class="btn-remove-card" onclick="removeCard(\'lang-card-' + n + '\',\'langues\',' + n + ')">×</button>' +
      '</div>' +
      '<div class="field-row">' +
        '<div class="field-group"><label class="field-label">Langue <span class="field-required">*</span></label>' +
          '<input class="field-input" type="text" placeholder="Ex : Portugais"' +
          ' oninput="updateLangue(' + n + ',\'langue\',this.value);updatePreview()"></div>' +
        '<div class="field-group"><label class="field-label">Niveau <span class="field-required">*</span></label>' +
          '<select class="field-select" onchange="updateLangue(' + n + ',\'niveau\',this.value);updatePreview()">' +
            '<option value="">— Choisir —</option>' +
            LANGUE_NIVEAUX.map(function (l) { return '<option>' + l + '</option>'; }).join('') +
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
    if (cvData.profil.poste) lines.push('Poste visé : ' + cvData.profil.poste);
    var exps = cvData.experiences.filter(Boolean);
    if (exps.length) lines.push(exps.length + ' expérience(s)');
    var forms = cvData.formations.filter(Boolean);
    if (forms.length) lines.push(forms.length + ' formation(s)');
    var comps = (cvData.competences || []).filter(Boolean);
    if (comps.length) lines.push('Compétences : ' + comps.join(', '));
    var langs = (cvData.langues || []).filter(Boolean);
    if (langs.length) lines.push('Langues : ' + langs.filter(function (l) { return l.langue; }).map(function (l) { return l.langue + (l.niveau ? ' (' + l.niveau + ')' : ''); }).join(', '));
    box.innerHTML = lines.length ? lines.join('<br>') : 'Complétez les étapes précédentes pour voir le récapitulatif.';
  }

  /* ── Upload PDF ── */
  function handlePdfUpload(file) {
    if (!file) return;
    var zone = document.querySelector('.pdf-upload-zone');
    if (zone) zone.textContent = '⏳ Extraction en cours…';
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
        if (zone) zone.textContent = '✅ CV importé — informations extraites';
      })
      .catch(function () {
        if (zone) zone.textContent = '⚠️ Erreur extraction — remplissez manuellement';
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

  /* ── Suggestions ── */
  var STATIC_SUGGESTIONS = {
    poste: ['Assistant Administratif', 'Secrétaire', 'Agent Administratif',
            'Chargé de mission', 'Responsable administratif'],
    accroche: ['Rigoureux et organisé avec X ans d\'expérience',
               'Maîtrise des outils bureautiques et administratifs',
               'Disponible immédiatement sur le territoire guyanais'],
    missions: ['Géré les dossiers administratifs', 'Accueilli 50+ usagers/semaine',
               'Rédigé des courriers officiels', 'Assuré le classement et l\'archivage']
  };

  function triggerSuggestions(field, poste) {
    var key = field.startsWith('missions') ? 'missions' : field;
    var suggestions = STATIC_SUGGESTIONS[key] || [];
    var container = document.getElementById('suggestions-' + field);
    if (!container || !suggestions.length) return;
    container.innerHTML = suggestions.map(function (s) {
      return '<span class="suggestion-chip" onclick="applySuggestion(\'' +
        field + '\',\'' + s.replace(/'/g, "\\'") + '\')">' + s + '</span>';
    }).join('');
  }

  function applySuggestion(field, value) {
    var container = document.getElementById('suggestions-' + field);
    var input = container ? container.previousElementSibling : null;
    if (!input) return;
    if (input.tagName === 'TEXTAREA') {
      input.value += (input.value ? '\n' : '') + '• ' + value;
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event('input'));
  }

  /* ── Preview ── */
  function updatePreview() {
    var preview = document.getElementById('preview-cv');
    if (!preview) return;
    var name  = (cvData.identite.prenom || 'Prénom') + ' ' + (cvData.identite.nom || 'NOM');
    var poste = cvData.profil.poste || 'Poste visé';
    preview.innerHTML =
      '<div style="padding:40px;font-family:system-ui;color:#333;background:#fff;min-height:297mm">' +
        '<h1 style="margin:0;font-size:24px">' + name + '</h1>' +
        '<p style="color:#666;margin:4px 0 20px">' + poste + '</p>' +
        '<p style="color:#999;font-size:13px">Aperçu complet disponible après remplissage</p>' +
      '</div>';
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
    updatePreview();

    // Masquer la zone photo si sans photo
    if (!cvData.withPhoto) {
      var photoZone = document.getElementById('photo-upload-zone');
      if (photoZone) photoZone.style.display = 'none';
    }

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
      // Créer la première expérience vide
      addExperience();
    }

    // Suggestions initiales
    triggerSuggestions('poste', '');
    initCompSuggestions();

    // Première formation et langue vides
    addFormation();
    addLangue();
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

})();
