/* fix.js v14 - ConcretePro Global Button, Link & Module Fixer + UX Enhancement
   Changes v14:
   - BUG FIX: Scroll-reveal 500ms delay removed → hero/above-fold immediately visible
   - BUG FIX: Scroll-reveal immediately shows elements already in viewport (no flash)
   - BUG FIX: Products pagination rewritten → 6 cards/page, NO display:none freeze
   - BUG FIX: fixEnglishHeader() → replace "CONCRETE SOLUTIONS" with "CONCRETEPRO" on sub-pages
   - BUG FIX: fixSubPageNav() → correct Vietnamese nav links on all sub-pages
   - ADDED: NEWS_PAGE constant for /chitittintcgiiphpbtngxanh.html
   Changes v13:
   - BUG FIX: Wire up Pagination < > buttons trang San Pham (chevron_left/right)
   Changes v12:
   - UX#1-10: Page loader, scroll-to-top, sticky header, active nav, scroll-reveal,
               ripple, mobile menu, toast, card hover, form UX
*/
(function () {
'use strict';

var QUOTE_PAGE    = '/linhbogi.html';
var PRODUCTS_PAGE = '/snphmvtliuxydng.html';
var CONTACT_PAGE  = '/giithiucngty.html';
var PROJECTS_PAGE = '/hsdn.html';
var NEWS_PAGE     = '/chitittintcgiiphpbtngxanh.html';

// ============================================================
// EVENT DELEGATION - handles buttons even after DOM re-render
// ============================================================
document.addEventListener('click', function(e) {
  var el = e.target;
  while (el && el !== document.body) {
    var tag = el.tagName;
    if (tag === 'BUTTON' || tag === 'A') break;
    el = el.parentElement;
  }
  if (!el || el === document.body) return;

  var text = el.textContent.trim();
  var tag = el.tagName;

  // Ripple effect on every button click
  addRipple(el, e);

  if (tag === 'A') {
    var href = el.getAttribute('href') || '';
    if (href && href !== '#' && !href.startsWith('#') &&
        href !== '/trangchconcretepro.html' &&
        href !== '/muemailboconhkconcretepro.html') return;
  }

  if (/Kh.m Ph. Gi/i.test(text)) { e.preventDefault(); location.href = PRODUCTS_PAGE; return; }
  if (/Y.u c.u b|Get.{0,4}Quote|Get Quote/i.test(text)) { e.preventDefault(); location.href = QUOTE_PAGE; return; }
  if (/Xem Video|Watch Video/i.test(text)) { e.preventDefault(); window.open('https://www.youtube.com/results?search_query=beton+concretepro+viet+nam', '_blank'); return; }
  if (/Li.n h. K|Consult.{0,10}Engin|Request Technical|Schedule Consul/i.test(text)) { e.preventDefault(); location.href = QUOTE_PAGE; return; }
  if (/Y.u C.u B.o/i.test(text)) { e.preventDefault(); location.href = QUOTE_PAGE; return; }
  if (/Download.{0,15}Brochure|T.i Brochure/i.test(text)) { e.preventDefault(); window.open(QUOTE_PAGE, '_self'); return; }
  if (/View.{0,20}Map|Xem b.n .../i.test(text)) { e.preventDefault(); window.open('https://maps.google.com/?q=Hai+Phong+Vietnam+concrete', '_blank'); return; }
  if (/Org Chart|S. .../i.test(text)) { e.preventDefault(); toggleOrgChart(el); return; }
  if (/^Li.n h.$/i.test(text)) { e.preventDefault(); location.href = CONTACT_PAGE; return; }
  if (/Chi ti.t|arrow_forward/i.test(text)) { e.preventDefault(); location.href = PRODUCTS_PAGE; return; }
  if (/^share$/i.test(text)) {
    e.preventDefault();
    try { if (navigator.share) { navigator.share({url: location.href, title: document.title}); }
          else if (navigator.clipboard) { navigator.clipboard.writeText(location.href); showToast('Link đã sao chép!', 'success'); } } catch(ex){}
    return;
  }
  if (/^link$/i.test(text)) {
    e.preventDefault();
    try { if (navigator.clipboard) { navigator.clipboard.writeText(location.href); showToast('Link đã sao chép!', 'success'); } } catch(ex){}
    return;
  }
  if (/^social_leaderboard$/i.test(text)) { e.preventDefault(); location.href = PRODUCTS_PAGE; return; }

  if (tag === 'A') {
    var h = el.getAttribute('href') || '';
    if (h === '/trangchconcretepro.html') { e.preventDefault(); location.href = '/'; return; }
    if (h === '/muemailboconhkconcretepro.html') { e.preventDefault(); location.href = QUOTE_PAGE; return; }
    if (h === '#tuyen-dung') { e.preventDefault(); location.href = CONTACT_PAGE; return; }
    if (h === '#ban-do') { e.preventDefault(); window.open('https://maps.google.com/?q=Hai+Phong+Vietnam', '_blank'); return; }
    if (h === '#chinh-sach' || h === '#dieu-khoan') { e.preventDefault(); location.href = QUOTE_PAGE; return; }
    if (h === '#sitemap' || h === '#tech-specs' || h === '#compliance' || h === '#safety') { e.preventDefault(); location.href = PRODUCTS_PAGE; return; }
    if (h === '#privacy' || h === '#terms') { e.preventDefault(); location.href = CONTACT_PAGE; return; }
  }
}, true);

function toggleOrgChart(btn) {
  var chart = document.getElementById('org-chart') || document.querySelector('[data-org-chart]');
  if (chart) { chart.style.display = chart.style.display === 'none' ? 'block' : 'none'; }
  else { window.open(CONTACT_PAGE, '_self'); }
}

// ============================================================
// UX#1 — PAGE LOAD PROGRESS BAR
// ============================================================
function setupPageLoader() {
  if (document.getElementById('cp-loader')) return;
  var bar = document.createElement('div');
  bar.id = 'cp-loader';
  bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0%;background:linear-gradient(90deg,#16a34a,#22c55e,#86efac);z-index:99999;transition:width 0.3s ease;border-radius:0 2px 2px 0;box-shadow:0 0 8px rgba(34,197,94,0.6)';
  document.body.appendChild(bar);
  var prog = 0;
  var iv = setInterval(function() {
    prog += Math.random() * 15;
    if (prog > 85) prog = 85;
    bar.style.width = prog + '%';
  }, 200);
  function finish() {
    clearInterval(iv);
    bar.style.width = '100%';
    setTimeout(function() { bar.style.opacity = '0'; setTimeout(function() { bar.remove(); }, 400); }, 300);
  }
  if (document.readyState === 'complete') { finish(); }
  else { window.addEventListener('load', finish); }
}

// ============================================================
// UX#2 — SCROLL-TO-TOP BUTTON
// ============================================================
function setupScrollToTop() {
  if (document.getElementById('cp-scroll-top')) return;
  var btn = document.createElement('button');
  btn.id = 'cp-scroll-top';
  btn.innerHTML = '&#8679;';
  btn.title = 'Về đầu trang';
  btn.style.cssText = [
    'position:fixed;bottom:24px;right:24px;width:44px;height:44px',
    'background:#16a34a;color:white;border:none;border-radius:50%',
    'font-size:22px;font-weight:bold;cursor:pointer;z-index:9998',
    'opacity:0;transform:translateY(20px)',
    'transition:opacity 0.3s ease,transform 0.3s ease,background 0.2s',
    'box-shadow:0 4px 16px rgba(22,163,74,0.4);line-height:1',
    'display:flex;align-items:center;justify-content:center'
  ].join(';');
  btn.onmouseenter = function() { this.style.background = '#15803d'; this.style.transform = 'translateY(0) scale(1.08)'; };
  btn.onmouseleave = function() { this.style.background = '#16a34a'; this.style.transform = 'translateY(0) scale(1)'; };
  btn.onclick = function() { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  document.body.appendChild(btn);
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      btn.style.opacity = '1'; btn.style.transform = 'translateY(0)';
    } else {
      btn.style.opacity = '0'; btn.style.transform = 'translateY(20px)';
    }
  }, { passive: true });
}

// ============================================================
// UX#3 — STICKY HEADER SHADOW ON SCROLL
// ============================================================
function setupStickyHeader() {
  var header = document.querySelector('header');
  if (!header) return;
  header.style.transition = 'box-shadow 0.3s ease, background-color 0.3s ease';
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.12)';
      if (!header.style.backgroundColor || header.style.backgroundColor === 'transparent') {
        header.style.backgroundColor = 'rgba(255,255,255,0.97)';
        header.style.backdropFilter = 'blur(8px)';
      }
    } else {
      header.style.boxShadow = '';
      header.style.backgroundColor = '';
      header.style.backdropFilter = '';
    }
  }, { passive: true });
}

