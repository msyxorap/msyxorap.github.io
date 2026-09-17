# What still needs your input

Everything below is in `assets/js/content.js` unless noted.

## Needed

1. **LinkedIn URL.** `CONTENT.mercy` → the `LINKEDIN` entry has a
   placeholder `href` of `https://www.linkedin.com/in/`. Paste your real
   profile URL. Also update the plain-text CV in `index.html` if you want it
   listed there.
2. **Your CV PDF.** Save it as `assets/cv.pdf`. The `DOWNLOAD CV` entry
   under MERCY links to it and will 404 until the file exists.

## Decide

- **Phone number.** Your CV has `(914) 656-8290`; I left it off the site
  deliberately. A phone number on a public page gets scraped. Add it to the
  `EMAIL` or a new entry under `CONTENT.mercy` if you want it there.
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

The four buttons are fixed at FIGHT / ACT / ITEM / MERCY. To add a fifth,
add a `<button class="btn" data-key="yourkey">` in `index.html`, add a
matching `CONTENT.yourkey` block with `label`, `blurb`, `prompt` and
`list`, and widen the `.btns` grid in `style.css`.
