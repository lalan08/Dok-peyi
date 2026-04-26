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
    if (section === 'experiences') cvData.experiences[n - 1] = null;
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

})();
