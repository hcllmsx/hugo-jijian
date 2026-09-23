/* pan 短代码：提取码复制 + 选项卡切换 */
(function () {
  var OK_ICON = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  function doCopy(btn) {
    var text = btn.getAttribute('data-copy') || '';
    if (!text || btn.dataset.copied) return;
    var isIconBtn = btn.classList.contains('pan-copy');
    var html = isIconBtn ? btn.innerHTML : null;
    var done = function () {
      btn.dataset.copied = '1';
      btn.classList.add('is-copied');
      if (isIconBtn) btn.innerHTML = OK_ICON;
      setTimeout(function () {
        if (isIconBtn) btn.innerHTML = html;
        btn.classList.remove('is-copied');
        delete btn.dataset.copied;
      }, 1500);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }

  function selectTab(tab) {
    var tabs = tab.closest('.pan-tabs');
    var card = tabs && tabs.closest('.pan-card--tabs');
    if (!card) return;
    tabs.querySelectorAll('.pan-tab').forEach(function (t) {
      var active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      t.setAttribute('tabindex', active ? '0' : '-1');
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !active;
    });
  }

  document.addEventListener('click', function (e) {
    var copyBtn = e.target.closest('.pan-copy, .pan-pwd');
    if (copyBtn) {
      doCopy(copyBtn);
      return;
    }
    var tab = e.target.closest('.pan-tab');
    if (tab) selectTab(tab);
  });

  /* 选项卡键盘左右方向键切换 */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var tab = e.target.closest && e.target.closest('.pan-tab');
    if (!tab) return;
    var list = Array.prototype.slice.call(tab.closest('.pan-tabs').querySelectorAll('.pan-tab'));
    var i = list.indexOf(tab);
    var step = e.key === 'ArrowRight' ? 1 : list.length - 1;
    var next = list[(i + step) % list.length];
    next.focus();
    selectTab(next);
    e.preventDefault();
  });

  /* 初始化：依据面板动态构建标签栏并激活每组第一个标签 */
  document.querySelectorAll('.pan-card--tabs').forEach(function (card) {
    var tabsEl = card.querySelector('.pan-tabs');
    if (!tabsEl) return;
    var panels = card.querySelectorAll('.pan-panel');
    tabsEl.textContent = '';
    panels.forEach(function (panel, i) {
      var iconSrc = panel.querySelector('.pan-tab-src');
      var icon = iconSrc ? iconSrc.innerHTML : '';
      var label = panel.getAttribute('data-provider') || '网盘 ' + (i + 1);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pan-tab';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('aria-controls', panel.id);
      btn.tabIndex = -1;
      btn.innerHTML = icon;
      var span = document.createElement('span');
      span.textContent = label;
      btn.appendChild(span);
      tabsEl.appendChild(btn);
    });
    var first = tabsEl.querySelector('.pan-tab');
    if (first) selectTab(first);
  });
})();
