/* fix.js v2 - ConcretePro Global Button, Link & Module Fixer */
(function () {
'use strict';

var QUOTE_PAGE = '/linhbogi.html';
var PRODUCTS_PAGE = '/snphmvtliuxydng.html';
var CONTACT_PAGE = '/giithiucngty.html';
var PROJECTS_PAGE = '/hsdn.html';

var BTN_MAP = [
{ re: /Yêu cầu báo giá|Get a Quote|Liên hệ Kỹ sư|Request Technical Specs|Schedule Consultation|Consult an Engineer|Yêu Cầu Báo Giá/i, href: QUOTE_PAGE },
{ re: /Khám Phá Giải Pháp|Khám phá giải pháp/i, href: PRODUCTS_PAGE },
{ re: /Xem Video Năng Lực|Xem video|Watch Video/i, fn: function () { window.open('https://www.youtube.com/results?search_query=beton+concretepro+viet+nam', '_blank'); } },
{ re: /Download Technical Brochure|Tải Brochure|Download Brochure/i, fn: function () { window.open(QUOTE_PAGE, '_self'); } },
{ re: /View Interactive Map|Xem bản đồ/i, fn: function () { window.open('https://maps.google.com/?q=Hai+Phong+Vietnam+concrete', '_blank'); } },
{ re: /View Full Org Chart|Xem Sơ đồ/i, fn: function (btn) { toggleOrgChart(btn); } },
{ re: /Liên hệ$/i, href: CONTACT_PAGE },
{ re: /Chi tiết|arrow_forward/i, fn: function (btn) { location.href = PRODUCTS_PAGE; } },
];

function toggleOrgChart(btn) {
  var chart = document.getElementById('org-chart') || document.querySelector('[data-org-chart]');
  if (chart) { chart.style.display = chart.style.display === 'none' ? 'block' : 'none'; }
  else { window.open(CONTACT_PAGE, '_self'); }
}

function setupMobileMenu() {
  var menuBtns = Array.from(document.querySelectorAll('header button'));
  var menuBtn = menuBtns.find(function(b){ return b.className.includes('hidden') || b.textContent.trim() === 'menu' || (b.offsetWidth < 60 && b.offsetHeight < 60); });
  if (!menuBtn || menuBtn.onclick) return;
  var nav = document.querySelector('header nav');
  if (!nav) return;
  menuBtn.onclick = function () {
    var hidden = !nav.style.display || nav.style.display === 'none';
    if (hidden) {
      nav.style.cssText = 'display:flex !important;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:#fff;padding:16px 24px;gap:12px;z-index:9999;border-bottom:1px solid #e5e7eb;box-shadow:0 4px 12px rgba(0,0,0,0.1)';
    } else { nav.style.display = 'none'; }
  };
  menuBtn.style.cursor = 'pointer';
}

function setupProductsPage() {
  if (!location.pathname.includes('snphm')) return;
  function getAllCards() {
    return Array.from(document.querySelectorAll('[class*="col"], article, [class*="product"]')).filter(function(el){ return el.querySelector('h2,h3'); });
  }
  var checkboxes = Array.from(document.querySelectorAll('input[type=checkbox]'));
  function applyFilters() {
    var checked = checkboxes.filter(function(cb){ return cb.checked; });
    var cards = getAllCards();
    if (checked.length === 0) { cards.forEach(function(c){ c.style.display = ''; }); return; }
    var labels = checked.map(function(cb){ var lbl = document.querySelector('label[for="'+cb.id+'"]') || cb.parentElement; return (lbl ? lbl.textContent : '').trim().toLowerCase(); });
    cards.forEach(function(card) { var txt = card.textContent.toLowerCase(); card.style.display = labels.some(function(l){ return !l || txt.includes(l.substring(0,6)); }) ? '' : 'none'; });
  }
  checkboxes.forEach(function(cb){ if(!cb.onchange){ cb.onchange = applyFilters; cb.style.cursor='pointer'; } });
  var sortSelect = document.querySelector('select');
  if (sortSelect && !sortSelect.onchange) {
    sortSelect.onchange = function() {
      var val = this.value.toLowerCase();
      var grid = document.querySelector('.grid,[class*="grid"]');
      if (!grid) return;
      var cards = Array.from(grid.children);
      cards.sort(function(a,b){ var aT=(a.querySelector('h2,h3')||{}).textContent||''; var bT=(b.querySelector('h2,h3')||{}).textContent||''; return val.includes('z-a') ? bT.localeCompare(aT) : aT.localeCompare(bT); });
      cards.forEach(function(c){ grid.appendChild(c); });
    };
    sortSelect.style.cursor = 'pointer';
  }
  document.querySelectorAll('button').forEach(function(btn) {
    var t = btn.textContent.trim();
    if ((t==='Xóa bộ lọc'||t==='Clear'||t==='Reset') && !btn.onclick) { btn.onclick=function(){ checkboxes.forEach(function(cb){cb.checked=false;}); getAllCards().forEach(function(c){c.style.display='';}); }; btn.style.cursor='pointer'; }
    if (t.includes('chevron_left') && !btn.onclick) { btn.onclick=function(){window.scrollBy(-400,0);}; btn.style.cursor='pointer'; }
    if (t.includes('chevron_right') && !btn.onclick) { btn.onclick=function(){window.scrollBy(400,0);}; btn.style.cursor='pointer'; }
  });
}

function setupServicesPage() {
  if (!location.pathname.includes('linhbogi')) return;
  var si = document.querySelector('input[placeholder*="Search"],input[type=search]');
  if (si && !si.oninput) { si.oninput = function(){ var q=this.value.toLowerCase(); document.querySelectorAll('section,article,[class*="service"]').forEach(function(c){ if(c!==document.body) c.style.display=(!q||c.textContent.toLowerCase().includes(q))?'':'none'; }); }; }
  document.querySelectorAll('form').forEach(function(form) {
    if (form.onsubmit) return;
    form.onsubmit = function(e) {
      e.preventDefault();
      var msg = document.createElement('div');
      msg.style.cssText = 'position:fixed;top:20px;right:20px;background:#22c55e;color:white;padding:16px 24px;border-radius:8px;z-index:9999;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.3);font-size:16px';
      msg.textContent = '✓ Yêu cầu đã gửi thành công! Chúng tôi sẽ liên hệ trong 24h.';
      document.body.appendChild(msg); form.reset();
      setTimeout(function(){ if(msg.parentNode) msg.parentNode.removeChild(msg); }, 5000);
    };
  });
}

function setupProjectFilters() {
  if (!location.pathname.includes('hsdn')) return;
  var FILTERS = {'All Projects':'all','Industrial':'industrial','Infrastructure':'infrastructure','Residential':'residential'};
  document.querySelectorAll('button').forEach(function(btn) {
    var label = btn.textContent.trim();
    if (!FILTERS[label] || btn.onclick) return;
    btn.onclick = function() {
      var key = FILTERS[label];
      document.querySelectorAll('[data-category],article,[class*="project"]').forEach(function(c){ var cat=(c.dataset.category||c.className||'').toLowerCase(); c.style.display=(key==='all'||cat.includes(key))?'':'none'; });
      document.querySelectorAll('button').forEach(function(b){ if(FILTERS[b.textContent.trim()]){b.style.opacity='0.6';b.style.fontWeight='';} });
      btn.style.opacity='1'; btn.style.fontWeight='bold';
    };
    btn.style.cursor = 'pointer';
  });
}

function setupSearch() {
  var si = document.querySelector('input[placeholder*="Search"],input[placeholder*="search"],input[type=search]');
  if (!si || si.oninput || si.onkeyup) return;
  si.oninput = function() {
    var q = this.value.toLowerCase();
    document.querySelectorAll('article,[class*="news"],[class*="post"],li,[class*="card"]').forEach(function(item){
      if(item===document.body||!item.textContent.trim()) return;
      item.style.display=(!q||item.textContent.toLowerCase().includes(q))?'':'none';
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
        if (rule.fn) { (function(fn){ btn.onclick=function(){fn(btn);}; })(rule.fn); }
        else { (function(h){ btn.onclick=function(){location.href=h;}; })(rule.href); }
        btn.style.cursor = 'pointer'; break;
      }
    }
  });
  document.querySelectorAll('nav a,header a').forEach(function(a){ if(a.textContent.trim()==='Trang chủ'&&a.getAttribute('href')==='/trangchconcretepro.html') a.setAttribute('href','/'); });
  document.querySelectorAll('a[href="#tuyen-dung"]').forEach(function(a){ a.href=CONTACT_PAGE; });
  document.querySelectorAll('a[href="#ban-do"]').forEach(function(a){ a.href='https://maps.google.com/?q=Hai+Phong+Vietnam'; a.target='_blank'; });
  document.querySelectorAll('a[href="#chinh-sach"],a[href="#dieu-khoan"]').forEach(function(a){ a.href=QUOTE_PAGE; });
  setupMobileMenu(); setupProjectFilters(); setupProductsPage(); setupServicesPage(); setupSearch();
}

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', applyFixes); }
else { setTimeout(applyFixes, 200); }
})();