// ============================================================
// UX#4 — ACTIVE NAV LINK HIGHLIGHT
// ============================================================
function setupActiveNav() {
  var path = location.pathname;
  document.querySelectorAll('nav a, header a').forEach(function(a) {
    var h = a.getAttribute('href') || '';
    var isActive = (path === '/' && (h === '/' || h === '/index.html')) ||
                   (h !== '/' && h !== '/index.html' && path.includes(h.replace('.html','')));
    if (isActive) {
      a.style.cssText += ';color:#16a34a !important;font-weight:700;border-bottom:2px solid #16a34a';
    }
  });
}

// ============================================================
// UX#5 — SCROLL-REVEAL FADE-IN ANIMATIONS (v14 FIXED)
// BUG FIX: Elements in viewport on load are immediately visible (no 500ms blank flash)
// ============================================================
function setupScrollReveal() {
  if (document.getElementById('cp-reveal-style')) return; // already set up
  var style = document.createElement('style');
  style.id = 'cp-reveal-style';
  style.textContent = [
    '.cp-reveal{opacity:0;transform:translateY(28px);transition:opacity 0.55s ease,transform 0.55s ease}',
    '.cp-reveal.cp-visible{opacity:1 !important;transform:translateY(0) !important}',
    '.cp-reveal-left{opacity:0;transform:translateX(-28px);transition:opacity 0.55s ease,transform 0.55s ease}',
    '.cp-reveal-left.cp-visible{opacity:1 !important;transform:translateX(0) !important}',
    '.cp-reveal-scale{opacity:0;transform:scale(0.93);transition:opacity 0.5s ease,transform 0.5s ease}',
    '.cp-reveal-scale.cp-visible{opacity:1 !important;transform:scale(1) !important}'
  ].join('');
  document.head.appendChild(style);

  var vh = window.innerHeight;

  var observer = null;
  if (window.IntersectionObserver) {
    observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('cp-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  }

  var selectors = [
    'section', 'article',
    '[class*="card"]', '[class*="feature"]', '[class*="stat"]',
    '[class*="service"]', '[class*="project"]', '[class*="team"]',
    'h2', 'h3'
  ];
  selectors.forEach(function(sel) {
    document.querySelectorAll(sel).forEach(function(el) {
      if (el.closest('nav') || el.closest('header') || el.closest('footer')) return;
      if (el.classList.contains('cp-reveal') || el.classList.contains('cp-visible')) return;

      // v14 FIX: Check if element is already visible in viewport → add cp-visible immediately
      var rect = el.getBoundingClientRect();
      var inViewport = rect.top < vh && rect.bottom > 0 && rect.height > 0;
      if (inViewport) {
        // Already visible - skip animation entirely
        return;
      }

      el.classList.add('cp-reveal');
      if (observer) observer.observe(el);
    });
  });
}

// ============================================================
// UX#6 — BUTTON RIPPLE CLICK EFFECT
// ============================================================
var _rippleStyle = false;
function addRipple(el, e) {
  if (!_rippleStyle) {
    var s = document.createElement('style');
    s.textContent = '@keyframes cp-ripple{to{transform:scale(4);opacity:0}}.cp-ripple-wrap{position:relative;overflow:hidden}.cp-ripple-dot{position:absolute;border-radius:50%;background:rgba(255,255,255,0.35);width:10px;height:10px;margin-top:-5px;margin-left:-5px;pointer-events:none;animation:cp-ripple 0.55s linear}';
    document.head.appendChild(s);
    _rippleStyle = true;
  }
  if (!el || !el.style) return;
  el.classList.add('cp-ripple-wrap');
  var rect = el.getBoundingClientRect();
  var dot = document.createElement('span');
  dot.className = 'cp-ripple-dot';
  dot.style.left = (e.clientX - rect.left) + 'px';
  dot.style.top = (e.clientY - rect.top) + 'px';
  el.appendChild(dot);
  setTimeout(function() { if (dot.parentNode) dot.parentNode.removeChild(dot); }, 600);
}

// ============================================================
// UX#7 — SMOOTH MOBILE MENU WITH OVERLAY
// ============================================================
function setupMobileMenu() {
  var menuBtns = Array.from(document.querySelectorAll('header button'));
  var menuBtn = menuBtns.find(function(b) {
    var t = b.textContent.trim();
    return t === 'menu' || b.className.includes('md:hidden');
  });
  if (!menuBtn || menuBtn._cpMenu) return;
  menuBtn._cpMenu = true;
  var nav = document.querySelector('header nav');
  if (!nav) return;

  var overlay = document.getElementById('cp-menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'cp-menu-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:9997;opacity:0;pointer-events:none;transition:opacity 0.25s ease;backdrop-filter:blur(2px)';
    document.body.appendChild(overlay);
  }

  var menuOpen = false;
  function openMenu() {
    menuOpen = true;
    nav.style.cssText = [
      'display:flex !important;flex-direction:column',
      'position:fixed;top:0;right:0;bottom:0;width:280px',
      'background:#fff;padding:24px 20px;gap:8px;z-index:9998',
      'box-shadow:-4px 0 24px rgba(0,0,0,0.15)',
      'transform:translateX(0);transition:transform 0.28s cubic-bezier(0.4,0,0.2,1)',
      'overflow-y:auto'
    ].join(';');
    overlay.style.opacity = '1'; overlay.style.pointerEvents = 'auto';
    nav.querySelectorAll('a').forEach(function(a) {
      a.style.cssText += ';display:block;padding:10px 12px;border-radius:8px;font-size:16px;font-weight:500;transition:background 0.15s';
      a.onmouseenter = function() { this.style.background = '#f0fdf4'; };
      a.onmouseleave = function() { this.style.background = ''; };
    });
  }
  function closeMenu() {
    menuOpen = false;
    nav.style.transform = 'translateX(100%)';
    overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none';
    setTimeout(function() { if (!menuOpen) nav.style.display = ''; }, 280);
  }

  menuBtn.onclick = function() { menuOpen ? closeMenu() : openMenu(); };
  overlay.onclick = closeMenu;
  menuBtn.style.cursor = 'pointer';
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });
}

