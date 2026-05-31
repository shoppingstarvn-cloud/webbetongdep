/* fix.js v13 - ConcretePro Global Button, Link & Module Fixer + UX Enhancement
   Changes v13:
   - BUG FIX: Wire up Pagination < > buttons trang San Pham (chevron_left/right)
   Changes v12:
   - UX#1: Page load progress bar (slim top bar, green)
   - UX#2: Scroll-to-top floating button (appears after 300px scroll)
   - UX#3: Sticky header shadow on scroll
   - UX#4: Active nav link highlight (current page)
   - UX#5: Scroll-reveal animations (fade-in sections on scroll)
   - UX#6: Button ripple click feedback
   - UX#7: Smooth mobile menu with slide animation + overlay
   - UX#8: Toast notifications (styled upgrade)
   - UX#9: Card hover lift effect (product/project cards)
   - UX#10: Input focus glow on forms
*/
(function () {
'use strict';

var QUOTE_PAGE = '/linhbogi.html';
var PRODUCTS_PAGE = '/snphmvtliuxydng.html';
var CONTACT_PAGE = '/giithiucngty.html';
var PROJECTS_PAGE = '/hsdn.html';

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
          else if (navigator.clipboard) { navigator.clipboard.writeText(location.href); showToast('Link ÄÃ£ sao chÃ©p!', 'success'); } } catch(ex){}
    return;
  }
  if (/^link$/i.test(text)) {
    e.preventDefault();
    try { if (navigator.clipboard) { navigator.clipboard.writeText(location.href); showToast('Link ÄÃ£ sao chÃ©p!', 'success'); } } catch(ex){}
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
// UX#1 â PAGE LOAD PROGRESS BAR
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
// UX#2 â SCROLL-TO-TOP BUTTON
// ============================================================
function setupScrollToTop() {
  if (document.getElementById('cp-scroll-top')) return;
  var btn = document.createElement('button');
  btn.id = 'cp-scroll-top';
  btn.innerHTML = '&#8679;';
  btn.title = 'Vá» Äáº§u trang';
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
// UX#3 â STICKY HEADER SHADOW ON SCROLL
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
// UX#4 â ACTIVE NAV LINK HIGHLIGHT
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
// UX#5 â SCROLL-REVEAL FADE-IN ANIMATIONS
// ============================================================
function setupScrollReveal() {
  if (!window.IntersectionObserver) return;
  var style = document.createElement('style');
  style.textContent = [
    '.cp-reveal{opacity:0;transform:translateY(32px);transition:opacity 0.6s ease,transform 0.6s ease}',
    '.cp-reveal.cp-visible{opacity:1;transform:translateY(0)}',
    '.cp-reveal-left{opacity:0;transform:translateX(-32px);transition:opacity 0.6s ease,transform 0.6s ease}',
    '.cp-reveal-left.cp-visible{opacity:1;transform:translateX(0)}',
    '.cp-reveal-scale{opacity:0;transform:scale(0.92);transition:opacity 0.5s ease,transform 0.5s ease}',
    '.cp-reveal-scale.cp-visible{opacity:1;transform:scale(1)}'
  ].join('');
  document.head.appendChild(style);

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('cp-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Target sections, cards, feature blocks
  var selectors = [
    'section', 'article',
    '[class*="card"]', '[class*="feature"]', '[class*="stat"]',
    '[class*="service"]', '[class*="project"]', '[class*="team"]',
    'h2', 'h3'
  ];
  selectors.forEach(function(sel) {
    document.querySelectorAll(sel).forEach(function(el) {
      if (el.closest('nav') || el.closest('header') || el.closest('footer')) return;
      if (el.classList.contains('cp-reveal')) return;
      el.classList.add('cp-reveal');
      observer.observe(el);
    });
  });
}

// ============================================================
// UX#6 â BUTTON RIPPLE CLICK EFFECT
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
// UX#7 â SMOOTH MOBILE MENU WITH OVERLAY
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

  // Create overlay
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
    // Style nav links
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

  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });
}

