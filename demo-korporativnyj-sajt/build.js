// Собирает страницы из общей обёртки. Запуск: node build.js
const fs = require('fs');
const wrap = (title, desc, page, body) => `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><meta name="description" content="${desc}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=Unbounded:wght@500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css"></head>
<body data-page="${page}"><main id="main">
${body}
</main>
<script src="js/config.js"></script><script src="js/posts.js"></script><script src="js/main.js"></script>
</body></html>
`;
const pages = {};

pages['index.html'] = wrap('Магистраль - грузоперевозки и склад для бизнеса', 'Перевозки по России, ответственное хранение и доставка до двери. Рассчитаем стоимость за 30 минут.', 'home', `
<section class="hero"><div class="wrap">
  <div>
    <h1>Довезём груз <em>в срок</em> и с документами</h1>
    <p class="lead">Перевозки по России для бизнеса: от одной паллеты до полной фуры. Фиксируем цену в договоре и отвечаем за груз до подписи получателя.</p>
    <div class="acts"><a class="btn" href="zayavka.html">Рассчитать перевозку</a><a class="btn ghost" href="uslugi.html">Все услуги</a></div>
  </div>
  <svg class="route" viewBox="0 0 520 380" role="img" aria-label="Схема маршрута Москва, Казань, Екатеринбург, Новосибирск">
    <g><line class="grid" x1="0" y1="95" x2="520" y2="95"/><line class="grid" x1="0" y1="190" x2="520" y2="190"/><line class="grid" x1="0" y1="285" x2="520" y2="285"/><line class="grid" x1="130" y1="0" x2="130" y2="380"/><line class="grid" x1="260" y1="0" x2="260" y2="380"/><line class="grid" x1="390" y1="0" x2="390" y2="380"/></g>
    <path class="path" d="M50 300 C 130 300, 150 215, 220 215 S 330 120, 400 130 S 450 70, 480 60"/>
    <g><circle class="pt" cx="50" cy="300" r="9"/><text x="64" y="330">Москва</text></g>
    <g><circle class="pt" cx="220" cy="215" r="9"/><text x="234" y="248">Казань</text></g>
    <g><circle class="pt" cx="400" cy="130" r="9"/><text x="300" y="112">Екатеринбург</text></g>
    <g><circle class="pt" cx="480" cy="60" r="9"/><text x="395" y="40">Новосибирск</text></g>
  </svg>
</div>
<div class="wrap hero-facts">
  <div><b>12 лет</b><span>возим грузы по России</span></div>
  <div><b>140</b><span>собственных и партнёрских машин</span></div>
  <div><b>98%</b><span>рейсов приходят в срок</span></div>
  <div><b>30 минут</b><span>на расчёт стоимости</span></div>
</div></section>
<div class="dash"></div>

<section class="s"><div class="wrap">
  <h2>Что мы делаем</h2>
  <p class="sub">Три направления, которые закрывают путь груза от склада отправителя до двери получателя.</p>
  <div class="svc">
    <div class="svc-row"><h3>Перевозки по России</h3><p>Сборные и отдельные машины от 1 до 20 тонн. Подача в день заявки, если машина есть рядом.</p><span class="price">от 38 ₽/км</span></div>
    <div class="svc-row"><h3>Ответственное хранение</h3><p>Склад класса А в Подмосковье: приёмка, учёт по ячейкам, комплектация и отгрузка заказов.</p><span class="price">от 450 ₽/паллета</span></div>
    <div class="svc-row"><h3>Доставка до двери</h3><p>Последняя миля по городам: подъём на этаж, выгрузка, возврат документов отправителю.</p><span class="price">от 1 900 ₽</span></div>
  </div>
  <p style="margin-top:28px"><a href="uslugi.html"><b>Подробнее об услугах</b></a></p>
</div></section>

<section class="s alt"><div class="wrap">
  <h2>Как проходит перевозка</h2>
  <ol class="steps">
    <li><h3>Заявка</h3><p>Вы описываете груз и маршрут. Через 30 минут присылаем цену.</p></li>
    <li><h3>Договор</h3><p>Фиксируем цену, срок и ответственность. Работаем с НДС и без.</p></li>
    <li><h3>Рейс</h3><p>Подаём машину, грузим, присылаем номер водителя и точку на карте.</p></li>
    <li><h3>Закрытие</h3><p>Получатель подписывает накладную, документы отправляем в тот же день.</p></li>
  </ol>
</div></section>

<section class="s"><div class="wrap">
  <h2>Полезно знать</h2>
  <div class="posts" id="posts" data-limit="3"></div>
</div></section>

<section class="s cta"><div class="wrap">
  <h2>Скажите, что и куда везти. Остальное посчитаем мы.</h2>
  <a class="btn" href="zayavka.html">Оставить заявку</a>
</div></section>`);