// ============================================================
// UX#8 — STYLED TOAST NOTIFICATIONS
// ============================================================
function showToast(msg, type) {
  var colors = { success: '#16a34a', error: '#dc2626', info: '#2563eb', warning: '#d97706' };
  var icons  = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  var bg = colors[type] || colors.info;
  var icon = icons[type] || icons.info;
  var toast = document.createElement('div');
  toast.style.cssText = [
    'position:fixed;top:20px;right:20px;z-index:99999',
    'background:' + bg + ';color:white',
    'padding:14px 20px;border-radius:10px',
    'font-size:15px;font-weight:600',
    'box-shadow:0 6px 24px rgba(0,0,0,0.2)',
    'display:flex;align-items:center;gap:10px',
    'opacity:0;transform:translateX(120px)',
    'transition:opacity 0.3s ease,transform 0.3s ease',
    'max-width:320px;cursor:pointer'
  ].join(';');
  toast.innerHTML = '<span style="font-size:18px">' + icon + '</span><span>' + msg + '</span>';
  document.body.appendChild(toast);
  requestAnimationFrame(function() {
    toast.style.opacity = '1'; toast.style.transform = 'translateX(0)';
  });
  toast.onclick = function() { dismissToast(toast); };
  setTimeout(function() { dismissToast(toast); }, 4000);
}
function dismissToast(toast) {
  toast.style.opacity = '0'; toast.style.transform = 'translateX(120px)';
  setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 350);
}
window.cpShowToast = showToast;

// ============================================================
// UX#9 — CARD HOVER LIFT EFFECT
// ============================================================
function setupCardHover() {
  if (document.getElementById('cp-card-hover-style')) return;
  var style = document.createElement('style');
  style.id = 'cp-card-hover-style';
  style.textContent = [
    '[class*="card"]:not(nav *):not(header *):not(footer *){',
    'transition:transform 0.22s ease,box-shadow 0.22s ease !important;',
    'will-change:transform}',
    '[class*="card"]:not(nav *):not(header *):not(footer *):hover{',
    'transform:translateY(-4px) !important;',
    'box-shadow:0 12px 32px rgba(0,0,0,0.12) !important}',
    '[class*="project"]:not(nav *):not(header *):not(footer *){',
    'transition:transform 0.22s ease,box-shadow 0.22s ease !important}',
    '[class*="project"]:not(nav *):not(header *):not(footer *):hover{',
    'transform:translateY(-4px) !important;',
    'box-shadow:0 12px 32px rgba(0,0,0,0.12) !important}',
    'button:not(nav *):not(header *){transition:filter 0.15s ease !important}',
    'button:not(nav *):not(header *):hover{filter:brightness(1.07) !important}'
  ].join('');
  document.head.appendChild(style);
}

// ============================================================
// UX#10 — INPUT FOCUS GLOW + FORM ENHANCEMENTS
// ============================================================
function setupFormUX() {
  if (document.getElementById('cp-form-style')) return;
  var style = document.createElement('style');
  style.id = 'cp-form-style';
  style.textContent = [
    'input:not([type=checkbox]):not([type=radio]):not([type=submit]),textarea,select{',
    'transition:border-color 0.2s ease,box-shadow 0.2s ease !important}',
    'input:not([type=checkbox]):not([type=radio]):not([type=submit]):focus,',
    'textarea:focus,select:focus{',
    'outline:none !important;',
    'border-color:#16a34a !important;',
    'box-shadow:0 0 0 3px rgba(22,163,74,0.18) !important}',
    'input::placeholder,textarea::placeholder{transition:opacity 0.2s ease}',
    'input:focus::placeholder,textarea:focus::placeholder{opacity:0.5}'
  ].join('');
  document.head.appendChild(style);
}

