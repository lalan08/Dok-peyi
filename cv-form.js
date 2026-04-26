/* ===================================================
   cv-form.js — Tunnel CV : Page 3 Formulaire
   =================================================== */

(function () {
  'use strict';

  var currentStep = 1;
  var totalSteps  = 6;

  var cvData = {
    template:  sessionStorage.getItem('cv_template')   || '01',
    withPhoto: sessionStorage.getItem('cv_with_photo') !== 'false',
    mode:      sessionStorage.getItem('cv_mode')       || 'scratch'
  };

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
    if (cvData.mode === 'improve') {
      // Étape 1 remplacée par upload PDF — géré en S3-B
    }
  });

  /* ── Expose globals for inline onclick ── */
  window.nextStep            = nextStep;
  window.prevStep            = prevStep;
  window.submitForm          = submitForm;
  window.toggleMobilePreview = toggleMobilePreview;

})();