pages['uslugi.html'] = wrap('Услуги - Магистраль', 'Перевозки, ответственное хранение и доставка до двери: что входит и сколько стоит.', 'uslugi', `
<section class="page-h"><div class="wrap"><h1>Услуги</h1><p>Цены ориентировочные. Точную стоимость фиксируем в договоре после расчёта вашей заявки.</p></div></section>
<div class="dash"></div>
<section class="s"><div class="wrap"><div class="svc">
  <div class="svc-row"><h3>Перевозки по России</h3>
    <div><p>Полная и сборная загрузка, тенты, рефрижераторы, изотермы. Подача машины в день заявки или на согласованную дату.</p>
    <ul><li>Груз от 100 кг до 20 тонн</li><li>Страхование на полную стоимость</li><li>Отслеживание рейса онлайн</li></ul></div><span class="price">от 38 ₽/км</span></div>
  <div class="svc-row"><h3>Ответственное хранение</h3>
    <div><p>Сухой склад класса А с охраной и видеонаблюдением. Принимаем груз по накладной, ведём остатки по ячейкам.</p>
    <ul><li>Паллетное и коробочное хранение</li><li>Комплектация и упаковка заказов</li><li>Ежедневный отчёт по остаткам</li></ul></div><span class="price">от 450 ₽/паллета в месяц</span></div>
  <div class="svc-row"><h3>Доставка до двери</h3>
    <div><p>Развозка по городам и областям малотоннажным транспортом. Подъём на этаж и выгрузка по договорённости.</p>
    <ul><li>Окно доставки 2 часа</li><li>Возврат подписанных документов</li><li>Звонок получателю перед приездом</li></ul></div><span class="price">от 1 900 ₽</span></div>
  <div class="svc-row"><h3>Таможня и сопровождение</h3>
    <div><p>Оформление документов для международных рейсов: декларации, сертификаты, взаимодействие с брокером.</p>
    <ul><li>Подготовка пакета документов</li><li>Консультация по кодам ТН ВЭД</li></ul></div><span class="price">по запросу</span></div>
</div>
<p style="margin-top:36px"><a class="btn dark" href="zayavka.html">Рассчитать мою задачу</a></p>
</div></section>`);

pages['blog.html'] = wrap('Блог - Магистраль', 'Статьи о перевозках, документах и складе: как сэкономить и не получить задержку.', 'blog', `
<section class="page-h"><div class="wrap"><h1>Блог</h1><p>Разбираем, как устроена логистика, простыми словами.</p></div></section>
<div class="dash"></div>
<section class="s"><div class="wrap"><div class="posts" id="posts"></div></div></section>`);

pages['statya.html'] = wrap('Статья - Магистраль', 'Статья из блога компании Магистраль.', 'blog', `
<section class="s"><div class="wrap"><article class="article" id="article"></article></div></section>`);

