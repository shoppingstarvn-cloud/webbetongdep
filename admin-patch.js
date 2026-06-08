/* admin-patch.js - Thêm nút upload ảnh cho Products, News, Projects
   Inject sau khi DOM load, tự động watch MutationObserver khi modal mở
*/
(function () {
  'use strict';
  var SB_URL = 'https://clalkraxfaeqbkeaikow.supabase.co';
  var BUCKET = 'slides';

  async function uploadToStorage(file) {
    var sb = window.supabase;
    var ext = file.name.split('.').pop().toLowerCase() || 'jpg';
    var path = 'content/' + Date.now() + '_' + Math.random().toString(36).substr(2,6) + '.' + ext;
    if (sb && sb.storage) {
      var result = await sb.storage.from(BUCKET).upload(path, file, {upsert:true});
      if (result.error) throw new Error(result.error.message);
      var pub = sb.storage.from(BUCKET).getPublicUrl(path);
      return pub.data ? pub.data.publicUrl : (SB_URL+'/storage/v1/object/public/'+BUCKET+'/'+path);
    }
    throw new Error('Supabase client not found');
  }

  function patchOneInput(input) {
    if (input.dataset.imgPatched) return;
    input.dataset.imgPatched = '1';
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;gap:8px;align-items:center;width:100%';
    input.parentNode.insertBefore(wrap, input);
    input.style.flex = '1';
    wrap.appendChild(input);
    var preview = document.createElement('img');
    preview.style.cssText = 'width:56px;height:44px;object-fit:cover;border-radius:6px;border:1px solid #334155;display:'+(input.value?'block':'none');
    if (input.value) preview.src = input.value;
    wrap.appendChild(preview);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '📁 Upload';
    btn.style.cssText = 'background:#ea580c;color:#fff;border:none;cursor:pointer;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:600;white-space:nowrap';
    wrap.appendChild(btn);
    input.addEventListener('input', function() {
      if (input.value && input.value.startsWith('http')) { preview.src = input.value; preview.style.display = 'block'; }
      else preview.style.display = 'none';
    });
    var fi = document.createElement('input');
    fi.type = 'file'; fi.accept = 'image/*'; fi.style.display = 'none';
    document.body.appendChild(fi);
    btn.onclick = function() { fi.click(); };
    fi.onchange = async function() {
      var file = fi.files[0]; if (!file) return;
      btn.textContent = '⏳ Đang tải…'; btn.disabled = true;
      try {
        var url = await uploadToStorage(file);
        input.value = url;
        input.dispatchEvent(new Event('input', {bubbles:true}));
        preview.src = url; preview.style.display = 'block';
        btn.textContent = '✅ Xong!';
        setTimeout(function() { btn.textContent = '📁 Upload'; btn.disabled = false; }, 1800);
      } catch(e) {
        btn.textContent = '❌ Lỗi';
        alert('Lỗi upload: '+e.message+'\n\nHãy paste URL ảnh thủ công.');
        setTimeout(function() { btn.textContent = '📁 Upload'; btn.disabled = false; }, 2500);
      }
      fi.value = '';
    };
  }

  function scanAndPatch() {
    document.querySelectorAll('label').forEach(function(lbl) {
      var t = (lbl.textContent||'').trim().toLowerCase();
      if (t.includes('url ảnh') || t.includes('url anh') || (t.includes('ảnh') && t.length < 20)) {
        var inp = null;
        var fid = lbl.getAttribute('for');
        if (fid) inp = document.getElementById(fid);
        if (!inp) { var s = lbl.nextElementSibling; while(s) { if(s.tagName==='INPUT'&&s.type==='text'){inp=s;break;} s=s.nextElementSibling; } }
        if (inp) patchOneInput(inp);
      }
    });
    document.querySelectorAll('input[type=text]').forEach(function(inp) {
      var nm = (inp.name||inp.id||inp.placeholder||'').toLowerCase();
      if (nm === 'image' || nm.includes('image') || nm.includes('ảnh')) patchOneInput(inp);
    });
  }

  var observer = new MutationObserver(function(ms) {
    ms.forEach(function(m) { if(m.addedNodes.length) setTimeout(scanAndPatch, 100); });
  });

  function init() {
    observer.observe(document.body, {childList:true, subtree:true});
    scanAndPatch();
    setTimeout(scanAndPatch, 1000);
    setTimeout(scanAndPatch, 3000);
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
