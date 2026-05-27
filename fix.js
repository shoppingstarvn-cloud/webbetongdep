/* fix.js - ConcretePro Global Button & Link Fixer */
(function () {
  'use strict';

  var QUOTE_PAGE = '/muemailboconhkconcretepro.html';
  var PRODUCTS_PAGE = '/snphmvtliuxydng.html';
  var CONTACT_PAGE = '/giithiucngty.html';
  var PROJECTS_PAGE = '/hsdn.html';

  // Map of button text patterns → href or function
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
    if (chart) {
      chart.style.display = chart.style.display === 'none' ? 'block' : 'none';
    } else {
      window.open(CONTACT_PAGE, '_self');
    }
  }

  // Project filter logic
  function setupProjectFilters() {
    if (!location.pathname.includes('hsdn')) return;
    var FILTERS = { 'All Projects': 'all', 'Industrial': 'industrial', 'Infrastructure': 'infrastructure', 'Residential': 'residential' };
    Object.keys(FILTERS).forEach(function (label) {
      document.querySelectorAll('button').forEach(function (btn) {
        if (btn.textContent.trim() === label && !btn.onclick) {
          btn.onclick = function () {
            var key = FILTERS[label];
            var cards = document.querySelectorAll('[data-category], article, .project-card');
            cards.forEach(function (c) {
              c.style.display = (key === 'all' || (c.dataset.category || '').toLowerCase() === key) ? '' : 'none';
            });
            // Active state
            document.querySelectorAll('button').forEach(function (b) {
              if (FILTERS[b.textContent.trim()]) b.style.opacity = '0.6';
            });
            btn.style.opacity = '1';
            btn.style.fontWeight = 'bold';
          };
          btn.style.cursor = 'pointer';
        }
      });
    });
  }

  // Products page: fix pagination & filter
  function setupProductsPage() {
    if (!location.pathname.includes('snphm')) return;
    var clearBtn = document.querySelector('button');
    document.querySelectorAll('button').forEach(function (btn) {
      var t = btn.textContent.trim();
      if ((t === 'Xóa bộ lọc' || t === 'search') && !btn.onclick) {
        btn.onclick = function () { location.reload(); };
        btn.style.cursor = 'pointer';
      }
      if ((t === 'chevron_left' || t.includes('chevron_left')) && !btn.onclick) {
        btn.onclick = function () { scrollBy(-400, 0); };
        btn.style.cursor = 'pointer';
      }
      if ((t === 'chevron_right' || t.includes('chevron_right')) && !btn.onclick) {
        btn.onclick = function () { scrollBy(400, 0); };
        btn.style.cursor = 'pointer';
      }
    });
  }

  // Services page: fix form submission
  function setupServicesPage() {
    if (!location.pathname.includes('linhbogi')) return;
    document.querySelectorAll('form').forEach(function (form) {
      if (!form.onsubmit) {
        form.onsubmit = function (e) {
          e.preventDefault();
          var data = {};
          new FormData(form).forEach(function (v, k) { data[k] = v; });
          // Show success
          var msg = document.createElement('div');
          msg.style.cssText = 'position:fixed;top:20px;right:20px;background:#22c55e;color:white;padding:16px 24px;border-radius:8px;z-index:9999;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.3)';
          msg.textContent = '✓ Yêu cầu đã gửi thành công! Chúng tôi sẽ liên hệ trong 24h.';
          document.body.appendChild(msg);
          form.reset();
          setTimeout(function () { msg.remove(); }, 5000);
        };
      }
    });
  }

  // Apply main button fixes
  function applyFixes() {
    document.querySelectorAll('button').forEach(function (btn) {
      if (btn.onclick || btn.getAttribute('onclick')) return;
      var text = btn.textContent.trim();
      for (var i = 0; i < BTN_MAP.length; i++) {
        var rule = BTN_MAP[i];
        if (rule.re.test(text)) {
          if (rule.fn) {
            (function (fn) { btn.onclick = function () { fn(btn); }; })(rule.fn);
          } else {
            (function (h) { btn.onclick = function () { location.href = h; }; })(rule.href);
          }
          btn.style.cursor = 'pointer';
          break;
        }
      }
    });

    // Fix nav "Trang chủ" to point to index
    document.querySelectorAll('nav a, header a').forEach(function (a) {
      if (a.textContent.trim() === 'Trang chủ' && a.getAttribute('href') === '/trangchconcretepro.html') {
        a.setAttribute('href', '/');
      }
    });

    // Fix footer broken anchors
    document.querySelectorAll('a[href="#tuyen-dung"]').forEach(function (a) { a.href = CONTACT_PAGE; });
    document.querySelectorAll('a[href="#ban-do"]').forEach(function (a) { a.href = 'https://maps.google.com/?q=Hai+Phong+Vietnam'; a.target = '_blank'; });
    document.querySelectorAll('a[href="#chinh-sach"], a[href="#dieu-khoan"]').forEach(function (a) { a.href = QUOTE_PAGE; });

    setupProjectFilters();
    setupProductsPage();
    setupServicesPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyFixes);
  } else {
    setTimeout(applyFixes, 200);
  }
})();
