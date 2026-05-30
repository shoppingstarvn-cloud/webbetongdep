/* fix.js v10 - ConcretePro Global Button, Link & Module Fixer
   Changes v10: 
   - BUG#3 FIX: "Xóa bộ lọc" button handler (clear product filters)
   - BUG#4 FIX: Products page chevron pagination handler
   - BUG#5 FIX: View Interactive Map regex .{0,5} → .{0,20} to match "View Interactive Map"
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

  // Skip anchors that already have valid hrefs
  if (tag === 'A') {
    var href = el.getAttribute('href') || '';
    if (href && href !== '#' && !href.startsWith('#') &&
        href !== '/trangchconcretepro.html' &&
        href !== '/muemailboconhkconcretepro.html') return;
  }

  // "Kham Pha Giai Phap"
  if (/Kh.m Ph. Gi/i.test(text)) {
    e.preventDefault(); location.href = PRODUCTS_PAGE; return;
  }
  // "Yeu cau bao gia" / "Get a Quote" / "Get Quote"
  if (/Y.u c.u b|Get.{0,4}Quote|Get Quote/i.test(text)) {
    e.preventDefault(); location.href = QUOTE_PAGE; return;
  }
  // "Xem Video Nang Luc" / "Watch Video"
  if (/Xem Video|Watch Video/i.test(text)) {
    e.preventDefault(); window.open('https://www.youtube.com/results?search_query=beton+concretepro+viet+nam', '_blank'); return;
  }
  // "Lien he Ky su" / "Consult an Engineer"
  if (/Li.n h. K|Consult.{0,10}Engin|Request Technical|Schedule Consul/i.test(text)) {
    e.preventDefault(); location.href = QUOTE_PAGE; return;
  }
  // "Yeu Cau Bao Gia" (capitalized)
  if (/Y.u C.u B.o/i.test(text)) {
    e.preventDefault(); location.href = QUOTE_PAGE; return;
  }
  // "Download Technical Brochure"
  if (/Download.{0,5}Brochure|T.i Brochure/i.test(text)) {
    e.preventDefault(); window.open(QUOTE_PAGE, '_self'); return;
  }
  // BUG#5 FIX: View Interactive Map - expand {0,5} to {0,20}
  if (/View.{0,20}Map|Xem b.n .../i.test(text)) {
    e.preventDefault(); window.open('https://maps.google.com/?q=Hai+Phong+Vietnam+concrete', '_blank'); return;
  }
  // "View Full Org Chart"
  if (/Org Chart|S. .../i.test(text)) {
    e.preventDefault(); toggleOrgChart(el); return;
  }
  // "Lien he" standalone
  if (/^Li.n h.$/i.test(text)) {
    e.preventDefault(); location.href = CONTACT_PAGE; return;
  }
  // "Chi tiet" / "arrow_forward"
  if (/Chi ti.t|arrow_forward/i.test(text)) {
    e.preventDefault(); location.href = PRODUCTS_PAGE; return;
  }
  // Material icons
  if (/^share$/i.test(text)) {
    e.preventDefault();
    try { if (navigator.share) { navigator.share({url: location.href, title: document.title}); }
          else if (navigator.clipboard) { navigator.clipboard.writeText(location.href); } } catch(ex){}
    return;
  }
  if (/^link$/i.test(text)) {
    e.preventDefault();
    try { if (navigator.clipboard) { navigator.clipboard.writeText(location.href); } } catch(ex){}
    return;
  }
  if (/^social_leaderboard$/i.test(text)) {
    e.preventDefault(); location.href = PRODUCTS_PAGE; return;
  }

  // Fix bad nav/footer href on click
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

function applyVisualFixes() {
  document.querySelectorAll('button').forEach(function(btn) {
    var t = btn.textContent.trim();
    if (/Kh.m|Y.u|Get|Xem|Download|Li.n|Chi ti|arrow|share|link|social|View|consult|schedule|request|X.a b. l.c/i.test(t)) {
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
  setupServicesPage();
  setupProjectFilters();
  setupTinTucPage();
  setupSearch();
}

function setupMobileMenu() {
  var menuBtns = Array.from(document.querySelectorAll('header button'));
  var menuBtn = menuBtns.find(function(b) {
    var t = b.textContent.trim();
    return t === 'menu' || b.className.includes('md:hidden');
  });
  if (!menuBtn || menuBtn.onclick) return;
  var nav = document.querySelector('header nav');
  if (!nav) return;
  menuBtn.onclick = function() {
    var isHidden = getComputedStyle(nav).display === 'none' || !nav.style.display;
    nav.style.cssText = isHidden
      ? 'display:flex !important;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:#fff;padding:16px 24px;gap:12px;z-index:9999;border-bottom:1px solid #e5e7eb;box-shadow:0 4px 12px rgba(0,0,0,0.1)'
      : 'display:none';
  };
  menuBtn.style.cursor = 'pointer';
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
    cb.onchange = applyFilters;
    cb.style.cursor = 'pointer';
  });

  // BUG#3 FIX: Xóa bộ lọc clear filter button
  document.querySelectorAll('button').forEach(function(btn) {
    var t = btn.textContent.trim();
    if ((/X.a b. l.c|Clear.{0,6}filter|Reset.{0,6}filter/i.test(t)) && !btn.onclick) {
      btn.onclick = function() {
        checkboxes.forEach(function(cb) { cb.checked = false; });
        getAllCards().forEach(function(c) { c.style.display = ''; });
      };
      btn.style.cursor = 'pointer';
    }
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
        if (val.includes('ten') || val.includes('unit') || val.includes('a-z')) return aT.localeCompare(bT);
        if (val.includes('z-a')) return bT.localeCompare(aT);
        return 0;
      }).forEach(function(c) { grid.appendChild(c); });
    };
    sortSelect.style.cursor = 'pointer';
  }

  // Grid/List view toggle
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

  // BUG#4 FIX: Products page chevron pagination
  var prodPageSize = 6, prodCurrentPage = 0;
  var prodCards = getAllCards();
  var prodTotalPages = Math.max(1, Math.ceil(prodCards.length / prodPageSize));

  function showProductPage(p) {
    prodCurrentPage = Math.max(0, Math.min(p, prodTotalPages - 1));
    prodCards = getAllCards();
    prodCards.forEach(function(c, i) {
      c.style.display = (i >= prodCurrentPage * prodPageSize && i < (prodCurrentPage + 1) * prodPageSize) ? '' : 'none';
    });
  }

  document.querySelectorAll('button').forEach(function(btn) {
    var t = btn.textContent.trim();
    if (t.includes('chevron_left') && !btn.onclick) {
      btn.onclick = function() { showProductPage(prodCurrentPage - 1); };
      btn.style.cursor = 'pointer';
    }
    if (t.includes('chevron_right') && !btn.onclick) {
      btn.onclick = function() { showProductPage(prodCurrentPage + 1); };
      btn.style.cursor = 'pointer';
    }
  });
}

function setupServicesPage() {
  if (!location.pathname.includes('linhbogi')) return;
  document.querySelectorAll('form').forEach(function(form) {
    if (form.onsubmit) return;
    form.onsubmit = function(e) {
      e.preventDefault();
      var msg = document.createElement('div');
      msg.style.cssText = 'position:fixed;top:20px;right:20px;background:#22c55e;color:white;padding:16px 24px;border-radius:8px;z-index:9999;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.3);font-size:16px';
      msg.textContent = '✓ Yêu cầu đã gửi thành công! Chúng tôi sẽ liên hệ trong 24h.';
      document.body.appendChild(msg);
      form.reset();
      setTimeout(function() { if (msg.parentNode) msg.parentNode.removeChild(msg); }, 5000);
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

  var FILTERS = {
    'All Projects': 'all',
    'Industrial': 'industrial',
    'Infrastructure': 'infrastructure',
    'Residential': 'residential'
  };

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

var _attempts = 0;
function scheduleRetries() {
  applyVisualFixes();
  var interval = setInterval(function() {
    applyVisualFixes();
    if (++_attempts >= 15) clearInterval(interval);
  }, 2000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleRetries);
} else {
  setTimeout(scheduleRetries, 100);
}

})();
