const LEAD_ENDPOINT = 'https://lead-relay.leestygpt.workers.dev/lead/TPQVARJKLZ';
window.YUG = { p: 0, reduce: matchMedia('(prefers-reduced-motion: reduce)').matches };
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = window.YUG.reduce;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const safe = fn => { try { fn(); } catch (e) { console.error(e); } };

  // hero entrance
  safe(() => {
    $$('.hero__title .w > span').forEach((s, i) => s.style.setProperty('--i', i));
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('ready')));
    setTimeout(() => root.classList.add('ready'), 1200);
  });

  // reveal on scroll with stagger inside a group
  safe(() => {
    const els = $$('[data-r]');
    els.forEach(el => {
      const sibs = [...el.parentElement.children].filter(x => x.hasAttribute('data-r'));
      el.style.setProperty('--d', Math.max(0, sibs.indexOf(el)) * 0.09 + 's');
    });
    let tick = false;
    const check = () => {
      tick = false;
      const vh = innerHeight;
      els.forEach(el => { if (!el.classList.contains('in') && el.getBoundingClientRect().top < vh * 0.92) el.classList.add('in'); });
    };
    const on = () => { if (!tick) { tick = true; requestAnimationFrame(check); } };
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on);
    check(); setTimeout(check, 400);
  });

  // magnetic buttons + hero tilt
  safe(() => {
    if (reduce || !matchMedia('(pointer:fine)').matches) return;
    $$('.mag').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .3}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
    const shot = $('#shot'), fr = $('.hero__frame');
    shot.addEventListener('pointermove', e => {
      const r = shot.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      fr.style.transform = `rotateY(${x * 7}deg) rotateX(${-y * 6}deg)`;
    });
    shot.addEventListener('pointerleave', () => { fr.style.transform = ''; });
  });

  // ---- elevation profile ----
  const CITIES = [
    { n: 'Темрюк', x: 90, y: 238, img: 'anapa', d: 'Тихое побережье рядом с Таманью.', t: 'Дома, курортная недвижимость' },
    { n: 'Анапа', x: 175, y: 236, img: 'anapa', d: 'Длинные пляжи и новые комплексы в нескольких минутах от моря.', t: 'Новостройки, курортная недвижимость, инвестиции' },
    { n: 'Новороссийск', x: 260, y: 228, img: 'gel', d: 'Порт и большой город с растущим рынком новостроек.', t: 'Новостройки, коммерческая недвижимость' },
    { n: 'Геленджик', x: 345, y: 212, img: 'gel', d: 'Бухта, виды на море и спрос на курортное жильё круглый год.', t: 'Курортная и элитная недвижимость' },
    { n: 'Сочи', x: 430, y: 205, img: 'sochi', d: 'Субтропики между морем и горами: премиальные проекты и апартаменты.', t: 'Элитная и инвестиционная недвижимость' },
    { n: 'Адлер', x: 510, y: 220, img: 'sochi', d: 'Курортный район рядом с аэропортом и горными трассами.', t: 'Апартаменты, инвестиционные квартиры' },
    { n: 'Краснодар', x: 600, y: 238, img: 'inland', d: 'Крупнейший город края: жильё для жизни и для сдачи.', t: 'Новостройки, коммерческая и промышленная недвижимость' },
    { n: 'Майкоп', x: 700, y: 200, img: 'inland', d: 'Столица Адыгеи: спокойный город у подножия гор.', t: 'Квартиры, дома' },
    { n: 'Адыгея', x: 810, y: 120, img: 'inland', d: 'Горная Адыгея: загородные дома и объекты для отдыха.', t: 'Дома, курортные объекты' },
    { n: 'Железноводск', x: 920, y: 170, img: 'inland', d: 'Кавказские Минеральные Воды: курорт круглый год.', t: 'Курортные квартиры' }
  ];
  const cityNames = CITIES.map(c => c.n);
  safe(() => {
    const svg = $('#profSvg'), pins = $('#pins'), eye = $('#eye');
    const smooth = pts => {
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
        d += ` Q${pts[i][0]},${pts[i][1]} ${mx},${my}`;
      }
      const l = pts[pts.length - 1]; return d + ` L${l[0]},${l[1]}`;
    };
    const land = [[70, 238], ...CITIES.map(c => [c.x, c.y]), [1000, 186]];
    const range = [[250, 215], [360, 160], [470, 185], [580, 150], [690, 95], [790, 60], [880, 90], [940, 70], [1000, 100]];
    const NS = 'http://www.w3.org/2000/svg';
    const mk = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); svg.appendChild(e); return e; };
    mk('path', { class: 'rg', d: smooth(range) + ' L1000,300 L250,300 Z' });
    mk('rect', { class: 'sea', x: 0, y: 236, width: 84, height: 64 });
    mk('path', { class: 'ld', d: smooth(land) + ' L1000,300 L70,300 Z' });
    mk('path', { class: 'wave', d: 'M0,236 Q20,230 42,236 T84,236' });
    mk('path', { class: 'top', d: smooth(land) });
    CITIES.forEach((c, i) => {
      const b = document.createElement('button');
      b.className = 'pin'; b.type = 'button';
      b.style.left = c.x / 10 + '%'; b.style.top = c.y / 3 + '%'; b.style.setProperty('--i', i);
      const h = 26 + (i % 3) * 38;
      b.innerHTML = `<span class="pin__l">${c.n}</span><span class="pin__s" style="height:${h}px"></span><span class="pin__d"></span>`;
      b.setAttribute('aria-label', c.n);
      b.addEventListener('click', () => pick(i));
      pins.appendChild(b);
    });
    const city = $('#panCity'), desc = $('#panDesc'), tags = $('#panTags'), btn = $('#panBtn'), media = $$('#panMedia .pm');
    function pick(i, quiet) {
      const c = CITIES[i];
      $$('.pin').forEach((p, j) => p.classList.toggle('on', j === i));
      eye.style.left = c.x / 10 + '%'; eye.style.top = c.y / 3 + '%';
      [city, desc, tags].forEach(e => { e.classList.remove('txt-swap'); void e.offsetWidth; e.classList.add('txt-swap'); });
      city.textContent = c.n; desc.textContent = c.d; tags.textContent = c.t;
      const key = c.img;
      media.forEach(m => m.classList.toggle('on', m.dataset.k === key));
      btn.textContent = 'Подобрать: ' + c.n;
      const sel = $('#citySel'); if (sel) sel.value = c.n;
    }
    btn.addEventListener('click', () => {});
    pick(1);
  });

  // ---- scene progress (3D reads window.YUG.p) ----
  safe(() => {
    const sc = $('#process'), steps = $$('#steps li'), tr = $$('#track i'), st = $$('#stack i');
    const N = steps.length; sc.style.setProperty('--n', N);
    let last = -1;
    const f = () => {
      const r = sc.getBoundingClientRect(), tot = sc.offsetHeight - innerHeight;
      const p = Math.max(0, Math.min(1, -r.top / tot));
      window.YUG.p = p;
      const u = p * N, k = Math.min(N - 1, Math.floor(u));
      st.forEach((e, i) => e.style.setProperty('--t', Math.max(0, Math.min(1, u - i)).toFixed(3)));
      if (k !== last) {
        last = k;
        steps.forEach((s, i) => s.classList.toggle('on', i === k));
        tr.forEach((s, i) => s.classList.toggle('on', i <= k));
      }
    };
    addEventListener('scroll', f, { passive: true }); addEventListener('resize', f); f();
  });

  // ---- receipt calculator ----
  let calcSummary = '';
  safe(() => {
    const form = $('#calc'), rows = $('#rows'), sumEl = $('#sum'), gift = $('#gift'), areaEl = $('#area'), areaOut = $('#areaOut'), wrap = $('#areaWrap');
    const fmt = n => Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';
    let shown = 0, raf, sig = '';
    const tween = to => {
      cancelAnimationFrame(raf); const from = shown, t0 = performance.now();
      const step = t => { const p = Math.min(1, (t - t0) / (reduce ? 1 : 450)); shown = from + (to - from) * (1 - Math.pow(1 - p, 3)); sumEl.textContent = fmt(shown); if (p < 1) raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step);
    };
    const KINDS = { new: 'Новостройка', resale: 'Вторичное жильё', resort: 'Курортная или элитная', biz: 'Коммерческая или промышленная' };
    const GIFTS = {
      new: 'Подарок: один платёж по ипотеке за наш счёт.',
      resale: 'Подарок: коммунальные платежи за 1 месяц и клининг.',
      resort: 'Подарок: путёвка за границу, ОАЭ или Алтай.',
      biz: 'Подарок и условия обсудим индивидуально.'
    };
    const render = () => {
      const fd = new FormData(form), kind = fd.get('kind');
      const legal = !!fd.get('legal'), repair = !!fd.get('repair'), house = !!fd.get('house'), area = +areaEl.value;
      areaOut.textContent = area + ' м²'; wrap.classList.toggle('off', !(repair || house));
      const lines = [];
      if (kind === 'new' || kind === 'resort') {
        lines.push(['Подбор и ведение сделки', 0, 'free']);
        lines.push(['Одобрение ипотеки', 0, 'free']);
      } else if (kind === 'resale') {
        lines.push(['Подбор и ведение сделки', null, 'обсудим на старте']);
        lines.push(['Одобрение ипотеки', 5000]);
      } else {
        lines.push(['Подбор и ведение сделки', null, 'по запросу']);
      }
      if (legal) lines.push(['Юридическое сопровождение', 20000]);
      if (repair) lines.push([`Ремонт, ${area} м² от 12 000 ₽`, 12000 * area, 'от']);
      if (house) lines.push([`Дом, ${area} м² от 48 000 ₽`, 48000 * area, 'от']);
      const total = lines.reduce((a, l) => a + (l[1] || 0), 0), hasFrom = lines.some(l => l[2] === 'от');
      const nsig = kind + legal + repair + house;
      if (nsig !== sig) {
        sig = nsig;
        rows.innerHTML = lines.map((l, i) => `<li data-i="${i}"><span>${l[0]}</span><b class="${l[1] === 0 ? 'z' : ''}">${l[1] === null ? l[2] : l[1] === 0 ? '0 ₽' : (l[2] === 'от' ? 'от ' : '') + fmt(l[1])}</b></li>`).join('');
      } else {
        lines.forEach((l, i) => {
          const li = rows.children[i]; if (!li) return;
          li.firstChild.textContent = l[0];
          if (l[1]) li.lastChild.textContent = (l[2] === 'от' ? 'от ' : '') + fmt(l[1]);
        });
      }
      tween(total);
      sumEl.dataset.from = hasFrom ? '1' : '';
      gift.textContent = GIFTS[kind];
      calcSummary = `Смета: ${KINDS[kind]}${legal ? ', юрист' : ''}${repair ? ', ремонт ' + area + ' м²' : ''}${house ? ', дом ' + area + ' м²' : ''}; итого ${hasFrom ? 'от ' : ''}${fmt(total)}`;
      const cf = $('#calcField'); if (cf) cf.value = calcSummary;
    };
    form.addEventListener('input', render); form.addEventListener('change', render);
    render();
  });

  // ---- FAQ ----
  safe(() => {
    const qs = $$('.q__b');
    qs.forEach(b => b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') === 'true';
      qs.forEach(x => x.setAttribute('aria-expanded', 'false'));
      if (!open) b.setAttribute('aria-expanded', 'true');
    }));
  });

  // phone mask
  $$('input[type="tel"]').forEach(input => {
    input.addEventListener('input', e => {
      const raw = e.target.value;
      if (/[a-zA-Zа-яА-Я@_]/.test(raw)) return;
      let v = raw.replace(/\D/g, '');
      if (!v) { e.target.value = ''; return; }
      if (v[0] === '8') v = '7' + v.slice(1);
      if (v[0] !== '7') v = '7' + v;
      v = v.slice(0, 11);
      let out = '+7';
      if (v.length > 1) out += ' (' + v.slice(1, 4);
      if (v.length >= 4) out += ') ' + v.slice(4, 7);
      if (v.length >= 7) out += '-' + v.slice(7, 9);
      if (v.length >= 9) out += '-' + v.slice(9, 11);
      e.target.value = out;
    });
  });

  // ---- form ----
  const form = $('#leadForm');
  form && form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]'), orig = btn.textContent, msg = $('#formMsg');
    const payload = {}; new FormData(form).forEach((v, k) => { payload[k] = v; });
    if (payload._gotcha) return;
    if (!payload.name || !payload.phone) { msg.textContent = 'Укажите имя и телефон или Telegram.'; return; }
    payload.comment = ['Цель: ' + payload.goal, 'Город: ' + payload.city, payload.wish ? 'Пожелания: ' + payload.wish : '', payload.calc || ''].filter(Boolean).join(' | ');
    btn.disabled = true; btn.textContent = 'Отправляем...'; msg.textContent = '';
    try {
      const r = await fetch(LEAD_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      msg.textContent = 'Заявка отправлена. Мы вернёмся с подборкой.'; form.reset();
      const cf = $('#calcField'); if (cf) cf.value = calcSummary;
    } catch (err) { console.error(err); msg.textContent = 'Не получилось отправить. Попробуйте ещё раз.'; }
    finally { btn.textContent = orig; btn.disabled = false; }
  });
})();