// ============================================================
// v14 NEW: FIX ENGLISH HEADER ON SUB-PAGES
// Replaces "CONCRETE SOLUTIONS" branding with "CONCRETEPRO"
// Translates English nav items to Vietnamese
// ============================================================
function fixEnglishHeader() {
  // Only run if English brand detected
  var hasEnglishBrand = false;
  document.querySelectorAll('header *, nav *').forEach(function(el) {
    if (el.children.length === 0 && el.textContent.trim() === 'CONCRETE SOLUTIONS') {
      hasEnglishBrand = true;
      el.textContent = 'CONCRETEPRO';
      el.style.cssText += ';color:#041627 !important;font-weight:800 !important;font-size:inherit;letter-spacing:-0.02em';
    }
  });
  if (!hasEnglishBrand) return; // Homepage already has correct branding

  // Translate English nav items to Vietnamese
  var navTranslations = {
    'Materials': 'Sản phẩm',
    'Equipment': 'Dịch vụ',
    'Projects': 'Dự án',
    'Technical Resources': 'Tin tức',
    'Contact': 'Liên hệ',
    'Get a Quote': 'Yêu cầu báo giá',
    'GET A QUOTE': 'Yêu cầu báo giá',
    'Get a quote': 'Yêu cầu báo giá',
    'Get Quote': 'Yêu cầu báo giá'
  };

  // Fix nav link text AND href simultaneously
  var navLinkMap = {
    'Materials': PRODUCTS_PAGE,
    'Sản phẩm': PRODUCTS_PAGE,
    'Equipment': QUOTE_PAGE,
    'Dịch vụ': QUOTE_PAGE,
    'Projects': PROJECTS_PAGE,
    'Dự án': PROJECTS_PAGE,
    'Technical Resources': NEWS_PAGE,
    'Tin tức': NEWS_PAGE,
    'Contact': CONTACT_PAGE,
    'Liên hệ': CONTACT_PAGE
  };

  document.querySelectorAll('nav a, header a, header button').forEach(function(el) {
    var t = el.textContent.trim();
    if (navTranslations[t]) {
      el.textContent = navTranslations[t];
      t = navTranslations[t]; // update t for href assignment below
    }
    if (el.tagName === 'A' && navLinkMap[t]) {
      el.setAttribute('href', navLinkMap[t]);
    }
    // Fix "Get a Quote" button
    if (/Get.{0,5}Quote/i.test(el.textContent.trim())) {
      el.textContent = 'Yêu cầu báo giá';
      if (el.tagName === 'A') el.setAttribute('href', QUOTE_PAGE);
    }
  });

  // Apply CONCRETEPRO header styling
  var header = document.querySelector('header');
  if (header) {
    header.style.cssText += ';border-bottom:1px solid #e5e7eb';
    // Find logo link and style it
    var logoLink = header.querySelector('a:first-child, a[href="/"], a[href="./"]');
    if (logoLink) {
      logoLink.setAttribute('href', '/');
      logoLink.style.cssText += ';text-decoration:none';
    }
  }
}

// ============================================================
// EXISTING FIXES (v11 preserved) + v14 improvements
// ============================================================
function applyVisualFixes() {
  document.querySelectorAll('button').forEach(function(btn) {
    var t = btn.textContent.trim();
    if (/Kh.m|Y.u|Get|Xem|Download|Li.n|Chi ti|arrow|share|link|social|View|consult|schedule|request/i.test(t)) {
      btn.style.cursor = 'pointer';
    }
  });
  document.querySelectorAll('nav a, header a').forEach(function(a) {
    var h = a.getAttribute('href') || '';
    if (h === '/trangchconcretepro.html') a.setAttribute('href', '/');
    if (h === '/muemailboconhkconcretepro.html') a.setAttribute('href', QUOTE_PAGE);
  });
  document.querySelectorAll('a[href="#tuyen-dung"]').forEach(function(a) { a.href = CONTACT_PAGE; });
  document.querySelectorAll('a[href="#ban-do"]').forEach(function(a) { a.href = 'https://maps.google.com/?q=Hai+Phong+Vietnam'; a.target = '_blank'; });
  document.querySelectorAll('a[href="#chinh-sach"], a[href="#dieu-khoan"]').forEach(function(a) { a.href = QUOTE_PAGE; });
  document.querySelectorAll('a[href="#sitemap"], a[href="#tech-specs"], a[href="#compliance"], a[href="#safety"]').forEach(function(a) { a.href = PRODUCTS_PAGE; });
  document.querySelectorAll('a[href="#privacy"], a[href="#terms"]').forEach(function(a) { a.href = CONTACT_PAGE; });

  // v14: Fix English header on sub-pages
  fixEnglishHeader();

  setupMobileMenu();
  setupProductsPage();
  setupProductPagination();
  setupServicesPage();
  setupProjectFilters();
  setupTinTucPage();
  setupSearch();
}

