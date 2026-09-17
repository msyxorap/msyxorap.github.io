# What still needs your input

Everything below is in `assets/js/content.js` unless noted.

## Decide

- **Phone number.** Your CV has `(914) 656-8290`; I left it off the site
  deliberately. A phone number on a public page gets scraped. Add it to the
  `EMAIL` or a new entry under `CONTENT.contact` if you want it there.
- **"Code + Data available on request."** Your CV says this about the
  dissertation, but the repository is public. Worth changing the CV line to
  link the repo directly — it's a stronger signal than "on request".
- **HP / ATK / DEF.** `CONTENT.home` opens with `HP 20/20` and
  `ATK 12(9) DEF 7(5)` as a joke. Change the numbers, or cut those two
  lines if you'd rather open straight into the summary.
- **Tone.** The flavour text is mine, not yours — `"An economist. Attacks
  with panel data."`, `"It's heavier than it looks."` (fencing gold),
  `"This website is, more or less, its fault."` (the RPG). Rewrite anything
  that doesn't sound like you.

## If you add a section

The four buttons are RESEARCH / EXPERIENCE / SKILLS / CONTACT. To add a fifth,
add a `<button class="btn" data-key="yourkey">` in `index.html`, add a
matching `CONTENT.yourkey` block with `label`, `blurb`, `prompt` and
`list`, and widen the `.btns` grid in `style.css`.