pages['zayavka.html'] = wrap('Оставить заявку - Магистраль', 'Опишите груз и маршрут. Пришлём расчёт стоимости за 30 минут в рабочее время.', 'zayavka', `
<section class="page-h"><div class="wrap"><h1>Заявка на расчёт</h1><p>Опишите груз и маршрут. Менеджер пришлёт цену в рабочее время в течение 30 минут.</p></div></section>
<div class="dash"></div>
<section class="s"><div class="wrap form-grid">
  <form class="f" id="lead" novalidate>
    <div><label for="name">Имя</label><input id="name" name="name" autocomplete="name" required><p class="msg" aria-live="polite"></p></div>
    <div><label for="company">Компания</label><input id="company" name="company" autocomplete="organization"><p class="msg"></p></div>
    <div><label for="phone">Телефон</label><input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="+7 ___ ___-__-__" required><p class="msg" aria-live="polite"></p></div>
    <div><label for="email">Почта (по желанию)</label><input id="email" name="email" type="email" autocomplete="email"><p class="msg" aria-live="polite"></p></div>
    <div class="full"><label for="service">Что нужно</label>
      <select id="service" name="service"><option>Перевозка по России</option><option>Ответственное хранение</option><option>Доставка до двери</option><option>Таможня и сопровождение</option><option>Другое</option></select></div>
    <div class="full"><label for="message">Груз и маршрут</label><textarea id="message" name="message" placeholder="Например: 12 паллет, 8 тонн, Москва - Казань, 28 октября" required></textarea><p class="msg" aria-live="polite"></p></div>
    <input class="hp" name="site" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div class="full agree"><input type="checkbox" id="agree" name="agree"><label for="agree" style="font-weight:400;margin:0">Согласен на обработку персональных данных для связи по заявке</label></div>
    <div class="full"><button class="btn" type="submit">Отправить заявку</button>
      <div id="status" tabindex="-1" role="status"></div></div>
  </form>
  <aside class="aside"><h3>Быстрее по телефону</h3><p>Если груз срочный, позвоните: ответим сразу.</p><p><a href="tel:+74951234567" style="font-family:Unbounded,sans-serif;font-size:1.1rem">+7 (495) 123-45-67</a></p><p>Пн-Пт, 9:00-19:00</p></aside>
</div></section>`);

pages['kontakty.html'] = wrap('Контакты - Магистраль', 'Адрес, телефон и почта компании Магистраль. Приезжайте или пишите.', 'kontakty', `
<section class="page-h"><div class="wrap"><h1>Контакты</h1></div></section>
<div class="dash"></div>
<section class="s"><div class="wrap contacts">
  <dl>
    <div><dt>Телефон</dt><dd><a href="tel:+74951234567">+7 (495) 123-45-67</a></dd></div>
    <div><dt>Почта</dt><dd><a href="mailto:info@magistral-demo.ru">info@magistral-demo.ru</a></dd></div>
    <div><dt>Офис и склад</dt><dd>Москва, ул. Складочная, 1, стр. 12<br>Въезд для машин со стороны Складочной улицы</dd></div>
    <div><dt>Часы работы</dt><dd>Пн-Пт, 9:00-19:00. Диспетчерская принимает звонки круглосуточно.</dd></div>
    <div><a class="btn dark" href="zayavka.html">Оставить заявку</a></div>
  </dl>
  <div class="map"><svg viewBox="0 0 600 380" role="img" aria-label="Схема проезда к офису на Складочной улице" preserveAspectRatio="xMidYMid slice">
    <rect width="600" height="380" fill="#dfe2da"/>
    <g stroke="#fff" stroke-width="16" fill="none"><path d="M0 250 H600"/><path d="M180 0 V380"/><path d="M420 0 V380"/></g>
    <path d="M0 250 H600" stroke="#f2b705" stroke-width="3" stroke-dasharray="14 12" fill="none"/>
    <rect x="200" y="140" width="100" height="70" fill="#0f6b63"/><text x="250" y="180" text-anchor="middle" fill="#fff" font-family="Golos Text" font-size="15">Склад</text>
    <circle cx="350" cy="250" r="12" fill="#1b1f23"/><text x="368" y="236" font-family="Golos Text" font-size="15" fill="#1b1f23">Въезд</text>
    <text x="20" y="278" font-family="Golos Text" font-size="14" fill="#59626a">ул. Складочная</text>
  </svg></div>
</div></section>`);

for (const [f, html] of Object.entries(pages)) fs.writeFileSync(f, html);
console.log('ok', Object.keys(pages).length);