function setupProductsPage() {
  if (!location.pathname.includes('snphm')) return;
  function getAllCards() {
    var bestGrid = null, bestCount = 0;
    Array.from(document.querySelectorAll('[class*="grid-cols"]')).forEach(function(g) {
      if (g.closest('nav') || g.closest('header') || g.closest('footer')) return;
      var cnt = Array.from(g.children).filter(function(c) { return c.querySelector('h2,h3'); }).length;
      if (cnt > bestCount) { bestCount = cnt; bestGrid = g; }
    });
    return bestGrid ? Array.from(bestGrid.children).filter(function(c) { return c.querySelector('h2,h3'); }) : [];
  }
  var checkboxes = Array.from(document.querySelectorAll('input[type=checkbox]'));
  function applyFilters() {
    var checked = checkboxes.filter(function(cb) { return cb.checked; });
    var cards = getAllCards();
    if (checked.length === 0) { cards.forEach(function(c) { c.style.display = ''; }); return; }
    var labels = checked.map(function(cb) {
      var lbl = document.querySelector('label[for="' + cb.id + '"]') || cb.parentElement;
      return (lbl ? lbl.textContent : '').trim().toLowerCase().substring(0, 10);
    });
    cards.forEach(function(card) {
      var txt = card.textContent.toLowerCase();
      card.style.display = labels.some(function(l) { return !l || txt.includes(l.substring(0, 6)); }) ? '' : 'none';
    });
  }
  checkboxes.forEach(function(cb) {
    if (cb.onchange) return;
    cb.onchange = applyFilters; cb.style.cursor = 'pointer';
  });
  var sortSelect = document.querySelector('select');
  if (sortSelect && !sortSelect.onchange) {
    sortSelect.onchange = function() {
      var val = this.value.toLowerCase(), cards = getAllCards();
      var grid = cards.length ? cards[0].parentElement : null;
      if (!grid) return;
      Array.from(grid.children).sort(function(a, b) {
        var aT = (a.querySelector('h2,h3') || {}).textContent || '';
        var bT = (b.querySelector('h2,h3') || {}).textContent || '';
        if (val.includes('ten') || val.includes('name') || val.includes('a-z')) return aT.localeCompare(bT);
        if (val.includes('z-a')) return bT.localeCompare(aT);
        return 0;
      }).forEach(function(c) { grid.appendChild(c); });
    };
    sortSelect.style.cursor = 'pointer';
  }
  document.querySelectorAll('button').forEach(function(btn) {
    var icon = btn.textContent.trim();
    if ((icon === 'grid_view' || icon === 'view_list') && !btn.onclick) {
      btn.onclick = function() {
        var cards = getAllCards();
        var grid = cards.length ? cards[0].parentElement : null;
        if (!grid) return;
        grid.style.gridTemplateColumns = (icon === 'view_list') ? '1fr' : '';
      };
      btn.style.cursor = 'pointer';
    }
  });
}

// ============================================================
// v14 REWRITTEN: PRODUCT PAGINATION — 6 cards/page, NO freeze
// BUG FIX: Replaced display:none on 28 cards with page-based approach
// Uses requestAnimationFrame to batch DOM changes smoothly
// ============================================================
function setupProductPagination() {
  if (!location.pathname.includes('snphm')) return;
  var prevSpan = document.querySelector('[data-icon="chevron_left"]');
  var nextSpan = document.querySelector('[data-icon="chevron_right"]');
  if (!prevSpan || !nextSpan) return;
  var prevBtn = prevSpan.closest('button');
  var nextBtn = nextSpan.closest('button');
  if (!prevBtn || !nextBtn || prevBtn._paginationSet) return;
  prevBtn._paginationSet = true;

  var PAGE_SIZE = 6; // Show 6 products per page (matches "Hiển thị 1-6 trong số 29")
  var currentPage = 0;

  // Inject slide animation styles
  if (!document.getElementById('cp-pagination-style')) {
    var pst = document.createElement('style');
    pst.id = 'cp-pagination-style';
    pst.textContent = [
      '@keyframes cpSlideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}',
      '@keyframes cpSlideBack{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}',
      '.cp-pag-hide{display:none !important}',
      '.cp-pag-show{display:block !important}',
      '.cp-pag-anim-in{animation:cpSlideIn 0.3s ease}',
      '.cp-pag-anim-back{animation:cpSlideBack 0.3s ease}'
    ].join('');
    document.head.appendChild(pst);
  }

  var dotsContainer = document.querySelector('.flex.gap-1.h-2');

  function getPaginCards() {
    var bestGrid = null, bestCount = 0;
    Array.from(document.querySelectorAll('[class*="grid-cols"]')).forEach(function(g) {
      if (g.closest('nav') || g.closest('header') || g.closest('footer')) return;
      var cnt = Array.from(g.children).filter(function(c) { return c.querySelector('h2,h3'); }).length;
      if (cnt > bestCount) { bestCount = cnt; bestGrid = g; }
    });
    return bestGrid ? Array.from(bestGrid.children).filter(function(c) { return c.querySelector('h2,h3'); }) : [];
  }

  function getTotalPages(cards) {
    return Math.max(1, Math.ceil(cards.length / PAGE_SIZE));
  }

  function updateCounter(page, cards) {
    // Update "Hiển thị X-Y trong số Z" text
    var counter = document.querySelector('[class*="text-sm"][class*="text-on"]');
    if (!counter) {
      // Try to find by text content
      document.querySelectorAll('p,span,div').forEach(function(el) {
        if (/Hi.n th..*trong s./i.test(el.textContent) && el.children.length === 0) {
          counter = el;
        }
      });
    }
    if (counter) {
      var start = page * PAGE_SIZE + 1;
      var end = Math.min((page + 1) * PAGE_SIZE, cards.length);
      counter.textContent = 'Hiển thị ' + start + '-' + end + ' trong số ' + cards.length + ' sản phẩm';
    }
  }

  function updatePaginDots(page, totalPages) {
    if (!dotsContainer) return;
    var dots = Array.from(dotsContainer.children);
    dots.forEach(function(dot, i) {
      dot.style.transition = 'all 0.3s ease';
      if (i === page) {
        dot.style.opacity = '1';
        dot.style.transform = 'scaleY(2.5)';
        dot.style.background = '#16a34a';
      } else if (i < totalPages) {
        dot.style.opacity = '1';
        dot.style.transform = '';
        dot.style.background = '';
      } else {
        dot.style.opacity = '0.25';
        dot.style.transform = '';
      }
    });
  }

  function showPaginPage(p, dir) {
    var cards = getPaginCards();
    if (!cards.length) return;
    var totalPages = getTotalPages(cards);
    currentPage = ((p % totalPages) + totalPages) % totalPages;

    var animClass = (dir >= 0) ? 'cp-pag-anim-in' : 'cp-pag-anim-back';
    var start = currentPage * PAGE_SIZE;
    var end = start + PAGE_SIZE;

    // Use requestAnimationFrame to batch DOM changes - prevents freeze
    requestAnimationFrame(function() {
      cards.forEach(function(card, i) {
        var shouldShow = (i >= start && i < end);
        if (shouldShow) {
          card.style.display = '';
          card.style.animation = '';
          // Trigger animation on next frame
          requestAnimationFrame(function() {
            card.style.animation = animClass.includes('in')
              ? 'cpSlideIn 0.3s ease'
              : 'cpSlideBack 0.3s ease';
          });
        } else {
          card.style.display = 'none';
        }
      });
      updatePaginDots(currentPage, totalPages);
      updateCounter(currentPage, cards);
    });
  }

  prevBtn.onclick = function(e) { e.stopPropagation(); e.preventDefault(); showPaginPage(currentPage - 1, -1); };
  nextBtn.onclick = function(e) { e.stopPropagation(); e.preventDefault(); showPaginPage(currentPage + 1, 1); };
  prevBtn.style.cursor = 'pointer';
  nextBtn.style.cursor = 'pointer';

  // Initial: show page 0 without hiding too much - ensure first PAGE_SIZE visible
  var cards = getPaginCards();
  if (cards.length > PAGE_SIZE) {
    showPaginPage(0, 1);
  }
  // If <= PAGE_SIZE cards, show all normally (no pagination needed)
}

