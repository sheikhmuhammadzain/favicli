
```markdown
<div align="center">

```
 ███████╗ █████╗ ██╗   ██╗██╗ ██████╗██╗     ██╗
 ██╔════╝██╔══██╗██║   ██║██║██╔════╝██║     ██║
 █████╗  ███████║██║   ██║██║██║     ██║     ██║
 ██╔══╝  ██╔══██║╚██╗ ██╔╝██║██║     ██║     ██║
 ██║     ██║  ██║ ╚████╔╝ ██║╚██████╗███████╗██║
 ╚═╝     ╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝╚═╝
```

# favicli

One command to set up favicons for React and Next.js projects.

**Detect** → **Choose** → **Generate** → **Inject**

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

## CLI Preview

```
 ███████╗ █████╗ ██╗   ██╗██╗ ██████╗██╗     ██╗
 ██╔════╝██╔══██╗██║   ██║██║██╔════╝██║     ██║
 █████╗  ███████║██║   ██║██║██║     ██║     ██║
 ██╔══╝  ██╔══██║╚██╗ ██╔╝██║██║     ██║     ██║
 ██║     ██║  ██║ ╚████╔╝ ██║╚██████╗███████╗██║
 ╚═╝     ╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝╚═╝

 ╔══════════════════════════════════════════════════════════╗
 ║                                                          ║
 ║   🎨  Favicon CLI  v1.0.0                               ║
 ║                                                          ║
 ║   Detect → Choose → Generate → Inject                   ║
 ║                                                          ║
 ║   One command to set up favicons for any                 ║
 ║   React/Next.js project.                                 ║
 ║                                                          ║
 ║   Created by Zain Afzal • zainafzal.dev                  ║
 ║                                                          ║
 ╚══════════════════════════════════════════════════════════╝

 ? What would you like to do?
 ❯ 🎨  Set favicons            — interactive setup
   🔍  Detect project          — check project type
   🗑️   Remove generated files  — clean up
   ────────────────────────────────────────────────
   ⚙️   Help
      Exit
```

```
  ┌─ STEP 1/4 ─ Detect Project ──────────────────────────┐
  │                                                       │
  │  ✔ Detected ▲  Next.js (App Router)                  │
  │  │  📁  Directory:  /Users/you/my-app                 │
  │  │  📦  Public Dir: /Users/you/my-app/public          │
  │                                                       │
  ├─ STEP 2/4 ─ Select Source Image ──────────────────────┤
  │                                                       │
  │  🔍  Found 3 image(s) in the project                  │
  │                                                       │
  │  ? Pick an image to use as favicon:                   │
  │  ❯ 🖼️  public/logo.png [PNG]                          │
  │    🖼️  src/assets/icon.svg [SVG]                      │
  │    🖼️  assets/brand.jpg [JPG]                         │
  │                                                       │
  │  │  🖼️   Source:  logo.png                             │
  │  │  📄  Size:    24.3 KB                              │
  │  │  🎯  Format:  PNG                                  │
  │                                                       │
  ├─ STEP 3/4 ─ Generate Favicons ────────────────────────┤
  │                                                       │
  │  ✔ Generated 8 files successfully                     │
  │                                                       │
  │  ┌──────────────────────────┬────────┬──────────┬─────┐
  │  │ File                     │ Size   │ Dims     │     │
  │  ├──────────────────────────┼────────┼──────────┼─────┤
  │  │ 🟢 favicon-16x16.png    │ 0.4 KB │ 16×16    │ ✓   │
  │  │ 🟢 favicon-32x32.png    │ 0.9 KB │ 32×32    │ ✓   │
  │  │ 🟢 favicon-48x48.png    │ 1.4 KB │ 48×48    │ ✓   │
  │  │ 🟢 apple-touch-icon.png │ 7.2 KB │ 180×180  │ ✓   │
  │  │ 🟢 android-chrome-192   │ 8.1 KB │ 192×192  │ ✓   │
  │  │ 🟢 android-chrome-512   │ 24 KB  │ 512×512  │ ✓   │
  │  │ 🔷 favicon.ico          │ 5.3 KB │ multi    │ ✓   │
  │  │ 📋 site.webmanifest     │ 0.3 KB │ —        │ ✓   │
  │  └──────────────────────────┴────────┴──────────┴─────┘
  │                                                       │
  ├─ STEP 4/4 ─ Inject References ───────────────────────┤
  │                                                       │
  │  ✔ References injected into project files             │
  │  │  💉  Modified: app/layout.tsx                      │
  │                                                       │
  └───────────────────────────────────────────────────────┘

  ╔══════════════════════════════════════════════════════╗
  ║                                                      ║
  ║    ✦ ── FAVICONS SET SUCCESSFULLY ── ✦               ║
  ║                                                      ║
  ║    ⚡ Duration:     1.24s                             ║
  ║    ▲  Project:      Next.js (App Router)              ║
  ║    🖼️  Source:       logo.png                          ║
  ║    📦 Output:       /public                           ║
  ║    💉 Injected:     Yes                               ║
  ║                                                      ║
  ║    Restart your dev server to see the changes.       ║
  ║                                                      ║
  ╚══════════════════════════════════════════════════════╝
