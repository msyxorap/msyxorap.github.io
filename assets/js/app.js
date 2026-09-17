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

  function ensureCtx(){
    try { actx ||= new (window.AudioContext || window.webkitAudioContext)(); }
    catch { return null; }
    return actx;
  }

  /* Browsers start the audio context suspended until the visitor interacts.
     While suspended currentTime does not advance, so anything scheduled
     piles up on the same timestamp and all of it fires at once the moment
     the context resumes — a loud pop. So: resume on the first real gesture,
     and never schedule anything unless the context is actually running. */
  function unlockAudio(){
    const a = ensureCtx();
    if (a && a.state === 'suspended') a.resume();
  }
  addEventListener('pointerdown', unlockAudio);
  addEventListener('keydown', unlockAudio);

  function tone(freq, dur, type, peak){
    if (cfg.sound !== 'on') return;
    const a = ensureCtx();
    if (!a || a.state !== 'running') return;
    try {
      const t = a.currentTime + 0.001;
      const o = a.createOscillator(), g = a.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      /* ramp in and out instead of jumping from silence: an instant gain
         step is a waveform discontinuity, which is what clicks */
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(a.destination);
      o.start(t);
      o.stop(t + dur + 0.02);
    } catch {}
  }
  const sfx = {
    blip:    () => tone(440 + Math.random()*90, 0.028, 'square', 0.022),
    move:    () => tone(680, 0.045, 'square', 0.05),
    confirm: () => tone(980, 0.075, 'square', 0.055),
    back:    () => tone(300, 0.075, 'triangle', 0.05)
  };

  /* ----------------------------------------------------------
     Music — an original chiptune loop, generated live.
     There is no audio file; every note is an oscillator.
     Am - Am - F - G - C - G - F - Am, 8 bars, 96bpm.
     ---------------------------------------------------------- */
  const SEMI = { C:0,'C#':1,D:2,'D#':3,E:4,F:5,'F#':6,G:7,'G#':8,A:9,'A#':10,B:11 };
  function hz(name){
    const m = /^([A-G]#?)(-?\d)$/.exec(name);
    return 440 * Math.pow(2, (SEMI[m[1]] + (+m[2] - 4) * 12 - 9) / 12);
  }

  const BPM = 96, BEAT = 60 / BPM, LOOP_BEATS = 32;
  /* [note, startBeat, lengthBeats] */
  const LEAD = [
    ['A4',0,2],['C5',2,1],['B4',3,1],
    ['A4',4,2],['E4',6,2],
    ['F4',8,2],['G4',10,1],['A4',11,1],
    ['G4',12,4],
    ['C5',16,2],['B4',18,1],['A4',19,1],
    ['B4',20,2],['G4',22,2],
    ['F4',24,2],['E4',26,2],
    ['A4',28,4]
  ];
  const BASS = [
    ['A2',0,2],['E3',2,2],   ['A2',4,2],['E3',6,2],
    ['F2',8,2],['C3',10,2],  ['G2',12,2],['D3',14,2],
    ['C3',16,2],['G3',18,2], ['G2',20,2],['D3',22,2],
    ['F2',24,2],['C3',26,2], ['A2',28,2],['E3',30,2]
  ];

  let musicOn = store.get('music') === 'on';
  /* Number(null) is 0, not NaN — check for "unset" before coercing,
     or a first-time visitor gets music at volume zero. */
  const storedVol = store.get('vol');
  let vol = storedVol === null || storedVol === '' ? 35 : Number(storedVol);
  if (!Number.isFinite(vol) || vol < 0 || vol > 100) vol = 35;

  let musicGain = null, nextLoopAt = 0, loopTimer = null;

  function gainValue(){ return (vol / 100) * 0.16; }   // capped: this is background

  function voice(freq, at, dur, type, peak){
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, at);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(peak, at + 0.02);
    g.gain.setValueAtTime(peak, at + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g).connect(musicGain);
    o.start(at);
    o.stop(at + dur + 0.05);
  }

  function scheduleLoop(){
    const t = nextLoopAt;
    LEAD.forEach(([n,b,l]) => voice(hz(n), t + b*BEAT, l*BEAT*0.92, 'triangle', 0.5));
    BASS.forEach(([n,b,l]) => voice(hz(n), t + b*BEAT, l*BEAT*0.92, 'square',   0.16));
    nextLoopAt += LOOP_BEATS * BEAT;
  }

  function startMusic(){
    try {
      const a = ensureCtx();
      if (!a) return;
      if (a.state === 'suspended') a.resume();
      if (a.state !== 'running'){        // wait for a gesture, don't pile up
        addEventListener('pointerdown', () => { if (musicOn && !musicGain) startMusic(); }, { once: true });
        return;
      }
      if (!musicGain){
        musicGain = actx.createGain();
        musicGain.connect(actx.destination);
      }
      musicGain.gain.setValueAtTime(gainValue(), actx.currentTime);
      nextLoopAt = actx.currentTime + 0.15;
      scheduleLoop();
      clearInterval(loopTimer);
      loopTimer = setInterval(() => {
        if (!musicOn) return;
        if (nextLoopAt - actx.currentTime < 1.2) scheduleLoop();
      }, 300);
    } catch { musicOn = false; paintMusic(); }
  }

  function stopMusic(){
    clearInterval(loopTimer); loopTimer = null;
    if (musicGain && actx){
      /* fade out rather than cutting, then drop the node */
      const t = actx.currentTime;
      musicGain.gain.cancelScheduledValues(t);
      musicGain.gain.setValueAtTime(musicGain.gain.value, t);
      musicGain.gain.linearRampToValueAtTime(0.0001, t + 0.25);
      const dying = musicGain;
      musicGain = null;
      setTimeout(() => { try { dying.disconnect(); } catch {} }, 400);
    }
  }

  const musBtn = $('#musBtn'), volRange = $('#volRange'), volOut = $('#volOut');
  function paintMusic(){
    musBtn.textContent = 'MUSIC: ' + (musicOn ? 'ON' : 'OFF');
    musBtn.setAttribute('aria-pressed', String(musicOn));
    volRange.value = String(vol);
    volOut.textContent = String(vol);
    volRange.setAttribute('aria-valuetext', vol + ' percent');
  }
  paintMusic();

  musBtn.addEventListener('click', () => {
    musicOn = !musicOn;
    store.set('music', musicOn ? 'on' : 'off');
    paintMusic();
    musicOn ? startMusic() : stopMusic();
  });

  volRange.addEventListener('input', () => {
    vol = Number(volRange.value);
    store.set('vol', String(vol));
    volOut.textContent = String(vol);
    volRange.setAttribute('aria-valuetext', vol + ' percent');
    if (musicGain && actx) musicGain.gain.setTargetAtTime(gainValue(), actx.currentTime, 0.02);
  });

  /* Browsers block audio until the visitor interacts. If music was left on
     from a previous visit, start it at the first real interaction. */
  if (musicOn){
    const kick = () => { if (musicOn && !musicGain) startMusic(); };
    addEventListener('pointerdown', kick, { once: true });
    addEventListener('keydown', kick, { once: true });
  }

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

    /* read fresh each character so a speed change applies immediately */
    const delay = () => reduced ? 0 : SPEEDS[cfg.speed];
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
        typing = { timer: setTimeout(step, delay()), finish };
      } else {
        caret.remove();
        n++;
        typing = { timer: setTimeout(step, delay() * 2), finish };
      }
    }

    if (delay() === 0) finish(); else { typing = { timer: setTimeout(step, 0), finish }; }
  }

  /* ----------------------------------------------------------
     State
     ---------------------------------------------------------- */
  const MENU = 'menu', LIST = 'list', DETAIL = 'detail';
  let mode = MENU;
  let bi = 0;          // button index
  let li = 0;          // list index
  let section = null;  // current section key
  const lastPick = {}; // section -> last entry index, so going back lands where you left

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
    mode = LIST; section = key;
    li = lastPick[key] ?? 0;
    bi = Math.max(0, KEYS.indexOf(key));
    paintButtons();
    if (!silent) sfx.confirm();

    type([sec.blurb.replace(/^\* /,''), sec.prompt.replace(/^\* /,'')]);

    /* Built immediately rather than in the typing callback: waiting for the
       blurb to finish before anything is clickable is maddening. */
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
    lastPick[key] = i;
    bi = Math.max(0, KEYS.indexOf(key));
    paintButtons();
    if (!silent) sfx.confirm();

    type([entry.name].concat(entry.lines));

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

  /* Clicking the text area fast-forwards it, the way Z does. */
  screen.addEventListener('click', e => {
    if (e.target.closest('.opt, .go')) return;
    if (typing) typing.finish();
  });

  /* ----------------------------------------------------------
     Keyboard — Undertale controls
     ---------------------------------------------------------- */
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    /* Let focused controls handle their own keys: links, and the
       SOUND / TEXT toggles in the hint row. Without this the global
       handler swallows Enter and opens a section instead. */
    const ae = document.activeElement;
    const confirmKey = e.key === 'Enter' || e.key === ' ';
    if (ae && ae.tagName === 'INPUT') return;   // the volume slider owns its arrows
    if (ae && confirmKey && (ae.tagName === 'A' || ae.classList.contains('keys__b'))) return;

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
