/* ===================================================
   cv-wizard.js — Tunnel CV : Page 1 Galerie Templates
   =================================================== */

(function () {
  'use strict';

  /* ── Scale preview wrappers to fill their container ── */
  const INNER_WIDTH = 680; // px — fixed width of template inner div
  const CVW_TEMPLATES = {
    '01': { nameKey: 'cvw_tpl_01_name', descKey: 'cvw_tpl_01_desc', catKey: 'cvw_filter_classique', popular: true },
    '02': { nameKey: 'cvw_tpl_02_name', descKey: 'cvw_tpl_02_desc', catKey: 'cvw_filter_moderne' },
    '03': { nameKey: 'cvw_tpl_03_name', descKey: 'cvw_tpl_03_desc', catKey: 'cvw_filter_moderne' },
    '04': { nameKey: 'cvw_tpl_04_name', descKey: 'cvw_tpl_04_desc', catKey: 'cvw_filter_classique', popular: true },
    '05': { nameKey: 'cvw_tpl_05_name', descKey: 'cvw_tpl_05_desc', catKey: 'cvw_filter_premium' },
    '06': { nameKey: 'cvw_tpl_06_name', descKey: 'cvw_tpl_06_desc', catKey: 'cvw_filter_premium' },
    '07': { nameKey: 'cvw_tpl_07_name', descKey: 'cvw_tpl_07_desc', catKey: 'cvw_filter_moderne' },
    '08': { nameKey: 'cvw_tpl_08_name', descKey: 'cvw_tpl_08_desc', catKey: 'cvw_filter_classique' },
    '09': { nameKey: 'cvw_tpl_09_name', descKey: 'cvw_tpl_09_desc', catKey: 'cvw_filter_premium' },
    '10': { nameKey: 'cvw_tpl_10_name', descKey: 'cvw_tpl_10_desc', catKey: 'cvw_filter_moderne', popular: true },
    '11': { nameKey: 'cvw_tpl_11_name', descKey: 'cvw_tpl_11_desc', catKey: 'cvw_filter_moderne' },
    '12': { nameKey: 'cvw_tpl_12_name', descKey: 'cvw_tpl_12_desc', catKey: 'cvw_filter_futuriste' }
  };

  function cvwT(key, fallback) {
    if (window.DokPeyiI18n && typeof window.DokPeyiI18n.t === 'function') {
      return window.DokPeyiI18n.t(key, undefined, fallback || '');
    }
    return fallback || key;
  }

  function getTemplateMeta(id) {
    return CVW_TEMPLATES[id] || CVW_TEMPLATES['01'];
  }

  function computeScales() {
    document.querySelectorAll('.tpl-preview-wrap').forEach(function (wrap) {
      var w = wrap.offsetWidth;
      if (!w) return;
      var scale = w / INNER_WIDTH;
      var inner = wrap.querySelector('.tpl-preview-inner');
      if (!inner) return;
      inner.style.transform = 'scale(' + scale + ')';
      // Height: show top ~80% of an A4 page (enough to see header + first sections)
      wrap.style.height = Math.round(w * 0.80) + 'px';
    });
  }

  function computeModalScale() {
    var pane = document.getElementById('modal-preview-pane');
    var inner = document.getElementById('modal-preview-inner');
    if (!pane || !inner) return;
    var w = pane.offsetWidth;
    var scale = w / INNER_WIDTH;
    inner.style.transform = 'scale(' + scale + ')';
    pane.style.height = Math.round(w * 1.2) + 'px';
  }

  /* ── Navbar scroll class ── */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── Hamburger menu ── */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  /* ── Category filter ── */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var tplCards   = document.querySelectorAll('.tpl-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.dataset.filter;
      tplCards.forEach(function (card) {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ── Modal ── */
  var overlay          = document.getElementById('modal-overlay');
  var modalNum         = document.getElementById('modal-tpl-num');
  var modalName        = document.getElementById('modal-tpl-name');
  var modalPrice       = document.getElementById('modal-tpl-price');
  var modalCat         = document.getElementById('modal-tpl-cat');
  var modalDesc        = document.getElementById('modal-tpl-desc');
  var modalPreviewInner = document.getElementById('modal-preview-inner');
  var btnClose         = document.getElementById('btn-close-modal');
  var btnClose2        = document.getElementById('btn-close-modal-2');

  var currentId = null;

  function hydrateCard(card) {
    if (!card) return;

    var tplId = card.dataset.tplId;
    var meta = getTemplateMeta(tplId);
    var translatedName = cvwT(meta.nameKey, card.dataset.tplName || '');
    var translatedDesc = cvwT(meta.descKey, card.dataset.tplDesc || '');
    var translatedCat = cvwT(meta.catKey, card.dataset.tplCat || '');
    var popularBadge = card.querySelector('.tpl-badge-popular');
    var nameEl = card.querySelector('.tpl-card-name');
    var catEl = card.querySelector('.tpl-card-cat');

    card.dataset.tplName = translatedName;
    card.dataset.tplDesc = translatedDesc;
    card.dataset.tplCat = translatedCat;

    if (nameEl) nameEl.textContent = translatedName;
    if (catEl) catEl.textContent = translatedCat;
    if (popularBadge) popularBadge.textContent = cvwT('badge_popular', 'Populaire');
  }

  function hydrateModalMeta(card) {
    if (!card) return;
    if (modalNum)   modalNum.textContent   = card.dataset.tplNum   || card.dataset.tplId;
    if (modalName)  modalName.textContent  = card.dataset.tplName  || '';
    if (modalPrice) modalPrice.textContent = card.dataset.tplPrice || '';
    if (modalCat)   modalCat.textContent   = card.dataset.tplCat   || '';
    if (modalDesc)  modalDesc.textContent  = card.dataset.tplDesc  || '';
  }

  function openModal(card) {
    currentId = card.dataset.tplId;
    sessionStorage.setItem('cv_template', currentId);
    if (sessionStorage.getItem('cv_with_photo') === null) {
      sessionStorage.setItem('cv_with_photo', 'true');
    }
    hydrateModalMeta(card);

    // Clone inner preview content into modal
    if (modalPreviewInner) {
      var srcInner = card.querySelector('.tpl-preview-inner');
      if (srcInner) {
        modalPreviewInner.innerHTML = srcInner.innerHTML;
      }
    }

    // Reset toggle to "avec photo"
    document.querySelectorAll('.photo-card').forEach(function (pc) {
      pc.classList.toggle('active', pc.dataset.value === 'true');
    });

    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Compute scale after modal is visible
    requestAnimationFrame(function () {
      requestAnimationFrame(computeModalScale);
    });
  }

  function closeModal() {
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    currentId = null;
  }

  function refreshOpenModal() {
    if (!currentId || !overlay || !overlay.classList.contains('open')) return;
    var card = document.querySelector('.tpl-card[data-tpl-id="' + currentId + '"]');
    if (!card) return;
    hydrateModalMeta(card);
  }

  function refreshStep2Screen() {
    var step2 = document.getElementById('step2-screen');
    if (!step2 || step2.style.display !== 'flex') return;

    var params = new URLSearchParams(window.location.search);
    var tplId = params.get('template') || sessionStorage.getItem('cv_template') || '01';
    var meta = getTemplateMeta(tplId);
    var tplName = cvwT(meta.nameKey, 'Template');
    var nameEl = document.getElementById('step2-template-name');
    var badgeEl = document.getElementById('step2-photo-badge');
    var withPhoto = sessionStorage.getItem('cv_with_photo');

    if (nameEl) {
      nameEl.textContent = tplId.padStart(2, '0') + ' — ' + tplName;
    }

    if (badgeEl) {
      badgeEl.textContent = withPhoto === 'false'
        ? cvwT('cvw_photo_without_badge', '🚫 Sans photo')
        : cvwT('cvw_photo_with_badge', '📷 Avec photo');
    }
  }

  function applyCvWizardTranslations() {
    tplCards.forEach(function (card) {
      hydrateCard(card);
    });

    refreshOpenModal();
    refreshStep2Screen();
  }

  // Open on card click
  tplCards.forEach(function (card) {
    card.addEventListener('click', function () { openModal(card); });
  });

  // Close buttons
  if (btnClose)  btnClose.addEventListener('click',  closeModal);
  if (btnClose2) btnClose2.addEventListener('click', closeModal);

  // Close on overlay background click
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ── Single merged DOMContentLoaded ── */
  document.addEventListener('DOMContentLoaded', function () {
    var params = new URLSearchParams(window.location.search);
    var step = params.get('step');

    computeScales();
    computeModalScale();
    applyCvWizardTranslations();

    if (step === '2') {
      // Hide gallery sections
      document.querySelectorAll('.gallery-hero, .filter-section, .tpl-section').forEach(function (el) {
        el.style.display = 'none';
      });

      var s2 = document.getElementById('step2-screen');
      if (!s2) return;

      s2.style.display = 'flex';
      s2.removeAttribute('aria-hidden');
      refreshStep2Screen();
    }
  });

  document.addEventListener('dokpeyi:langchange', function () {
    applyCvWizardTranslations();
  });

  /* ── Resize ── */
  window.addEventListener('resize', function () {
    computeScales();
    if (overlay && overlay.classList.contains('open')) computeModalScale();
  }, { passive: true });

})();