```

---

## Commands

```
┌──────────────────┬──────────────────────────────────────┐
│  Command         │  Description                         │
├──────────────────┼──────────────────────────────────────┤
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

```
┌────────────────────┬──────────────────────────────────────┐
│  Option            │  Description                         │
├────────────────────┼──────────────────────────────────────┤
│  -d, --dir <path>  │  Target project directory            │
│  --no-inject       │  Generate files only, skip injection │
└────────────────────┴──────────────────────────────────────┘
```

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

```
  ╭──────────────────────────────────────────────╮
  │                                              │
  │  ✅  Project Detection Result                │
  │                                              │
  │    Type:       ▲  Next.js (App Router)       │
  │    Directory:  /Users/you/my-app             │
  │    Status:     ✓ Ready to use                │
  │                                              │
  │    Details:                                  │
  │    ├── appDir:    /Users/you/my-app/app      │
  │    ├── publicDir: /Users/you/my-app/public   │
  │    └── useSrc:    false                      │
  │                                              │
  ╰──────────────────────────────────────────────╯
```

### `favicli remove`

Removes generated favicon files from `public/`.

```bash
favicli remove
favicli remove -d ./apps/web
```

```
  🗑️   Remove Favicons
  ────────────────────────────────────────────────

  The following 8 files will be removed:

  ├── favicon.ico                   (5.3 KB)
  ├── favicon-16x16.png             (0.4 KB)
  ├── favicon-32x32.png             (0.9 KB)
  ├── favicon-48x48.png             (1.4 KB)
  ├── apple-touch-icon.png          (7.2 KB)
  ├── android-chrome-192x192.png    (8.1 KB)
  ├── android-chrome-512x512.png    (24 KB)
  └── site.webmanifest              (0.3 KB)

  ? Permanently delete these files? Yes

  ╭──────────────────────────────────────────────╮
  │  ✅  Removed 8 files                        │
  ╰──────────────────────────────────────────────╯
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

## Notes

```
  ┌──────────────────────────────────────────────────────────┐
  │                                                          │
  │  • Re-running favicli set updates existing files         │
  │  • Injection is replacement-based, safe to rerun         │
  │  • Use a square image (1:1) at least 512×512px           │
  │  • Supported: .png  .jpg  .jpeg  .webp  .svg            │
  │                                                          │
  └──────────────────────────────────────────────────────────┘
```

---

## Repository

- **GitHub:** https://github.com/sheikhmuhammadzain/favicli
- **Issues:** https://github.com/sheikhmuhammadzain/favicli/issues

---

<div align="center">

```
  ╔══════════════════════════════════════════╗
  ║                                          ║
  ║   Made with ❤️  by Zain Afzal             ║
  ║   zainafzal.dev                          ║
  ║                                          ║
  ║   If favicli saved you time,             ║
  ║   give it a ⭐ on GitHub                  ║
  ║                                          ║
  ╚══════════════════════════════════════════╝
```

**MIT License**

</div>

```