function setupServicesPage() {
  if (!location.pathname.includes('linhbogi')) return;
  document.querySelectorAll('form').forEach(function(form) {
    if (form.onsubmit) return;
    form.onsubmit = function(e) {
      e.preventDefault();
      showToast('Yêu cầu đã gửi thành công! Chúng tôi liên hệ trong 24h.', 'success');
      form.reset();
    };
  });
}

function setupProjectFilters() {
  if (!location.pathname.includes('hsdn')) return;
  document.querySelectorAll('[class*="project-card-overlay"]').forEach(function(overlay) {
    var badge = overlay.querySelector('span');
    if (badge && overlay.parentElement && !overlay.parentElement.dataset.category) {
      overlay.parentElement.setAttribute('data-category', badge.textContent.trim().toLowerCase());
    }
  });
  var FILTERS = { 'All Projects': 'all', 'Industrial': 'industrial', 'Infrastructure': 'infrastructure', 'Residential': 'residential' };
  function getProjectCards() {
    return Array.from(document.querySelectorAll('[data-category]')).filter(function(c) {
      return !c.closest('nav') && !c.closest('header') && !c.closest('footer');
    });
  }
  document.querySelectorAll('button').forEach(function(btn) {
    var label = btn.textContent.trim();
    if (!FILTERS[label] || btn.onclick) return;
    btn.onclick = function() {
      var key = FILTERS[label];
      getProjectCards().forEach(function(c) {
        var cat = (c.dataset.category || '').toLowerCase();
        c.style.display = (key === 'all' || cat === key) ? '' : 'none';
      });
      document.querySelectorAll('button').forEach(function(b) {
        if (FILTERS[b.textContent.trim()]) { b.style.opacity = '0.6'; b.style.fontWeight = ''; }
      });
      btn.style.opacity = '1'; btn.style.fontWeight = 'bold';
    };
    btn.style.cursor = 'pointer';
  });
}

function setupTinTucPage() {
  if (!location.pathname.includes('chitittint')) return;
  var articles = Array.from(document.querySelectorAll('article,[class*="news"],[class*="post"],[class*="card"]'))
    .filter(function(el) { return el.textContent.trim().length > 50 && !el.closest('nav') && !el.closest('header') && !el.closest('footer'); });
  var pageSize = 6, currentPage = 0;
  var totalPages = Math.max(1, Math.ceil(articles.length / pageSize));
  function showPage(p) {
    currentPage = Math.max(0, Math.min(p, totalPages - 1));
    articles.forEach(function(el, i) {
      el.style.display = (i >= currentPage * pageSize && i < (currentPage + 1) * pageSize) ? '' : 'none';
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (articles.length > pageSize) showPage(0);
  document.querySelectorAll('button').forEach(function(btn) {
    var t = btn.textContent.trim();
    if (t.includes('chevron_left') && !btn.onclick) { btn.onclick = function() { showPage(currentPage - 1); }; btn.style.cursor = 'pointer'; }
    if (t.includes('chevron_right') && !btn.onclick) { btn.onclick = function() { showPage(currentPage + 1); }; btn.style.cursor = 'pointer'; }
  });
}

function setupSearch() {
  var sInput = document.querySelector('input[placeholder*="Search"],input[placeholder*="search"],input[type=search]');
  if (!sInput || sInput.oninput) return;
  sInput.oninput = function() {
    var q = this.value.toLowerCase();
    document.querySelectorAll('article,[class*="news-item"],[class*="post"],li,[class*="card"]').forEach(function(item) {
      if (item === document.body || !item.textContent.trim()) return;
      item.style.display = (!q || item.textContent.toLowerCase().includes(q)) ? '' : 'none';
    });
  };
}

// ============================================================
// BOOT SEQUENCE
// ============================================================
function bootUX() {
  setupPageLoader();
  setupScrollToTop();
  setupStickyHeader();
  setupActiveNav();
  setupCardHover();
  setupFormUX();
  // v14 FIX: Call setupScrollReveal immediately (was 500ms timeout in v13 → caused blank flash)
  setupScrollReveal();
}

var _attempts = 0;
function scheduleRetries() {
  applyVisualFixes();
  var interval = setInterval(function() {
    applyVisualFixes();
    if (++_attempts >= 15) clearInterval(interval);
  }, 2000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    bootUX();
    scheduleRetries();
  });
} else {
  bootUX();
  setTimeout(scheduleRetries, 100);
}

})();

