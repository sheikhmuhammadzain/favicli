

Here's your README with ASCII art added:

```markdown
<div align="center">

```
    ___              _      ___
   / __\__ _ __   __(_) ___/ (_)
  / _\/ _` \ \ / / / / / __| | |
 / / | (_| |\ V /| | | (__| | |
 \/   \__,_| \_/ |_|  \___|_|_|
```

# favicli

One command to set up favicons for React and Next.js projects.

Detect project → choose image → generate all favicon sizes → inject references.

[![npm version](https://img.shields.io/npm/v/favicli)](https://www.npmjs.com/package/favicli)
[![npm downloads](https://img.shields.io/npm/dm/favicli)](https://www.npmjs.com/package/favicli)
[![license](https://img.shields.io/npm/l/favicli)](./LICENSE)

</div>

---

## Author

- **Name:** Zain Afzal
- **Website:** https://zainafzal.dev
- **Email:** zainsheikh3462@gmail.com

---

## Installation

```bash
npm install -g favicli
```

Or run without global install:

```bash
npx favicli
```

---

## Quick Usage

```bash
# Home menu
favicli

# Interactive setup
favicli set

# Set from a specific image
favicli set logo.png

# Detect project type
favicli detect

# Remove generated favicon files
favicli remove
```

---

## Commands

```
┌─────────────────────────────────────────────────────────┐
│                     Available Commands                   │
├──────────────────┬──────────────────────────────────────┤
│  favicli         │  Home screen with interactive menu   │
│  favicli set     │  Generate & inject favicons          │
│  favicli detect  │  Detect project type                 │
│  favicli remove  │  Remove generated favicon files      │
└──────────────────┴──────────────────────────────────────┘
```

### `favicli set [image]`

- Generates favicon files into `public/`
- Auto-injects/replaces references in project files

Options:

- `-d, --dir <path>`: target project directory
- `--no-inject`: generate files only, skip injection

Examples:

```bash
favicli set
favicli set logo.png
favicli set ./assets/icon.png -d ./apps/web
favicli set logo.png --no-inject
```

### `favicli detect`

Detects project type and shows project details.

```bash
favicli detect
favicli detect -d ./apps/web
```

### `favicli remove`

Removes generated favicon files from `public/`.

```bash
favicli remove
favicli remove -d ./apps/web
```

---

## How It Works

```
                     ┌──────────────┐
                     │  Your Image  │
                     │  (png/jpg/   │
                     │   svg/webp)  │
                     └──────┬───────┘
                            │
                     ┌──────▼───────┐
                     │   favicli    │
                     └──────┬───────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
  ┌──────▼───────┐  ┌──────▼───────┐  ┌───────▼──────┐
  │   Detect     │  │   Generate   │  │    Inject    │
  │   Project    │  │   All Sizes  │  │   References │
  └──────┬───────┘  └──────┬───────┘  └───────┬──────┘
         │                  │                  │
         ▼                  ▼                  ▼
  ┌─────────────────────────────────────────────────┐
  │                   /public                       │
  │                                                 │
  │   favicon.ico ............. 16+32+48 combined   │
  │   favicon-16x16.png ....... browser tab         │
  │   favicon-32x32.png ....... browser tab (2x)    │
  │   favicon-48x48.png ....... windows pinning     │
  │   apple-touch-icon.png .... iOS home screen     │
  │   android-chrome-192.png .. android / PWA       │
  │   android-chrome-512.png .. android splash      │
  │   site.webmanifest ........ PWA manifest        │
  │                                                 │
  └─────────────────────────────────────────────────┘
```

---

## Supported Projects

```
  ⚡  React + Vite           ──▶  injects into index.html (root)
  ⚛   Create React App       ──▶  injects into public/index.html
  ▲   Next.js App Router     ──▶  injects into app/layout.tsx metadata
  ▲   Next.js Pages Router   ──▶  injects into pages/_document.tsx Head
```

**Monorepo support** — scans root, direct subfolders, `apps/*`, and `packages/*`:

```
  my-monorepo/
  ├── apps/
  │   ├── web/          ← ✅ detected
  │   ├── docs/         ← ✅ detected
  │   └── dashboard/    ← ✅ detected
  ├── packages/
  │   └── ui/           ← ✅ detected
  └── package.json
```

---

## Generated Files

```
  public/
  ├── favicon.ico                   ← multi-size (16 + 32 + 48)
  ├── favicon-16x16.png             ← browser tab
  ├── favicon-32x32.png             ← browser tab (retina)
  ├── favicon-48x48.png             ← windows site pinning
  ├── apple-touch-icon.png          ← iOS home screen (180×180)
  ├── android-chrome-192x192.png    ← android / PWA
  ├── android-chrome-512x512.png    ← android / PWA splash
  └── site.webmanifest              ← PWA manifest
```

---

## CLI Preview

```
  ╔══════════════════════════════════════════════╗
  ║                                              ║
  ║   🎨  Favicon CLI  v1.0.0                   ║
  ║                                              ║
  ║   Detect → Choose → Generate → Inject       ║
  ║                                              ║
  ╚══════════════════════════════════════════════╝

  ? What would you like to do?
  ❯ 🎨  Set favicons            — interactive setup
    🔍  Detect project          — check project type
    🗑️   Remove generated files  — clean up
    ────────────────────────────────────────────
    ⚙️   Help
       Exit
```

```
  STEP 1/4   Detect Project
  ──────────────────────────────────────────────
  ✔ Detected ▲  Next.js (App Router)

  STEP 2/4   Select Source Image
  ──────────────────────────────────────────────
  ? Pick an image to use as favicon:
  ❯ 🖼️  public/logo.png [PNG]
    🖼️  src/assets/icon.svg [SVG]
    🖼️  assets/brand.jpg [JPG]

  STEP 3/4   Generate Favicons
  ──────────────────────────────────────────────
  ✔ Generated 8 files successfully

  STEP 4/4   Inject References
  ──────────────────────────────────────────────
  ✔ Favicon references injected

  ╔══════════════════════════════════════════════╗
  ║   ✦ ── FAVICONS SET SUCCESSFULLY ── ✦       ║
  ║                                              ║
  ║   ⚡ Duration:     1.24s                     ║
  ║   ▲  Project:      Next.js (App Router)      ║
  ║   🖼️  Source:       logo.png                  ║
  ║   📦 Output:       /public                   ║
  ║   💉 Injected:     Yes                       ║
  ║                                              ║
  ║   Restart your dev server to see changes.    ║
  ╚══════════════════════════════════════════════╝
```

---

## Notes

- Re-running `favicli set` updates existing generated files.
- Injection is replacement-based, so favicon references are updated on reruns.
- Use a **square image** (1:1 ratio) at least **512×512px** for best results.
- Supported source formats: `.png` `.jpg` `.jpeg` `.webp` `.svg`

---

## Repository

- **GitHub:** https://github.com/sheikhmuhammadzain/favicli
- **Issues:** https://github.com/sheikhmuhammadzain/favicli/issues

---

<div align="center">

```
  Made with ❤️ by Zain Afzal

  If favicli saved you time, give it a ⭐ on GitHub
```

**MIT License**

</div>
```