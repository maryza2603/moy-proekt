(function(){
  const S = window.SITE;
  const page = document.body.dataset.page;
  const links = [['index.html','Главная','home'],['uslugi.html','Услуги','uslugi'],['blog.html','Блог','blog'],['kontakty.html','Контакты','kontakty']];

  document.body.insertAdjacentHTML('afterbegin',
    `<a class="skip" href="#main">К содержимому</a>
    <header class="hdr"><div class="wrap">
      <a class="logo" href="index.html"><i></i>${S.name}</a>
      <button class="burger" aria-expanded="false" aria-controls="nav">Меню</button>
      <nav class="nav" id="nav" aria-label="Основное меню">
        ${links.map(l=>`<a href="${l[0]}"${page===l[2]?' aria-current="page"':''}>${l[1]}</a>`).join('')}
        <a class="btn" href="zayavka.html">Оставить заявку</a>
      </nav></div></header>`);
  document.body.insertAdjacentHTML('beforeend',
    `<div class="dash"></div>
    <footer class="ftr"><div class="wrap">
      <div><b style="color:#f3f4f0">${S.name}</b><br>Грузоперевозки и склад для бизнеса<br>${S.address}</div>
      <div><a href="tel:${S.phoneHref}">${S.phone}</a><br><a href="mailto:${S.email}">${S.email}</a><br>${S.hours}</div>
      <div>Демонстрационный сайт. Название и контакты вымышлены.</div>
    </div></footer>`);

  const burger = document.querySelector('.burger'), nav = document.getElementById('nav');
  burger.addEventListener('click', () => {
    const o = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', o);
  });

  // блог: список
  const list = document.getElementById('posts');
  if (list) {
    const n = +list.dataset.limit || 99;
    list.innerHTML = window.POSTS.slice(0, n).map(p =>
      `<a class="post" href="statya.html?s=${p.slug}"><time>${fmtDate(p.date)}</time><h3>${p.title}</h3><p>${p.lead}</p></a>`).join('');
  }
  // блог: статья
  const art = document.getElementById('article');
  if (art) {
    const p = window.POSTS.find(x => x.slug === new URLSearchParams(location.search).get('s'));
    if (p) {
      document.title = p.title + ' - ' + S.name;
      art.innerHTML = `<a class="back" href="blog.html">Все статьи</a><time>${fmtDate(p.date)}</time><h1 style="font-size:clamp(1.6rem,3.6vw,2.4rem);margin:.4em 0 1em">${p.title}</h1>${p.body}
        <p style="margin-top:2em"><a class="btn" href="zayavka.html">Рассчитать мою перевозку</a></p>`;
    } else {
      art.innerHTML = '<h1>Статья не найдена</h1><p><a class="back" href="blog.html">Вернуться к списку статей</a></p>';
    }
  }

  // форма заявки
  const form = document.getElementById('lead');
  if (form) {
    const status = document.getElementById('status');
    const rules = {
      name: v => v.trim().length >= 2 || 'Укажите, как к вам обращаться',
      phone: v => v.replace(/\D/g,'').length >= 10 || 'Введите номер телефона полностью',
      email: v => v === '' || /^\S+@\S+\.\S+$/.test(v) || 'Проверьте адрес почты',
      message: v => v.trim().length >= 5 || 'Опишите задачу хотя бы в двух словах'
    };
    const check = el => {
      const r = rules[el.name]; if (!r) return true;
      const res = r(el.value), box = el.closest('div');
      box.classList.toggle('bad', res !== true);
      box.querySelector('.msg').textContent = res === true ? '' : res;
      return res === true;
    };
    form.querySelectorAll('input,textarea').forEach(el => el.addEventListener('blur', () => check(el)));

    form.addEventListener('submit', async e => {
      e.preventDefault();
      status.className = 'status'; status.textContent = '';
      const ok = [...form.elements].filter(el => rules[el.name]).map(check).every(Boolean);
      const agree = form.elements.agree;
      if (!agree.checked) { status.className = 'status fail'; status.textContent = 'Поставьте галочку согласия на обработку данных.'; return; }
      if (!ok) { status.className = 'status fail'; status.textContent = 'Исправьте поля, отмеченные красным.'; form.querySelector('.bad input,.bad textarea')?.focus(); return; }
      if (form.elements.site.value) return; // ловушка для ботов

      const d = Object.fromEntries(new FormData(form));
      const btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Отправляем…';
      try {
        if (S.formTo) {
          const res = await fetch('https://formsubmit.co/ajax/' + S.formTo, {
            method:'POST', headers:{'Content-Type':'application/json', Accept:'application/json'},
            body: JSON.stringify({_subject:'Новая заявка с сайта ' + S.name, 'Имя':d.name, 'Компания':d.company, 'Телефон':d.phone, 'Почта':d.email, 'Услуга':d.service, 'Задача':d.message})
          });
          if (!res.ok) throw new Error('send');
        } else {
          await new Promise(r => setTimeout(r, 600)); // демо: заявка никуда не уходит
        }
        form.reset();
        status.className = 'status ok';
        status.textContent = S.formTo
          ? 'Заявка отправлена. Менеджер позвонит вам в рабочее время и уточнит детали.'
          : 'Заявка принята. Это демо-версия: на рабочем сайте заявка придёт на вашу почту, а менеджер позвонит в рабочее время.';
        status.focus();
      } catch (err) {
        status.className = 'status fail';
        status.textContent = `Не получилось отправить. Позвоните нам: ${S.phone}, или попробуйте ещё раз.`;
      }
      btn.disabled = false; btn.textContent = 'Отправить заявку';
    });
  }
})();