// ============================================================
// v16: SUPABASE DYNAMIC DATA INTEGRATION (fixed)
// - loadProjects: fetch first, only replace if data exists
// - loadSlides: fix <img> src update (not backgroundImage)
// - loadHomepageProducts: inject new section (not override bento)
// - timeout: 1500ms
// ============================================================
(function () {
'use strict';
var SB_URL = 'https://clalkraxfaeqbkeaikow.supabase.co';
var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsYWxrcmF4ZmFlcWJrZWFpa293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNjEzOTksImV4cCI6MjA5NDYzNzM5OX0.2EpUXzqLgjc2GUaOzEdvASILX_S_YZ5SJl-a3KYamWk';
var NEWS_PAGE = '/chitittintcgiiphpbtngxanh.html';
function sbGet(table, qs) {
  var url = SB_URL + '/rest/v1/' + table + '?select=*' + (qs ? '&' + qs : '');
  return fetch(url, { headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY } }).then(function(r) { return r.ok ? r.json() : []; });
}
function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function afterComment(text) {
  var tw = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT, null, false);
  var node;
  while ((node = tw.nextNode())) {
    if (node.nodeValue && node.nodeValue.trim().indexOf(text) >= 0) {
      var sib = node.nextSibling;
      while (sib && sib.nodeType === 3) sib = sib.nextSibling;
      if (sib && sib.nodeType === 1) return sib;
    }
  }
  return null;
}
function findGrid() {
  var candidates = Array.from(document.querySelectorAll('[class*="grid-cols-3"],[class*="grid-cols-2"],[class*="grid-cols-1"]'));
  return candidates.find(function(g) { return !g.closest('nav') && !g.closest('header') && !g.closest('footer') && !g.closest('aside'); }) || null;
}
function spinner() {
  var d = document.createElement('div');
  d.style.cssText = 'display:flex;align-items:center;justify-content:center;padding:3rem;gap:12px;color:#94a3b8;font-size:0.9rem;grid-column:1/-1';
  d.innerHTML = '<div style="width:28px;height:28px;border:3px solid #e2e8f0;border-top-color:#ea580c;border-radius:50%;animation:cp-spin 0.8s linear infinite"></div>Dang tai...';
  if (!document.getElementById('cp-spin-kf')) { var st = document.createElement('style'); st.id = 'cp-spin-kf'; st.textContent = '@keyframes cp-spin{to{transform:rotate(360deg)}}'; document.head.appendChild(st); }
  return d;
}
function loadProducts() {
  var grid = afterComment('Product Grid') || findGrid();
  if (!grid) return;
  grid.innerHTML = ''; grid.appendChild(spinner());
  sbGet('products', 'status=eq.active&order=created_at.desc').then(function(rows) {
    if (!rows || !rows.length) { grid.innerHTML = '<p style="color:#94a3b8;padding:2rem;grid-column:1/-1">Chua co san pham.</p>'; return; }
    grid.innerHTML = rows.map(function(p) {
      var img = esc(p.image || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80');
      var price = p.price ? esc(p.price) + ' VND/' + esc(p.unit || 'm3') : 'Lien he bao gia';
      var desc = esc(p.description || p.specs || '');
      var cat = esc(p.category || 'Be tong');
      return ['<div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden" style="transition:transform .25s,box-shadow .25s" onmouseenter="this.style.transform=\'translateY(-4px)\';this.style.boxShadow=\'0 12px 32px rgba(0,0,0,.12)\'" onmouseleave="this.style.transform=\'\';this.style.boxShadow=\'\'">','<div style="position:relative;height:200px;overflow:hidden;background:#f1f5f9">','<img src="' + img + '" alt="' + esc(p.name) + '" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display=\'none\'">','<span style="position:absolute;top:10px;left:10px;background:#ea580c;color:#fff;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px">' + cat + '</span>','</div>','<div style="padding:18px">','<h3 style="font-weight:700;font-size:1rem;margin-bottom:6px">' + esc(p.name) + '</h3>','<p style="font-size:13px;color:#64748b;margin-bottom:12px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + desc + '</p>','<div style="display:flex;align-items:center;justify-content:space-between">','<span style="color:#ea580c;font-weight:600;font-size:13px">' + price + '</span>','<button onclick="location.href=\'/linhbogi.html\'" style="background:#ea580c;color:#fff;border:none;border-radius:20px;padding:6px 14px;font-size:12px;font-weight:600;cursor:pointer" onmouseenter="this.style.background=\'#c2410c\'" onmouseleave="this.style.background=\'#ea580c\'">Bao gia</button>','</div>','</div>','</div>'].join('');
    }).join('');
    setTimeout(function() { document.dispatchEvent(new Event('cp-products-loaded')); }, 100);
  }).catch(function() { grid.innerHTML = ''; });
}
function loadProjects() {
  sbGet('projects', 'order=created_at.desc').then(function(rows) {
    if (!rows || !rows.length) return;
    var grid = afterComment('Project Grid') || findGrid();
    if (!grid) return;
    var stLabel = { ongoing: 'Dang thuc hien', completed: 'Hoan thanh', planning: 'Ke hoach' };
    var stColor = { ongoing: '#3b82f6', completed: '#16a34a', planning: '#f59e0b' };
    grid.className = grid.className.replace(/\bmd:grid-cols-12\b/g, 'md:grid-cols-3').replace(/\blg:grid-cols-12\b/g, 'lg:grid-cols-3');
    grid.innerHTML = rows.map(function(p) {
      var img = esc(p.image || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&q=80');
      var lbl = esc(stLabel[p.status] || p.status || 'Du an');
      var col = stColor[p.status] || '#64748b';
      var meta = [p.client, p.location, p.year].filter(Boolean).map(esc).join(' - ');
      return ['<div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 overflow-hidden" style="transition:transform .25s,box-shadow .25s" onmouseenter="this.style.transform=\'translateY(-4px)\';this.style.boxShadow=\'0 12px 32px rgba(0,0,0,.12)\'" onmouseleave="this.style.transform=\'\';this.style.boxShadow=\'\'">','<div style="position:relative;height:210px;overflow:hidden;background:#f1f5f9">','<img src="' + img + '" alt="' + esc(p.name) + '" style="width:100%;height:100%;object-fit:cover;transition:transform .5s" onmouseenter="this.style.transform=\'scale(1.06)\'" onmouseleave="this.style.transform=\'\'" onerror="this.style.display=\'none\'">','<span style="position:absolute;top:10px;left:10px;background:' + col + ';color:#fff;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px">' + lbl + '</span>','</div>','<div style="padding:18px">','<h3 style="font-weight:700;font-size:1rem;margin-bottom:4px">' + esc(p.name) + '</h3>',meta ? '<p style="font-size:12px;color:#94a3b8;margin-bottom:8px">' + meta + '</p>' : '',p.description ? '<p style="font-size:13px;color:#64748b;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + esc(p.description) + '</p>' : '','</div>','</div>'].join('');
    }).join('');
  }).catch(function() {});
}
function loadSlides() {
  sbGet('slides', 'status=eq.active&order=order_index.asc&limit=1').then(function(rows) {
    if (!rows || !rows.length) return;
    var slide = rows[0];
    var hero = document.getElementById('hero-slider') || document.querySelector('[id*="slider"],[id*="hero"],[class*="hero-slide"],[class*="slider-track"]') || document.querySelector('main > section:first-child') || document.querySelector('section:first-of-type');
    if (!hero) return;
    if (slide.title) { var h1 = hero.querySelector('h1'); if (h1) h1.textContent = slide.title; }
    if (slide.subtitle) { var paras = hero.querySelectorAll('p'); for (var i = 0; i < paras.length; i++) { if (!paras[i].closest('button') && !paras[i].closest('a')) { paras[i].textContent = slide.subtitle; break; } } }
    if (slide.image_url) { var bgImg = hero.querySelector('img'); if (bgImg) { bgImg.src = slide.image_url; } else { hero.style.backgroundImage = 'url(' + slide.image_url + ')'; hero.style.backgroundSize = 'cover'; hero.style.backgroundPosition = 'center'; } }
  }).catch(function() {});
}
function loadNewsSidebar() {
  var sidebarEl = afterComment('Latest News') || afterComment('Sidebar Section: Latest News');
  if (!sidebarEl) { var aside = document.querySelector('aside'); if (!aside) return; var lists = aside.querySelectorAll('ul,ol'); if (!lists.length) return; sidebarEl = lists[0]; }
  sbGet('news', 'status=eq.published&order=created_at.desc&limit=5').then(function(rows) {
    if (!rows || !rows.length) return;
    sidebarEl.innerHTML = rows.map(function(n) {
      var date = n.created_at ? new Date(n.created_at).toLocaleDateString('vi-VN') : '';
      return ['<li style="padding:10px 0;border-bottom:1px solid #f1f5f9">','<a href="' + NEWS_PAGE + '" style="font-size:13px;font-weight:500;color:inherit;text-decoration:none;display:block;margin-bottom:3px;transition:color .15s" onmouseenter="this.style.color=\'#ea580c\'" onmouseleave="this.style.color=\'\'">',esc(n.title),'</a>','<div style="font-size:11px;color:#94a3b8">' + date + (n.category ? ' - ' + esc(n.category) : '') + '</div>','</li>'].join('');
    }).join('');
  }).catch(function() {});
}
function loadHomepageProducts() {
  if (document.getElementById('sb-hp-products')) return;
  sbGet('products', 'status=eq.active&order=created_at.desc&limit=6').then(function(rows) {
    if (!rows || !rows.length) return;
    var insertAfter = null;
    var sections = document.querySelectorAll('main section, main > div');
    for (var i = 0; i < sections.length; i++) { var h = sections[i].querySelector('h2,h3'); if (h && (h.textContent.indexOf('Ph') >= 0 || h.textContent.indexOf('Products') >= 0)) { insertAfter = sections[i]; break; } }
    if (!insertAfter) { var cs = document.querySelectorAll('main section'); if (cs.length >= 3) insertAfter = cs[cs.length - 2]; }
    if (!insertAfter || !insertAfter.parentNode) return;
    var ns = document.createElement('section');
    ns.id = 'sb-hp-products';
    ns.style.cssText = 'padding:3rem 0;background:#f8f9fb;border-top:1px solid #e2e8f0';
    ns.innerHTML = ['<div style="max-width:1280px;margin:0 auto;padding:0 2rem">','<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;border-bottom:2px solid #041627;padding-bottom:.5rem">','<h2 style="font-size:1.5rem;font-weight:700;color:#041627">San Pham Moi Nhat</h2>','<a href="/snphmvtliuxydng.html" style="color:#ea580c;font-size:.8rem;font-weight:700;text-decoration:none;text-transform:uppercase">Xem tat ca</a>','</div>','<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem">',rows.map(function(p) { var img = esc(p.image || 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80'); var price = p.price ? esc(p.price) + ' VND' + (p.unit ? '/' + esc(p.unit) : '') : 'Lien he'; return ['<div style="border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);background:#fff;transition:transform .25s,box-shadow .25s;cursor:pointer" onmouseenter="this.style.transform=\'translateY(-4px)\';this.style.boxShadow=\'0 12px 32px rgba(0,0,0,.12)\'" onmouseleave="this.style.transform=\'\';this.style.boxShadow=\'\'" onclick="location.href=\'/snphmvtliuxydng.html\'">','<div style="height:170px;overflow:hidden;background:#f1f5f9">','<img src="' + img + '" alt="' + esc(p.name) + '" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display=\'none\'">','</div>','<div style="padding:14px">','<div style="font-size:11px;color:#ea580c;font-weight:600;margin-bottom:3px;text-transform:uppercase">' + esc(p.category || 'Be tong') + '</div>','<div style="font-weight:700;font-size:.9rem;margin-bottom:4px;color:#041627">' + esc(p.name) + '</div>','<div style="font-size:12px;color:#64748b">' + price + '</div>','</div>','</div>'].join(''); }).join(''),'</div>','</div>'].join('');
    insertAfter.parentNode.insertBefore(ns, insertAfter.nextSibling);
  }).catch(function() {});
}
function initSupabaseData() {
  var path = location.pathname;
  if (path.indexOf('snphm') >= 0) { loadProducts(); }
  else if (path.indexOf('hsdn') >= 0) { loadProjects(); }
  else if (path === '/' || path === '/index.html' || path.indexOf('trangch') >= 0) { loadSlides(); loadHomepageProducts(); }
  else if (path.indexOf('chitittint') >= 0) { loadNewsSidebar(); }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() { setTimeout(initSupabaseData, 800); });
} else {
  setTimeout(initSupabaseData, 1500);
}
})();
