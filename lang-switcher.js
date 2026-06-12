(function () {
  var btn = document.querySelector('.lang-btn');
  if (!btn) return;

  var path = window.location.pathname;
  if (!path.endsWith('/')) path += '/';

  var langs = ['de', 'it', 'es'];
  var currentLang = 'en';
  var basePath = path;

  langs.forEach(function (l) {
    if (path.startsWith('/' + l + '/')) {
      currentLang = l;
      basePath = path.replace('/' + l + '/', '/');
    }
  });

  // Pages that exist in all 4 language versions
  var multilingualPaths = [
    '/',
    '/casinos/',
    '/casinos/dragonslots/',
    '/casinos/robocat/',
    '/casinos/slotrave/',
    '/casinos/sgcasino/',
    '/casinos/legiano/',
    '/casinos/dragonia/',
    '/casinos/granawin/',
    '/bonus/',
    '/free-spins/',
    '/how-to-play/',
    '/strategy/',
    '/rtp/',
    '/mobile/',
    '/real-money/',
  ];

  // If current page has no language version, switch to homepage of that language
  var targetPath = multilingualPaths.indexOf(basePath) !== -1 ? basePath : '/';

  var meta = {
    en: { label: 'EN', flag: '&#127468;&#127463;' },  // 🇬🇧
    de: { label: 'DE', flag: '&#127465;&#127466;' },  // 🇩🇪
    it: { label: 'IT', flag: '&#127470;&#127481;' },  // 🇮🇹
    es: { label: 'ES', flag: '&#127466;&#127480;' }   // 🇪🇸
  };

  var cur = meta[currentLang];
  btn.innerHTML = cur.label + ' &nbsp;' + cur.flag + ' <span class="lang-arrow">&#9660;</span>';

  var wrapper = document.createElement('div');
  wrapper.className = 'lang-switcher';
  btn.parentNode.insertBefore(wrapper, btn);
  wrapper.appendChild(btn);

  var menu = document.createElement('div');
  menu.className = 'lang-menu';

  ['en', 'de', 'it', 'es'].forEach(function (code) {
    if (code === currentLang) return;
    var m = meta[code];
    var a = document.createElement('a');
    a.href = code === 'en' ? targetPath : ('/' + code + targetPath);
    a.className = 'lang-option';
    a.innerHTML = m.label + ' &nbsp;' + m.flag;
    menu.appendChild(a);
  });

  wrapper.appendChild(menu);

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    wrapper.classList.toggle('open');
  });

  document.addEventListener('click', function () {
    wrapper.classList.remove('open');
  });
})();
