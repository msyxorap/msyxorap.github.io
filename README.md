# msyxorap.github.io

Lucas Lutar's interactive CV. An Undertale-style battle menu: a dialogue
box, four buttons, and a red heart for a cursor.

Live at **https://msyxorap.github.io**

## Stack

Static HTML, CSS and vanilla JavaScript. No framework, no build step, no
dependencies, no tracking, no analytics. Push to `main` and GitHub Pages
serves it. Total weight is about 400 KB, most of which is two pixel fonts.

    index.html              page shell + the full plain-text CV
    assets/js/content.js    ALL the CV content — edit this one
    assets/js/app.js        typewriter, cursor, navigation, routing
    assets/css/style.css    the look
    assets/css/fonts.css    self-hosted VT323 + Press Start 2P
    assets/fonts/           the font files

## Editing the CV

Open `assets/js/content.js`. Everything the site says is in there, as
arrays of lines. Each line renders as one `*` bullet; a line starting with
two spaces continues the line above without a new bullet.

The four buttons map to:

| Button | Section | Where |
|---|---|---|
| FIGHT | Research | `CONTENT.fight` |
| ACT | Work experience | `CONTENT.act` |
| ITEM | Skills and key items | `CONTENT.item` |
| MERCY | Contact | `CONTENT.mercy` |

The opening screen is `CONTENT.home`.

When you change `content.js`, update the plain-text CV at the bottom of
`index.html` too — that copy is what search engines, screen readers and
no-JavaScript visitors actually get.

## Controls

Arrow keys or WASD to move, `Z`/`Enter` to confirm, `X`/`Esc` to go back.
Pressing confirm while text is still typing skips to the end, as it should.
Mouse and touch work throughout.

Every section has its own URL (`#/act`, `#/act/epic-systems`), so links are
shareable and the browser back button works.

## Accessibility

- The typing animation is marked `aria-hidden`; a live region announces
  each finished passage instead, so screen readers aren't spammed per
  character.
- The complete CV is in the HTML as plain text, visible without JavaScript
  and reachable any time via the skip link.
- `prefers-reduced-motion` renders text instantly.
- Sound is off by default and synthesised with the Web Audio API, so there
  are no audio files to download.

## Local preview

    python3 -m http.server 8000

Then open http://localhost:8000.
