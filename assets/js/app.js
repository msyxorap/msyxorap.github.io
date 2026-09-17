/* ============================================================
   Lucas Lutar — interactive CV
   Undertale-style menu: typewriter text, a heart cursor, and
   three levels (buttons -> list -> detail).
   Vanilla JS, no dependencies.
   ============================================================ */
(() => {
  'use strict';

  const $  = s => document.querySelector(s);
  const body   = document.body;
  const screen = $('#screen');
  const btnRow = $('#btns');
  const btns   = Array.from(btnRow.querySelectorAll('.btn'));
  const KEYS   = btns.map(b => b.dataset.key);

  body.classList.add('js-on');

  /* screen readers get the finished text, not the typing animation */
  screen.setAttribute('aria-hidden', 'true');
  const sr = document.createElement('div');
  sr.setAttribute('aria-live', 'polite');
  Object.assign(sr.style, {
    position:'absolute', width:'1px', height:'1px', overflow:'hidden',
    clip:'rect(0 0 0 0)', clipPath:'inset(50%)', whiteSpace:'nowrap'
  });
  document.body.appendChild(sr);

  /* ----------------------------------------------------------
     Settings
     ---------------------------------------------------------- */
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEEDS  = { SLOW:38, NORMAL:12, FAST:4 };
  const store = {
    get(k){ try { return localStorage.getItem('ll.'+k); } catch { return null; } },
    set(k,v){ try { localStorage.setItem('ll.'+k,v); } catch {} }
  };
  const cfg = {
    sound: store.get('sound') === 'on' ? 'on' : 'off',
    speed: SPEEDS[store.get('speed')] ? store.get('speed') : 'NORMAL'
  };

  const sndBtn = $('#sndBtn'), spdBtn = $('#spdBtn');
  function paintCfg(){
    sndBtn.textContent = 'SOUND: ' + cfg.sound.toUpperCase();
    sndBtn.setAttribute('aria-pressed', String(cfg.sound === 'on'));
    spdBtn.textContent = 'TEXT: ' + cfg.speed;
    spdBtn.setAttribute('aria-pressed', 'false');
  }
  paintCfg();

  sndBtn.addEventListener('click', () => {
    cfg.sound = cfg.sound === 'on' ? 'off' : 'on';
    store.set('sound', cfg.sound); paintCfg();
    if (cfg.sound === 'on') sfx.confirm();
  });
  spdBtn.addEventListener('click', () => {
    const order = ['SLOW','NORMAL','FAST'];
    cfg.speed = order[(order.indexOf(cfg.speed) + 1) % order.length];
    store.set('speed', cfg.speed); paintCfg(); sfx.move();
  });

  /* ----------------------------------------------------------
     Sound — synthesised, nothing to download
     ---------------------------------------------------------- */
  let actx = null;
  function tone(freq, dur, type, gain){
    if (cfg.sound !== 'on') return;
    try {
      actx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      const t = actx.currentTime;
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(actx.destination);
      o.start(t); o.stop(t + dur);
    } catch {}
  }
  const sfx = {
    blip:    () => tone(440 + Math.random()*90, 0.028, 'square', 0.022),
    move:    () => tone(680, 0.045, 'square', 0.05),
    confirm: () => tone(980, 0.075, 'square', 0.055),
    back:    () => tone(300, 0.075, 'triangle', 0.05)
  };

  /* ----------------------------------------------------------
     Typewriter
     ---------------------------------------------------------- */
  let typing = null;        // {timer, finish}
  function stopTyping(){
    if (typing){ clearTimeout(typing.timer); typing = null; }
  }

  /* lines: array of strings. A leading "  " marks a continuation line. */
  function type(lines, onDone){
    stopTyping();
    screen.replaceChildren();
    sr.textContent = lines.map(l => l.trim()).join(' ');

    const nodes = lines.map(raw => {
      const cont = /^ {2}/.test(raw);
      const el = document.createElement('span');
      el.className = 'ln' + (cont ? ' ln--cont' : '');
      if (!cont) el.dataset.bullet = '1';
      screen.appendChild(el);
      return { el, text: cont ? raw.slice(2) : raw, cont, i: 0 };
    });

    const caret = document.createElement('span');
    caret.className = 'caret';

    const perChar = reduced ? 0 : SPEEDS[cfg.speed];
    let n = 0, chars = 0;

    function finish(){
      stopTyping();
      nodes.forEach(nd => { nd.el.textContent = (nd.cont ? '' : '* ') + nd.text; });
      caret.remove();
      onDone && onDone();
    }

    function step(){
      if (n >= nodes.length) return finish();
      const nd = nodes[n];
      if (nd.i === 0 && !nd.cont) nd.el.textContent = '* ';
      if (nd.i < nd.text.length){
        nd.el.textContent += nd.text[nd.i++];
        nd.el.appendChild(caret);
        if (++chars % 2 === 0 && nd.text[nd.i-1] !== ' ') sfx.blip();
        typing = { timer: setTimeout(step, perChar), finish };
      } else {
        caret.remove();
        n++;
        typing = { timer: setTimeout(step, perChar * 2), finish };
      }
    }

    if (perChar === 0) finish(); else { typing = { timer: setTimeout(step, 0), finish }; }
  }

  /* ----------------------------------------------------------
     State
     ---------------------------------------------------------- */
  const MENU = 'menu', LIST = 'list', DETAIL = 'detail';
  let mode = MENU;
  let bi = 0;          // button index
  let li = 0;          // list index
  let section = null;  // current section key

  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

  function paintButtons(){
    btns.forEach((b,i) => {
      b.classList.toggle('is-sel', mode === MENU && i === bi);
      b.classList.toggle('is-open', mode !== MENU && b.dataset.key === section);
      b.setAttribute('aria-expanded', String(mode !== MENU && b.dataset.key === section));
    });
  }

  /* ---------- level 0: the opening CHECK ---------- */
  function showHome({ silent = false } = {}){
    mode = MENU; section = null;
    paintButtons();
    type(CONTENT.home.lines);
    if (!silent) sfx.back();
    setHash('');
  }

  /* ---------- level 1: a section's option list ---------- */
  function showList(key, { silent = false } = {}){
    const sec = CONTENT[key];
    if (!sec) return;
    mode = LIST; section = key; li = 0;
    paintButtons();
    if (!silent) sfx.confirm();

    type([sec.blurb.replace(/^\* /,''), sec.prompt.replace(/^\* /,'')], () => {
      const ul = document.createElement('ul');
      ul.className = 'opts' + (sec.list.length > 4 ? ' opts--2' : '');
      sec.list.forEach((entry, i) => {
        const li_ = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'opt';
        b.textContent = entry.name;
        b.addEventListener('click', () => { li = i; paintOpts(); showDetail(key, i); });
        b.addEventListener('mouseenter', () => { li = i; paintOpts(); });
        li_.appendChild(b); ul.appendChild(li_);
      });
      screen.appendChild(ul);
      paintOpts();
    });
    setHash(key);
  }

  function paintOpts(){
    screen.querySelectorAll('.opt').forEach((o,i) => o.classList.toggle('is-sel', i === li));
  }

  /* ---------- level 2: one entry's detail ---------- */
  function showDetail(key, i, { silent = false } = {}){
    const entry = CONTENT[key]?.list?.[i];
    if (!entry) return;
    mode = DETAIL; section = key; li = i;
    paintButtons();
    if (!silent) sfx.confirm();

    type([entry.name].concat(entry.lines), () => {
      if (entry.link){
        const a = document.createElement('a');
        a.className = 'go';
        a.href = entry.link.href;
        a.textContent = entry.link.label;
        if (entry.link.download) a.setAttribute('download','');
        else if (/^https?:/.test(entry.link.href)){ a.target = '_blank'; a.rel = 'noopener'; }
        screen.appendChild(a);
      }
      screen.scrollTop = 0;
    });
    setHash(key + '/' + slug(entry.name));
  }

  /* ---------- going back one level ---------- */
  function goBack(){
    if (mode === DETAIL) showList(section), sfx.back();
    else if (mode === LIST) showHome();
  }

  /* ----------------------------------------------------------
     Pointer
     ---------------------------------------------------------- */
  btns.forEach((b,i) => {
    b.addEventListener('click', () => {
      if (mode !== MENU && section === b.dataset.key) { showHome(); return; }
      bi = i; showList(b.dataset.key);
    });
    b.addEventListener('mouseenter', () => { if (mode === MENU){ bi = i; paintButtons(); } });
  });

  /* ----------------------------------------------------------
     Keyboard — Undertale controls
     ---------------------------------------------------------- */
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = document.activeElement?.tagName;
    if (tag === 'A' && e.key === 'Enter') return;      // let links work

    const k = e.key.toLowerCase();

    /* any confirm during typing fast-forwards the text */
    if (typing && (k === 'z' || k === 'enter' || k === ' ')){
      e.preventDefault(); typing.finish(); return;
    }

    if (k === 'x' || k === 'escape' || k === 'backspace'){
      if (mode !== MENU){ e.preventDefault(); goBack(); }
      return;
    }

    if (mode === MENU){
      if (k === 'arrowleft'  || k === 'a'){ e.preventDefault(); bi = (bi + btns.length - 1) % btns.length; paintButtons(); sfx.move(); }
      if (k === 'arrowright' || k === 'd'){ e.preventDefault(); bi = (bi + 1) % btns.length; paintButtons(); sfx.move(); }
      if (k === 'z' || k === 'enter' || k === ' '){ e.preventDefault(); showList(KEYS[bi]); }
      return;
    }

    if (mode === LIST){
      const n = CONTENT[section].list.length;
      const opts = screen.querySelectorAll('.opt');
      if (!opts.length) return;
      /* two columns only if the grid actually wrapped that way at this width */
      const two = opts.length > 1 && opts[1].offsetTop === opts[0].offsetTop;
      const stepDown = two ? 2 : 1;
      if (k === 'arrowup'   || k === 'w'){ e.preventDefault(); li = (li - stepDown + n) % n; paintOpts(); sfx.move(); }
      if (k === 'arrowdown' || k === 's'){ e.preventDefault(); li = (li + stepDown) % n; paintOpts(); sfx.move(); }
      if (two && (k === 'arrowleft'  || k === 'a')){ e.preventDefault(); li = (li - 1 + n) % n; paintOpts(); sfx.move(); }
      if (two && (k === 'arrowright' || k === 'd')){ e.preventDefault(); li = (li + 1) % n; paintOpts(); sfx.move(); }
      if (k === 'z' || k === 'enter' || k === ' '){ e.preventDefault(); showDetail(section, li); }
      return;
    }

    if (mode === DETAIL){
      const n = CONTENT[section].list.length;
      if (k === 'arrowup'   || k === 'w'){ e.preventDefault(); showDetail(section, (li - 1 + n) % n); }
      if (k === 'arrowdown' || k === 's'){ e.preventDefault(); showDetail(section, (li + 1) % n); }
    }
  });

  /* ----------------------------------------------------------
     Hash routing — shareable links, working back button
     ---------------------------------------------------------- */
  let muteHash = false;
  function setHash(h){
    const want = h ? '#/' + h : '#/';
    if (location.hash === want) return;
    muteHash = true;
    history.replaceState(null, '', want);
    setTimeout(() => { muteHash = false; }, 0);
  }

  function fromHash({ silent = true } = {}){
    const parts = (location.hash || '').replace(/^#\/?/, '').split('/').filter(Boolean);
    const [key, entrySlug] = parts;
    if (!key || !CONTENT[key] || key === 'home') return showHome({ silent });
    bi = Math.max(0, KEYS.indexOf(key));
    if (entrySlug){
      const i = CONTENT[key].list.findIndex(x => slug(x.name) === entrySlug);
      if (i > -1) return showDetail(key, i, { silent });
    }
    showList(key, { silent });
  }

  addEventListener('hashchange', () => { if (!muteHash) fromHash(); });

  /* ----------------------------------------------------------
     Boot
     ---------------------------------------------------------- */
  fromHash({ silent: true });
})();
