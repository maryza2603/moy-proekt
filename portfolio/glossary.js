/* Подсказки к непонятным словам: наведи мышку (или нажми на телефоне) на слово с пунктиром.
   Один файл для index.html и raboty.html. Слова и пояснения - в списке TERMS ниже. */
(function () {
  'use strict';

  var L = '(?<![\\p{L}\\p{N}-])';        // слева не буква
  var R = '(?![\\p{L}\\p{N}])';           // справа не буква
  var TERMS = [
    { id: 'tilda', re: '(?:Tilda|Тильд[аыеуой]|Тильде)', t: 'Конструктор сайтов: страницы собирают из готовых блоков, без программирования. Удобно самим менять тексты и фото.' },
    { id: 'kwork', re: '(?:Kwork|Кворк[а-я]*)', t: 'Российская биржа фриланса: заказчик выбирает исполнителя, а оплата идёт через сайт биржи.' },
    { id: 'lending', re: 'Лендинг[а-я]*', t: 'Одностраничный сайт с одной целью: например, записать на услугу или продать товар.' },
    { id: 'hosting', re: 'хостинг[а-я]*', t: 'Место в интернете, где хранятся файлы сайта. За него платят раз в месяц или в год.' },
    { id: 'domain', re: 'домен[а-я]*', t: 'Адрес сайта, например mysite.ru. Его покупают на год и продлевают.' },
    { id: 'metrika', re: '(?:Яндекс\\.Метрик[аиеу]|Метрик[аиеу])', t: 'Сервис Яндекса: показывает, сколько людей зашло на сайт и что они смотрели.' },
    { id: 'b2b', re: 'B2B', t: 'Работа с компаниями, а не с обычными покупателями.' },
    { id: 'konfig', re: 'конфигуратор[а-я]*', t: 'Страница, где человек сам выбирает параметры товара и сразу видит цену.' },
    { id: 'adaptiv', re: 'адаптив[а-я]*', t: 'Сайт сам подстраивается под экран: телефон, планшет или компьютер.' },
    { id: 'srt', re: 'SRT', t: 'Файл с субтитрами и временем, когда каждая фраза появляется на экране.' },
    { id: 'smm', re: 'SMM', t: 'Ведение страниц компании в соцсетях: посты, оформление, ответы.' },
    { id: 'apk', re: 'APK', t: 'Установочный файл приложения для телефонов на Android.' },
    { id: 'wb', re: '(?:WB|Wildberries)', t: 'Wildberries - один из крупнейших маркетплейсов, где продавцы размещают карточки товаров.' },
    { id: 'ozon', re: 'Ozon', t: 'Крупный маркетплейс: продавцы размещают там карточки товаров.' },
    { id: 'kp', re: 'КП', t: 'Коммерческое предложение: цена и условия для компании.' },
    { id: 't123', re: 'T123', t: 'Блок в Tilda для вставки готового кода.' },
    { id: 'gsheet', re: 'Google-таблиц[а-я]*', t: 'Онлайн-таблица Google. В ней вы сами меняете цены, а на сайте они обновляются.' },
    { id: 'tgbot', re: 'Telegram-бот[а-я]*', t: 'Программа внутри Telegram: сама отвечает людям и принимает заявки.' },
    { id: 'maket', re: '[Мм]акет[а-я]*', t: 'Рисунок будущего сайта или картинки до того, как их собрали по-настоящему.' },
    { id: 'verstka', re: '[Вв]ёрстк[а-я]*', t: 'Сборка сайта по макету: из рисунка получается рабочая страница.' },
    { id: 'figma', re: '(?:Figma|Фигм[аыеу])', t: 'Программа для рисования дизайна сайтов и приложений: в ней готовят макеты до сборки.' },
    { id: 'html', re: 'HTML(?:\\s*/\\s*CSS\\s*/\\s*JS)?', t: 'Языки, на которых пишут сайты: HTML - структура страницы, CSS - оформление, JS - движение и кнопки.' },
    { id: 'python', re: 'Python', t: 'Язык программирования: на нём делают программы для компьютера и автоматизацию.' },
    { id: 'android', re: 'Android', t: 'Операционная система большинства смартфонов. Приложения для неё устанавливаются файлом APK.' },
    { id: 'photoshop', re: 'Photoshop', t: 'Программа для обработки и ретуши фотографий и картинок.' },
    { id: 'ai', re: 'AI-инструмент[а-я]*', t: 'Нейросети и программы-помощники: помогают быстрее делать черновики, картинки и код. Результат проверяю и дорабатываю.' },
    { id: 'max', re: 'MAX', t: 'Российский мессенджер MAX: как Telegram, в нём можно принимать сообщения и заявки.' },
    { id: 'kbzhu', re: 'КБЖУ', t: 'Калории, белки, жиры и углеводы в блюде или рационе.' },
    { id: 'quiz', re: '[Кк]виз[а-я-]*(?:\\s+[а-я]+)?', t: 'Короткий опрос из нескольких вопросов: по ответам сайт сам подбирает подходящий вариант.' },
    { id: 'layers', re: 'калькулятор[а-я]*\\s+со\\s+слоями', t: 'Картинка товара собирается из слоёв: каждый ваш выбор меняет свой слой, а цена пересчитывается сразу.' },
    { id: 'timecode', re: 'таймкод[а-я]*', t: 'Отметки времени в тексте: по ним видно, в какой минуте записи что говорилось.' },
    { id: 'wordpress', re: '(?:WordPress|Вордпресс[а-я]*)', t: 'Популярная система для сайтов: тексты и фото можно менять через панель управления, без программиста.' },
    { id: 'bitrix', re: 'Битрикс[а-я]*', t: 'Российская система для сайтов и интернет-магазинов, на ней работают многие компании.' },
  ];
  TERMS.forEach(function (x) { x.rx = new RegExp(L + '(' + x.re + ')' + R, 'u'); });

  var SKIP = /^(A|BUTTON|H1|H2|H3|H4|SCRIPT|STYLE|NOSCRIPT|TEXTAREA|INPUT|SELECT|OPTION|LABEL|SVG|CODE|PRE|TITLE|NAV|FOOTER|HEAD)$/;
  var SCOPE = '.tag,.card,.svc,.pr,.rev,section,main,body';

  var css = '.gl{border-bottom:1.5px dotted var(--terra,#c8643f);cursor:help}' +
    '.gl:focus-visible{outline:2px solid var(--terra,#c8643f);outline-offset:2px;border-radius:3px}' +
    '.gl-tip{position:fixed;z-index:9999;max-width:min(290px,calc(100vw - 24px));padding:10px 13px;border-radius:10px;' +
    'background:var(--ink,#241f1c);color:#fff;font-size:14px;line-height:1.4;font-weight:500;box-shadow:0 8px 24px rgba(0,0,0,.22);' +
    'opacity:0;pointer-events:none;transition:opacity .15s}.gl-tip.on{opacity:1}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var tip = document.createElement('div');
  tip.className = 'gl-tip'; tip.setAttribute('role', 'tooltip'); tip.id = 'gl-tip';
  var cur = null;
  function show(el) {
    cur = el; y0 = window.scrollY; tip.textContent = el.getAttribute('data-gl'); tip.classList.add('on');
    el.setAttribute('aria-describedby', 'gl-tip');
    var r = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight, m = 8;
    var x = Math.min(Math.max(m, r.left + r.width / 2 - tw / 2), window.innerWidth - tw - m);
    var y = r.top - th - 10; if (y < m) y = r.bottom + 10;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }
  function hide() { if (cur) cur.removeAttribute('aria-describedby'); cur = null; tip.classList.remove('on'); }
  var canHover = window.matchMedia && window.matchMedia('(hover:hover)').matches;

  document.addEventListener('mouseover', function (e) { var g = canHover && e.target.closest && e.target.closest('.gl'); if (g) show(g); });
  document.addEventListener('mouseout', function (e) { var g = e.target.closest && e.target.closest('.gl'); if (g && cur === g) hide(); });
  document.addEventListener('focusin', function (e) { var g = e.target.closest && e.target.closest('.gl'); if (g && kbd) show(g); });
  document.addEventListener('focusout', function (e) { if (e.target.closest && e.target.closest('.gl')) hide(); });
  document.addEventListener('click', function (e) {
    var g = e.target.closest && e.target.closest('.gl');
    if (g) { e.preventDefault(); e.stopPropagation(); if (cur === g && touch) hide(); else show(g); } else hide();
  }, true);
  var kbd = false;
  document.addEventListener('keydown', function (e) { kbd = e.key === 'Tab'; if (e.key === 'Escape') hide(); });
  var touch = false;
  document.addEventListener('pointerdown', function (e) { kbd = false; touch = e.pointerType === 'touch'; }, true);
  var y0 = 0;
  window.addEventListener('scroll', function () { if (cur && Math.abs(window.scrollY - y0) > 40) hide(); }, { passive: true });
  window.addEventListener('resize', hide);

  function done(scope) { return scope.getAttribute('data-gl-done') || ''; }
  function process(node) {
    var par = node.parentElement;
    if (!par || par.closest('.gl,.gl-tip,[data-nogl]')) return;
    for (var p = par; p && p.nodeType === 1; p = p.parentElement) { if (SKIP.test(p.tagName.toUpperCase())) return; }
    var scope = par.closest(SCOPE) || document.body;
    for (;;) {
      var txt = node.nodeValue, best = null;
      for (var i = 0; i < TERMS.length; i++) {
        var T = TERMS[i];
        if (done(scope).indexOf(',' + T.id + ',') >= 0) continue;
        var m = T.rx.exec(txt);
        if (m && (!best || m.index < best.m.index)) best = { T: T, m: m };
      }
      if (!best) return;
      var s = best.m.index, w = best.m[1];
      var after = node.splitText(s + w.length), mid = node.splitText(s);
      var sp = document.createElement('span');
      sp.className = 'gl'; sp.tabIndex = 0; sp.setAttribute('data-gl', best.T.t);
      mid.parentNode.replaceChild(sp, mid); sp.appendChild(mid);
      scope.setAttribute('data-gl-done', done(scope) + (done(scope) ? '' : ',') + best.T.id + ',');
      node = after;
    }
  }

  var busy = false;
  function scan() {
    if (busy) return; busy = true;
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), list = [], n;
    while ((n = w.nextNode())) { if (n.nodeValue.trim().length > 2) list.push(n); }
    list.forEach(process);
    busy = false;
  }

  function start() {
    document.body.appendChild(tip);
    scan();
    var t = null;
    new MutationObserver(function () { clearTimeout(t); t = setTimeout(scan, 150); })
      .observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
