/* ===================================================
   cv-wizard.js — Tunnel CV : Page 1 Galerie Templates
   =================================================== */

(function () {
  'use strict';

  /* ── Step=2 routing: show confirmation screen ── */
  var _params = new URLSearchParams(window.location.search);
  if (_params.get('step') === '2') {
    if (document.readyState !== 'loading') {
      showStep2Screen();
    } else {
      document.addEventListener('DOMContentLoaded', showStep2Screen);
    }
    return;
  }

  /* ── Scale preview wrappers to fill their container ── */
  const INNER_WIDTH = 680; // px — fixed width of template inner div

  function computeScales() {
    document.querySelectorAll('.tpl-preview-wrap').forEach(function (wrap) {
      var w = wrap.offsetWidth;
      if (!w) return;
      var scale = w / INNER_WIDTH;
      var inner = wrap.querySelector('.tpl-preview-inner');
      if (!inner) return;
      inner.style.transform = 'scale(' + scale + ')';
      // Height: show top ~55% of an A4 page (enough to see header + first sections)
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
  var btnChoose        = document.getElementById('btn-choose');
  var btnClose         = document.getElementById('btn-close-modal');
  var btnClose2        = document.getElementById('btn-close-modal-2');

  var currentId = null;

  function openModal(card) {
    currentId = card.dataset.tplId;
    if (modalNum)   modalNum.textContent   = card.dataset.tplNum   || card.dataset.tplId;
    if (modalName)  modalName.textContent  = card.dataset.tplName  || '';
    if (modalPrice) modalPrice.textContent = card.dataset.tplPrice || '';
    if (modalCat)   modalCat.textContent   = card.dataset.tplCat   || '';
    if (modalDesc)  modalDesc.textContent  = card.dataset.tplDesc  || '';

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

  /* ── Choose template → sessionStorage + redirect to step=2 ── */
  if (btnChoose) {
    btnChoose.addEventListener('click', function () {
      if (!currentId) return;
      sessionStorage.setItem('cv_template', currentId);
      var cvWithPhoto = sessionStorage.getItem('cv_with_photo');
      if (cvWithPhoto === null) sessionStorage.setItem('cv_with_photo', 'true');
      window.location.href = 'cv-wizard.html?step=2';
    });
  }

  /* ── Init & resize ── */
  window.addEventListener('DOMContentLoaded', function () {
    computeScales();
    computeModalScale();
  });
  window.addEventListener('resize', function () {
    computeScales();
    if (overlay && overlay.classList.contains('open')) computeModalScale();
  }, { passive: true });

  // Run immediately if DOM already ready
  if (document.readyState !== 'loading') {
    computeScales();
  }

  /* ── Step-2 confirmation screen ── */
  function showStep2Screen() {
    var TPL_NAMES = {
      '01': 'Épuré',            '02': 'Sidebar Sombre',       '03': 'Brun Premium',
      '04': 'Navy Corporate',   '05': 'Full Dark',             '06': 'Dark Green',
      '07': 'Impact Rouge',     '08': 'Minimaliste Timeline',  '09': 'Géométrique Or',
      '10': 'Wave Navy',        '11': 'Yellow Dark',           '12': 'Cyber Neon'
    };
    var tpl    = sessionStorage.getItem('cv_template');
    var photo  = sessionStorage.getItem('cv_with_photo');
    var withPh = photo !== 'false';

    document.querySelectorAll('.gallery-hero, .filter-section, .tpl-section').forEach(function (el) {
      el.style.display = 'none';
    });

    var s2 = document.getElementById('step2-screen');
    if (!s2) return;
    s2.style.display = 'flex';
    s2.removeAttribute('aria-hidden');

    var nameEl = document.getElementById('step2-template-name');
    if (nameEl) nameEl.textContent = 'N°' + (tpl || '—') + ' · ' + (TPL_NAMES[tpl] || '—');

    var badgeEl = document.getElementById('step2-photo-badge');
    if (badgeEl) badgeEl.textContent = withPh ? '📷 Avec photo' : '🚫 Sans photo';
  }

})();
