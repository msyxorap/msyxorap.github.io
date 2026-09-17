# What still needs your input

Everything below is in `assets/js/content.js` unless noted.

## Decide

- **Phone number.** Your CV has `(914) 656-8290`; I left it off the site
  deliberately. A phone number on a public page gets scraped. Add it to the
  `EMAIL` or a new entry under `CONTENT.contact` if you want it there.
- **"Code + Data available on request."** Your CV says this about the
  dissertation, but the repository is public. Worth changing the CV line to
  link the repo directly — it's a stronger signal than "on request".
- **The HP bar in the header.** Still there, in `index.html` (`.hud`). The
  ATK/DEF/HP lines are gone from the opening text; delete the four `.hud__hp`
  / `.hud__bar` / `.hud__num` spans if you want the bar gone too.
- **Tone.** Some flavour text is still mine, not yours — e.g. `"This website
  is, more or less, its fault."` (THE RPG). Rewrite anything that doesn't
  sound like you.
- **The cursor** is a pixel mouse drawn as an SVG in `--cursor-svg` at the
  top of `style.css`. Each `<rect>` is one pixel on a 16x16 grid.

## If you add a section

The four buttons are RESEARCH / EXPERIENCE / SKILLS / CONTACT. To add a fifth,
add a `<button class="btn" data-key="yourkey">` in `index.html`, add a
matching `CONTENT.yourkey` block with `label`, `blurb`, `prompt` and
`list`, and widen the `.btns` grid in `style.css`.
