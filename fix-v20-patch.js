/* fix-v20-patch.js
   BUG FIXES for webbetongdep:
   1. _loadHPProjects: wrong status filter (status=eq.active -> no filter, show all projects)
   2. _loadHPNews: create section dynamically if "Tin Tuc" heading not found
*/
(function () {
  'use strict';

  var _SB = 'https://clalkraxfaeqbkeaikow.supabase.co';
  var _K  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsYWxrcmF4ZmFlcWJrZWFpa293Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNjEzOTksImV4cCI6MjA5NDYzNzM5OX0.2EpUXzqLgjc2GUaOzEdvASILX_S_YZ5SJl-a3KYamWk';
  var _IMG_J = 'https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?w=600&q=80';
  var _IMG_N = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80';

  function _q(t, qs) {
    return fetch(_SB + '/rest/v1/' + t + '?select=*' + (qs ? '&' + qs : ''), {
      headers: { apikey: _K, Authorization: 'Bearer ' + _K }
    }).then(function(r) { return r.ok ? r.json() : []; }).catch(function() { return []; });
  }

  function _im(r, fb) { return r.image_url || r.image || r.img || fb; }

  function addFadeStyle() {
    if (document.getElementById('cp-fade-kf')) return;
    var s = document.createElement('style');
    s.id = 'cp-fade-kf';
    s.textContent = '@keyframes sbFade{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}';
    document.head.appendChild(s);
  }

  /* FIX #1: Homepage Projects - remove wrong status=eq.active filter */
  function fixHPProjects() {
    if (document.getElementById('sb-hp-projects-v20')) return;
    _q('projects', 'order=created_at.desc&limit=3').then(function(rows) {
      if (!rows || !rows.length) return;
      addFadeStyle();
      var sec = document.getElementById('sb-hp-projects-v20');
      if (!sec) {
        sec = document.createElement('section');
        sec.id = 'sb-hp-projects-v20';
        sec.style.cssText = 'padding:3.5rem 0;background:#1e293b';
        var footer = document.querySelector('footer');
        if (footer && footer.parentNode) footer.parentNode.insertBefore(sec, footer);
        else document.body.appendChild(sec);
      }
      sec.innerHTML = '<div style="max-width:1280px;margin:0 auto;padding:0 2rem">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;padding-bottom:.6rem;border-bottom:2px solid #ea580c">' +
        '<h2 style="font-size:1.5rem;font-weight:700;color:#fff">Du An Tieu Bieu</h2>' +
        '<a href="/hsdn.html" style="color:#ea580c;font-size:.8rem;font-weight:700;text-transform:uppercase;text-decoration:none">Xem tat ca ></a>' +
        '</div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem">' +
        rows.map(function(p) {
          var img = _im(p, _IMG_J);
          var meta = [p.location, p.year].filter(Boolean).join(' · ');
          return '<div style="position:relative;border-radius:14px;overflow:hidden;height:270px;cursor:pointer;transition:transform .25s,box-shadow .25s;animation:sbFade .5s ease" onclick="location.href='/hsdn.html'" onmouseenter="this.style.transform='scale(1.03)'" onmouseleave="this.style.transform=''">' +
            '<img src="' + img + '" alt="' + p.name + '" style="width:100%;height:100%;object-fit:cover" onerror="this.src='' + _IMG_J + ''">' +
            '<div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.82),rgba(0,0,0,.05))"></div>' +
            '<div style="position:absolute;top:12px;left:12px"><span style="background:#ea580c;color:#fff;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px">' + (p.category || 'Du an') + '</span></div>' +
            '<div style="position:absolute;bottom:0;left:0;right:0;padding:18px"><h3 style="color:#fff;font-weight:700;font-size:1rem;margin-bottom:4px">' + p.name + '</h3>' +
            (meta ? '<p style="color:#cbd5e1;font-size:12px">' + meta + '</p>' : '') + '</div></div>';
        }).join('') + '</div>' +
        '<div style="text-align:center;margin-top:2rem"><a href="/hsdn.html" style="display:inline-block;background:#ea580c;color:#fff;font-weight:600;padding:.75rem 2rem;border-radius:8px;text-decoration:none">Xem Tat Ca Du An ></a></div></div>';
    });
  }

  /* FIX #2: Homepage News - create section dynamically */
  function fixHPNews() {
    if (document.getElementById('sb-hp-news-v20')) return;
    _q('news', 'order=created_at.desc&limit=3').then(function(rows) {
      if (!rows || !rows.length) return;
      addFadeStyle();
      var sec = document.getElementById('sb-hp-news-v20');
      if (!sec) {
        sec = document.createElement('section');
        sec.id = 'sb-hp-news-v20';
        sec.style.cssText = 'padding:3.5rem 0;background:#f8fafc;border-top:1px solid #e2e8f0';
        var footer = document.querySelector('footer');
        if (footer && footer.parentNode) footer.parentNode.insertBefore(sec, footer);
        else document.body.appendChild(sec);
      }
      sec.innerHTML = '<div style="max-width:1280px;margin:0 auto;padding:0 2rem">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;padding-bottom:.6rem;border-bottom:2px solid #041627">' +
        '<h2 style="font-size:1.5rem;font-weight:700;color:#041627">Tin Tuc Moi Nhat</h2>' +
        '<a href="/chitittintcgiiphpbtngxanh.html" style="color:#ea580c;font-size:.8rem;font-weight:700;text-transform:uppercase;text-decoration:none">Xem tat ca ></a>' +
        '</div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem">' +
        rows.map(function(a) {
          var img = _im(a, _IMG_N);
          var dt = a.created_at ? new Date(a.created_at).toLocaleDateString('vi-VN') : '';
          return '<article style="background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);cursor:pointer;transition:transform .25s;animation:sbFade .5s ease" onclick="location.href='/chitittintcgiiphpbtngxanh.html'" onmouseenter="this.style.transform='translateY(-5px)'" onmouseleave="this.style.transform=''">' +
            '<div style="height:200px;overflow:hidden"><img src="' + img + '" alt="' + a.title + '" style="width:100%;height:100%;object-fit:cover" onerror="this.src='' + _IMG_N + ''"></div>' +
            '<div style="padding:16px"><div style="display:flex;gap:8px;margin-bottom:8px"><span style="background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:600;padding:3px 8px;border-radius:20px">' + (a.category || 'Tin tuc') + '</span>' +
            (dt ? '<span style="font-size:11px;color:#94a3b8">' + dt + '</span>' : '') + '</div>' +
            '<h3 style="font-weight:700;font-size:.95rem;color:#041627;margin-bottom:6px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + a.title + '</h3>' +
            '<p style="font-size:12px;color:#64748b;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">' + (a.excerpt || a.content || '').substring(0, 120) + '</p>' +
            '<div style="margin-top:10px;color:#ea580c;font-size:12px;font-weight:600">Doc them ></div></div></article>';
        }).join('') + '</div>' +
        '<div style="text-align:center;margin-top:2rem"><a href="/chitittintcgiiphpbtngxanh.html" style="display:inline-block;background:#ea580c;color:#fff;font-weight:600;padding:.75rem 2rem;border-radius:8px;text-decoration:none">Xem Tat Ca Tin Tuc ></a></div></div>';
    });
  }

  function runPatches() {
    var p = location.pathname;
    var isHome = (p === '/' || p.includes('index') || p.includes('trangch'));
    if (!isHome) return;
    setTimeout(fixHPProjects, 1200);
    setTimeout(fixHPNews,     1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(runPatches, 200); });
  } else {
    setTimeout(runPatches, 200);
  }
})();
