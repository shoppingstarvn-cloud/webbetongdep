/* fix.js v3 - ConcretePro Global Button, Link & Module Fixer */
(function () {
'use strict';

var QUOTE_PAGE = '/linhbogi.html';
var PRODUCTS_PAGE = '/snphmvtliuxydng.html';
var CONTACT_PAGE = '/giithiucngty.html';
var PROJECTS_PAGE = '/hsdn.html';

var BTN_MAP = [
{ re: /Yêu cầu báo giá|Get a Quote|Get Quote|Liên hệ Kỹ sư|Request Technical Specs|Schedule Consultation|Consult an Engineer|Yêu Cầu Báo Giá/i, href: QUOTE_PAGE },
{ re: /Khám Phá Giải Pháp|Khám phá giải pháp/i, href: PRODUCTS_PAGE },
{ re: /Xem Video Năng Lực|Xem video|Watch Video/i, fn: function () { window.open('https://www.youtube.com/results?search_query=beton+concretepro+viet+nam', '_blank'); } },
{ re: /Download Technical Brochure|Tải Brochure|Download Brochure/i, fn: function () { window.open(QUOTE_PAGE, '_self'); } },
{ re: /View Interactive Map|Xem bản đồ/i, fn: function () { window.open('https://maps.google.com/?q=Hai+Phong+Vietnam+concrete', '_blank'); } },
{ re: /View Full Org Chart|Xem Sơ đồ/i, fn: function (btn) { toggleOrgChart(btn); } },
{ re: /Liên hệ$/i, href: CONTACT_PAGE },
{ re: /Chi tiết|arrow_forward/i, fn: function () { location.href = PRODUCTS_PAGE; } },
{ re: /^share$/i, fn: function () { try { if (navigator.share) { navigator.share({url: location.href, title: document.title}); } else if (navigator.clipboard) { navigator.clipboard.writeText(location.href); } } catch(e){} } },
{ re: /^link$/i, fn: function () { try { if (navigator.clipboard) { navigator.clipboard.writeText(location.href); } } catch(e){} } },
{ re: /^social_leaderboard$/i, fn: function () { location.href = PRODUCTS_PAGE; } },
];
function toggleOrgChart(btn) {
  var chart = document.getElementById('org-chart') || document.querySelector('[data-org-chart]');
  if (chart) {
    chart.style.display = chart.style.display === 'none' ? 'block' : 'none';
  } else {
    window.open(CONTACT_PAGE, '_self');
  }
}

// Mobile menu toggle - v3 FIX: use specific selector (md:hidden or text=menu)
function setupMobileMenu() {
  var menuBtns = Array.from(document.querySelectorAll('header button'));
  var menuBtn = menuBtns.find(function(b){
    var t = b.textContent.trim();
    return t === 'menu' || b.className.includes('md:hidden');
  });
  if (!menuBtn || menuBtn.onclick) return;
  var nav = document.querySelector('header nav');
  if (!nav) return;
  menuBtn.onclick = function () {
    var cs = getComputedStyle(nav);
    var isHidden = cs.display === 'none' || nav.style.display === '' || !nav.style.display;
    if (isHidden) {
      nav.style.cssText = 'display:flex !important;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:#fff;padding:16px 24px;gap:12px;z-index:9999;border-bottom:1px solid #e5e7eb;box-shadow:0 4px 12px rgba(0,0,0,0.1)';
    } else {
      nav.style.display = 'none';
    }
  };
  menuBtn.style.cursor = 'pointer';
}

// Products page: filter checkboxes + sort + search + view toggle
function setupProductsPage() {
  if (!location.pathname.includes('snphm')) return;

  function getAllCards() {
    var bestGrid = null, bestCount = 0;
    Array.from(document.querySelectorAll('[class*="grid-cols"]')).forEach(function(g) {
      if (g.className.includes('ait-')) return;
      if (g.closest('nav') || g.closest('header') || g.closest('footer')) return;
      var cnt = Array.from(g.children).filter(function(c){return c.querySelector('h2,h3');}).length;
      if (cnt > bestCount) { bestCount = cnt; bestGrid = g; }
    });
    return bestGrid ? Array.from(bestGrid.children).filter(function(c){return c.querySelector('h2,h3');}) : [];
  }
  var checkboxes = Array.from(document.querySelectorAll('input[type=checkbox]')).filter(function(cb){
    return !cb.className.includes('ait-');
  });

  function applyFilters() {
    var checked = checkboxes.filter(function(cb){ return cb.checked; });
    var cards = getAllCards();
    if (checked.length === 0) {
      cards.forEach(function(c){ c.style.display = ''; });
      return;
    }
    var labels = checked.map(function(cb){
      var lbl = document.querySelector('label[for="'+cb.id+'"]') || cb.parentElement;
      return (lbl ? lbl.textContent : '').trim().toLowerCase().substring(0, 10);
    });
    cards.forEach(function(card) {
      var txt = card.textContent.toLowerCase();
      var show = labels.some(function(l){ return !l || txt.includes(l.substring(0,6)); });
      card.style.display = show ? '' : 'none';
    });
  }

  checkboxes.forEach(function(cb) {
    if (cb.onchange) return;
    cb.onchange = applyFilters;
    cb.style.cursor = 'pointer';
  });

  var sortSelect = document.querySelector('select');
  if (sortSelect && !sortSelect.onchange) {
    sortSelect.onchange = function() {
      var val = this.value.toLowerCase();
      var cards = getAllCards(); var grid = cards.length ? cards[0].parentElement : null;
      if (!grid) return;
      cards = Array.from(grid.children);
      cards.sort(function(a, b) {
        var aT = (a.querySelector('h2,h3') || {}).textContent || '';
        var bT = (b.querySelector('h2,h3') || {}).textContent || '';
        if (val.includes('ten') || val.includes('name') || val.includes('a-z')) return aT.localeCompare(bT);
        if (val.includes('z-a')) return bT.localeCompare(aT);
        return 0;
      });
      cards.forEach(function(c){ grid.appendChild(c); });
    };
    sortSelect.style.cursor = 'pointer';
  }

  document.querySelectorAll('button').forEach(function(btn) {
    var t = btn.textContent.trim();
    if ((t === 'Xóa bộ lọc' || t === 'Clear' || t === 'Reset') && !btn.onclick) {
      btn.onclick = function() {
        checkboxes.forEach(function(cb){ cb.checked = false; });
        getAllCards().forEach(function(c){ c.style.display = ''; });
      };
      btn.style.cursor = 'pointer';
    }
    if (t === 'grid_view' && !btn.onclick) {
      btn.onclick = function() {
        var grid = (function(){var c=getAllCards();return c.length?c[0].parentElement:null;})();
        if (grid) { grid.className = grid.className.replace(/grid-cols-\d+/g, 'grid-cols-3'); }
        btn.style.opacity = '1';
        var listBtn = document.querySelector('button[data-cpview="list"]');
        if (listBtn) listBtn.style.opacity = '0.5';
      };
      btn.setAttribute('data-cpview', 'grid');
      btn.style.cursor = 'pointer';
    }
    if (t === 'view_list' && !btn.onclick) {
      btn.onclick = function() {
        var grid = document.querySelector('(function(){var c=getAllCards();return c.length?c[0].parentElement:null;})()id.className = grid.className.replace(/grid-cols-\d+/g, 'grid-cols-1'); }
        btn.style.opacity = '1';
        var gridBtn = document.querySelector('button[data-cpview="grid"]');
        if (gridBtn) gridBtn.style.opacity = '0.5';
      };
      btn.setAttribute('data-cpview', 'list');
      btn.style.cursor = 'pointer';
    }
    if (t === 'search' && !btn.onclick) {
      btn.onclick = function() {
        var searchEl = document.querySelector('input[type=search], input[placeholder*="Search"]');
        if (searchEl) { searchEl.focus(); searchEl.scrollIntoView({behavior:'smooth', block:'center'}); }
      };
      btn.style.cursor = 'pointer';
    }
    if (t.includes('chevron_left') && !btn.onclick) {
      btn.onclick = function(){ window.scrollBy(-400, 0); };
      btn.style.cursor = 'pointer';
    }
    if (t.includes('chevron_right') && !btn.onclick) {
      btn.onclick = function(){ window.scrollBy(400, 0); };
      btn.style.cursor = 'pointer';
    }
  });
}

// Services/Contact page: form + search
function setupServicesPage() {
  if (!location.pathname.includes('linhbogi')) return;
  var searchInput = document.querySelector('input[placeholder*="Search"], input[type=search]');
  if (searchInput && !searchInput.oninput) {
    searchInput.oninput = function() {
      var q = this.value.toLowerCase();
      document.querySelectorAll('section, article, [class*="service"]').forEach(function(c){
        if (c === document.body) return;
        c.style.display = (!q || c.textContent.toLowerCase().includes(q)) ? '' : 'none';
      });
    };
  }
  document.querySelectorAll('form').forEach(function(form) {
    if (form.onsubmit) return;
    form.onsubmit = function(e) {
      e.preventDefault();
      var msg = document.createElement('div');
      msg.style.cssText = 'position:fixed;top:20px;right:20px;background:#22c55e;color:white;padding:16px 24px;border-radius:8px;z-index:9999;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.3);font-size:16px';
      msg.textContent = '\u2713 Yêu cầu đã gửi thành công! Chúng tôi sẽ liên hệ trong 24h.';
      document.body.appendChild(msg);
      form.reset();
      setTimeout(function() { if(msg.parentNode) msg.parentNode.removeChild(msg); }, 5000);
    };
  });
}

// Project filter logic - v3.1 FIX: text-based category matching
function setupProjectFilters() {
  if (!location.pathname.includes('hsdn')) return;
  var FILTERS = { 'All Projects': 'all', 'Industrial': 'industrial', 'Infrastructure': 'infrastructure', 'Residential': 'residential' };

  function getProjectCards() {
    var section = document.querySelector('section.grid, section[class*="grid"]');
    if (section && section.children.length > 1) return Array.from(section.children);
    return Array.from(document.querySelectorAll('[class*="col-span"]')).filter(function(el){
      return el.textContent.trim().length > 20 && !el.closest('nav') && !el.closest('header') && !el.closest('footer');
    });
  }

  document.querySelectorAll('button').forEach(function(btn) {
    var label = btn.textContent.trim();
    if (!FILTERS[label] || btn.onclick) return;
    btn.onclick = function() {
      var key = FILTERS[label];
      var cards = getProjectCards();
      cards.forEach(function(c) {
        var cat = (c.dataset.category || '').toLowerCase();
        var firstLine = c.textContent.trim().toLowerCase().split('\n')[0].trim();
        c.style.display = (key === 'all' || cat.includes(key) || firstLine.includes(key)) ? '' : 'none';
      });
      document.querySelectorAll('button').forEach(function(b) {
        if (FILTERS[b.textContent.trim()]) { b.style.opacity='0.6'; b.style.fontWeight=''; b.style.background=''; }
      });
      btn.style.opacity = '1';
      btn.style.fontWeight = 'bold';
    };
    btn.style.cursor = 'pointer';
  });
}

// Tin tuc page: pagination chevrons
function setupTinTucPage() {
  if (!location.pathname.includes('chitittint')) return;
  var articles = Array.from(document.querySelectorAll('article, [class*="news"], [class*="post"], [class*="card"]')).filter(function(el){
    return el.textContent.trim().length > 50 && !el.closest('nav') && !el.closest('header') && !el.closest('footer');
  });
  var pageSize = 6;
  var currentPage = 0;
  var totalPages = Math.max(1, Math.ceil(articles.length / pageSize));
  function showPage(p) {
    currentPage = Math.max(0, Math.min(p, totalPages - 1));
    articles.forEach(function(el, i) {
      el.style.display = (i >= currentPage * pageSize && i < (currentPage + 1) * pageSize) ? '' : 'none';
    });
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  if (articles.length > pageSize) showPage(0);
  document.querySelectorAll('button').forEach(function(btn) {
    var t = btn.textContent.trim();
    if (t.includes('chevron_left') && !btn.onclick) {
      btn.onclick = function() { showPage(currentPage - 1); };
      btn.style.cursor = 'pointer';
    }
    if (t.includes('chevron_right') && !btn.onclick) {
      btn.onclick = function() { showPage(currentPage + 1); };
      btn.style.cursor = 'pointer';
    }
  });
}

// Global search handler
function setupSearch() {
  var searchInput = document.querySelector('input[placeholder*="Search"], input[placeholder*="search"], input[type=search]');
  if (!searchInput || searchInput.oninput || searchInput.onkeyup) return;
  searchInput.oninput = function() {
    var q = this.value.toLowerCase();
    var items = document.querySelectorAll('article, [class*="news-item"], [class*="post"], li, [class*="card"]');
    items.forEach(function(item) {
      if (item === document.body || !item.textContent.trim()) return;
      item.style.display = (!q || item.textContent.toLowerCase().includes(q)) ? '' : 'none';
    });
  };
}

function applyFixes() {
  document.querySelectorAll('button').forEach(function(btn) {
    if (btn.onclick || btn.getAttribute('onclick')) return;
    var text = btn.textContent.trim();
    for (var i = 0; i < BTN_MAP.length; i++) {
      var rule = BTN_MAP[i];
      if (rule.re.test(text)) {
        if (rule.fn) {
          (function(fn) { btn.onclick = function() { fn(btn); }; })(rule.fn);
        } else {
          (function(h) { btn.onclick = function() { location.href = h; }; })(rule.href);
        }
        btn.style.cursor = 'pointer';
        break;
      }
    }
  });

  document.querySelectorAll('nav a, header a').forEach(function(a) {
    var t = a.textContent.trim();
    var h = a.getAttribute('href') || '';
    if (t === 'Trang ch\u1ee7' && h === '/trangchconcretepro.html') {
      a.setAttribute('href', '/');
    }
    if (h === '/muemailboconhkconcretepro.html') {
      a.setAttribute('href', QUOTE_PAGE);
    }
  });

  document.querySelectorAll('a[href="#tuyen-dung"]').forEach(function(a) { a.href = CONTACT_PAGE; });
  document.querySelectorAll('a[href="#ban-do"]').forEach(function(a) { a.href = 'https://maps.google.com/?q=Hai+Phong+Vietnam'; a.target = '_blank'; });
  document.querySelectorAll('a[href="#chinh-sach"], a[href="#dieu-khoan"]').forEach(function(a) { a.href = QUOTE_PAGE; });

  setupMobileMenu();
  setupProjectFilters();
  setupProductsPage();
  setupServicesPage();
  setupTinTucPage();
  setupSearch();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyFixes);
} else {
  setTimeout(applyFixes, 200);
}
})();