// ============================================================
// UX#8 â STYLED TOAST NOTIFICATIONS
// ============================================================
function showToast(msg, type) {
  var colors = { success: '#16a34a', error: '#dc2626', info: '#2563eb', warning: '#d97706' };
  var icons  = { success: 'â', error: 'â', info: 'â¹', warning: 'â ' };
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
window.cpShowToast = showToast; // expose globally for other scripts

// ============================================================
// UX#9 â CARD HOVER LIFT EFFECT
// ============================================================
function setupCardHover() {
  var style = document.createElement('style');
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
// UX#10 â INPUT FOCUS GLOW + FORM ENHANCEMENTS
// ============================================================
function setupFormUX() {
  var style = document.createElement('style');
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
// EXISTING FIXES (v11 preserved)
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


function setupProductPagination() {
  if (!location.pathname.includes('snphm')) return;
  var prevSpan = document.querySelector('[data-icon="chevron_left"]');
  var nextSpan = document.querySelector('[data-icon="chevron_right"]');
  if (!prevSpan || !nextSpan) return;
  var prevBtn = prevSpan.closest('button');
  var nextBtn = nextSpan.closest('button');
  if (!prevBtn || !nextBtn || prevBtn._paginationSet) return;
  prevBtn._paginationSet = true;
  var dotsContainer = document.querySelector('.flex.gap-1.h-2');
  var currentPage = 0;
  if (!document.getElementById('cp-pagination-style')) {
    var pst = document.createElement('style');
    pst.id = 'cp-pagination-style';
    pst.textContent = '@keyframes cpSlideIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}@keyframes cpSlideBack{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}';
    document.head.appendChild(pst);
  }
  function getPaginCards() {
    var bestGrid = null, bestCount = 0;
    Array.from(document.querySelectorAll('[class*="grid-cols"]')).forEach(function(g) {
      if (g.closest('nav') || g.closest('header') || g.closest('footer')) return;
      var cnt = Array.from(g.children).filter(function(c) { return c.querySelector('h2,h3'); }).length;
      if (cnt > bestCount) { bestCount = cnt; bestGrid = g; }
    });
    return bestGrid ? Array.from(bestGrid.children).filter(function(c) { return c.querySelector('h2,h3'); }) : [];
  }
  function updatePaginDots(page, total) {
    if (!dotsContainer) return;
    var dots = Array.from(dotsContainer.children);
    dots.forEach(function(dot, i) {
      dot.style.transition = 'all 0.3s ease';
      if (i === page) {
        dot.className = 'h-1 flex-1 bg-on-tertiary-container rounded-sm';
        dot.style.opacity = '1';
        dot.style.transform = 'scaleY(2.5)';
      } else if (i < total) {
        dot.className = 'h-1 flex-1 bg-surface-container-high rounded-sm';
        dot.style.opacity = '1';
        dot.style.transform = '';
      } else {
        dot.className = 'h-1 flex-1 bg-surface-container-high rounded-sm';
        dot.style.opacity = '0.25';
        dot.style.transform = '';
      }
    });
  }
  function showPaginPage(p, dir) {
    var cards = getPaginCards();
    if (!cards.length) return;
    var total = cards.length;
    currentPage = ((p % total) + total) % total;
    var anim = (dir >= 0) ? 'cpSlideIn 0.35s ease' : 'cpSlideBack 0.35s ease';
    cards.forEach(function(card, i) {
      if (i === currentPage) {
        card.style.display = '';
        card.style.animation = anim;
      } else {
        card.style.display = 'none';
        card.style.animation = '';
      }
    });
    updatePaginDots(currentPage, total);
  }
  prevBtn.onclick = function(e) { e.stopPropagation(); e.preventDefault(); showPaginPage(currentPage - 1, -1); };
  nextBtn.onclick = function(e) { e.stopPropagation(); e.preventDefault(); showPaginPage(currentPage + 1, 1); };
  prevBtn.style.cursor = 'pointer';
  nextBtn.style.cursor = 'pointer';
  showPaginPage(0, 1);
}

function setupServicesPage() {
  if (!location.pathname.includes('linhbogi')) return;
  document.querySelectorAll('form').forEach(function(form) {
    if (form.onsubmit) return;
    form.onsubmit = function(e) {
      e.preventDefault();
      showToast('YÃªu cáº§u ÄÃ£ gá»­i thÃ nh cÃ´ng! ChÃºng tÃ´i liÃªn há» trong 24h.', 'success');
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
  // Scroll reveal runs once after DOM ready
  setTimeout(setupScrollReveal, 500);
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
