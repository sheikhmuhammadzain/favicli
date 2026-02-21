

```markdown
<div align="center">

<br />

<img src="https://raw.githubusercontent.com/yourusername/favicli/main/assets/banner.png" alt="favicli banner" width="700" />

<br />
<br />

# 🎨 favicli

**One command to set up favicons for any React & Next.js project.**

Detect your project → Pick an image → Generate all sizes → Auto-inject references.

<br />

[![npm version](https://img.shields.io/npm/v/favicli?style=for-the-badge&logo=npm&logoColor=white&labelColor=CB3837&color=CB3837)](https://www.npmjs.com/package/favicli)
[![downloads](https://img.shields.io/npm/dm/favicli?style=for-the-badge&logo=npm&logoColor=white&labelColor=1a1a2e&color=6C63FF)](https://www.npmjs.com/package/favicli)
[![license](https://img.shields.io/npm/l/favicli?style=for-the-badge&labelColor=1a1a2e&color=00E676)](./LICENSE)
[![node](https://img.shields.io/node/v/favicli?style=for-the-badge&logo=node.js&logoColor=white&labelColor=1a1a2e&color=339933)](https://nodejs.org)

<br />

<p>
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-commands">Commands</a> •
  <a href="#-supported-projects">Supported Projects</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-contributing">Contributing</a>
</p>

<br />

</div>

---

<br />

## ⚡ Quick Start

No install needed — just run it inside any React or Next.js project:

```bash
npx favicli
```

Or with an image directly:

```bash
npx favicli set logo.png
```

That's it. All favicon sizes are generated and injected automatically.

<br />

---

<br />

## ✨ Features

<table>
<tr>
<td width="60">🔍</td>
<td><strong>Auto-Detection</strong></td>
<td>Automatically detects React (CRA, Vite) and Next.js (App Router, Pages Router) projects</td>
</tr>
<tr>
<td>🖼️</td>
<td><strong>Image Scanning</strong></td>
<td>Finds all images in your project and lets you pick one interactively</td>
</tr>
<tr>
<td>📐</td>
<td><strong>All Sizes Generated</strong></td>
<td>Creates 16×16, 32×32, 48×48, 180×180, 192×192, 512×512, and <code>.ico</code></td>
</tr>
<tr>
<td>💉</td>
<td><strong>Auto-Injection</strong></td>
<td>Injects favicon references into <code>index.html</code>, <code>layout.tsx</code>, or <code>_document.tsx</code> automatically</td>
</tr>
<tr>
<td>📋</td>
<td><strong>Web Manifest</strong></td>
<td>Generates <code>site.webmanifest</code> for PWA support out of the box</td>
</tr>
<tr>
<td>🏢</td>
<td><strong>Monorepo Support</strong></td>
<td>Scans <code>apps/*</code> and <code>packages/*</code> in monorepo setups</td>
</tr>
<tr>
<td>🎨</td>
<td><strong>Beautiful UI</strong></td>
<td>Rich terminal UI with colors, gradients, tables, progress steps, and spinners</td>
</tr>
<tr>
<td>🗑️</td>
<td><strong>Clean Removal</strong></td>
<td>Remove all generated favicon files with a single command</td>
</tr>
</table>

<br />

---

<br />

## 📸 Preview

<div align="center">

### Home Screen

```
 ███████╗ █████╗ ██╗   ██╗██╗ ██████╗██╗     ██╗
 ██╔════╝██╔══██╗██║   ██║██║██╔════╝██║     ██║
 █████╗  ███████║██║   ██║██║██║     ██║     ██║
 ██╔══╝  ██╔══██║╚██╗ ██╔╝██║██║     ██║     ██║
 ██║     ██║  ██║ ╚████╔╝ ██║╚██████╗███████╗██║
 ╚═╝     ╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝╚═╝

 ╔══════════════════════════════════════════════╗
 ║  🎨  Favicon CLI  v1.0.0                    ║
 ║                                              ║
 ║  Detect → Choose → Generate → Inject        ║
 ║                                              ║
 ║  One command to set up favicons for any      ║
 ║  React/Next.js project.                      ║
 ╚══════════════════════════════════════════════╝

 ? What would you like to do?
 ❯ 🎨  Set favicons            — interactive setup
   🔍  Detect project          — check project type
   🗑️   Remove generated files  — clean up
   ──────────────────────────────────────────────
   ⚙️   Help
      Exit
```

### Generated Files Table

```
  ┌────────────────────────────────┬──────────┬──────────────┬──────────┐
  │ File                           │ Size     │ Dimensions   │ Status   │
  ├────────────────────────────────┼──────────┼──────────────┼──────────┤
  │ 🟢 favicon-16x16.png          │ 0.4 KB   │ 16×16        │ ✓ done   │
  │ 🟢 favicon-32x32.png          │ 0.9 KB   │ 32×32        │ ✓ done   │
  │ 🟢 favicon-48x48.png          │ 1.4 KB   │ 48×48        │ ✓ done   │
  │ 🟢 apple-touch-icon.png       │ 7.2 KB   │ 180×180      │ ✓ done   │
  │ 🟢 android-chrome-192x192.png │ 8.1 KB   │ 192×192      │ ✓ done   │
  │ 🟢 android-chrome-512x512.png │ 24.3 KB  │ 512×512      │ ✓ done   │
  │ 🔷 favicon.ico                │ 5.3 KB   │ multi        │ ✓ done   │
  │ 📋 site.webmanifest           │ 0.3 KB   │ -            │ ✓ done   │
  └────────────────────────────────┴──────────┴──────────────┴──────────┘
```

### Success Summary

```
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

</div>

<br />

---

<br />

## 📦 Installation

### Use directly with npx (recommended)

```bash
npx favicli
```

### Or install globally

```bash
npm install -g favicli
```

### Or as a dev dependency

```bash
npm install -D favicli
```

<br />

---

<br />

## 🛠️ Commands

### `favicli set [image]`

Set a favicon from an image file. If no image is provided, it will scan your project and let you pick one interactively.

```bash
# Interactive mode — scans for images and lets you pick
favicli set

# Direct mode — use a specific image
favicli set logo.png

# Specify project directory
favicli set -d ./apps/web

# Use a specific image in a specific project
favicli set ./assets/icon.png -d ./apps/web

# Generate files only, skip auto-injection
favicli set logo.png --no-inject
```

#### Options

| Option          | Description                          | Default     |
| --------------- | ------------------------------------ | ----------- |
| `-d, --dir`     | Project directory                    | Current dir |
| `--no-inject`   | Skip auto-injecting into project files | `false`   |

---

### `favicli detect`

Detect the project type and show details.

```bash
favicli detect

# Check a specific directory
favicli detect -d ./apps/web
```

**Output:**

```
  ╭──────────────────────────────────────────╮
  │  ✅  Project Detection Result            │
  │                                          │
  │  Type:       ▲  Next.js (App Router)     │
  │  Directory:  /Users/you/my-app           │
  │  Status:     ✓ Ready to use              │
  │                                          │
  │  Details:                                │
  │  ├── appDir: /Users/you/my-app/app       │
  │  ├── publicDir: /Users/you/my-app/public │
  │  └── useSrc: false                       │
  ╰──────────────────────────────────────────╯
```

---

### `favicli remove`

Remove all generated favicon files from the project.

```bash
favicli remove

# Remove from a specific project
favicli remove -d ./apps/web
```

It shows you the files that will be removed with their sizes and asks for confirmation before deleting.

<br />

---

<br />

## 🏗️ Supported Projects

<table>
<thead>
<tr>
<th>Project Type</th>
<th>Favicon Location</th>
<th>Auto-Injection Target</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>⚡ React + Vite</strong></td>
<td><code>/public</code></td>
<td><code>index.html</code> (root)</td>
</tr>
<tr>
<td><strong>⚛ Create React App</strong></td>
<td><code>/public</code></td>
<td><code>public/index.html</code></td>
</tr>
<tr>
<td><strong>▲ Next.js (App Router)</strong></td>
<td><code>/public</code></td>
<td><code>app/layout.tsx</code> — metadata icons</td>
</tr>
<tr>
<td><strong>▲ Next.js (Pages Router)</strong></td>
<td><code>/public</code></td>
<td><code>pages/_document.tsx</code> — Head tags</td>
</tr>
</tbody>
</table>

> **Monorepo?** No problem. Run `favicli set -d .` from the root — it scans `apps/*` and `packages/*` automatically and lets you pick a project.

<br />

---

<br />

## 🔧 How It Works

```
                    ┌─────────────┐
                    │  Your Image │
                    │  (any size) │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   favicli   │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   ┌──────▼──────┐ ┌──────▼──────┐ ┌───────▼──────┐
   │   Detect    │ │  Generate   │ │    Inject    │
   │   Project   │ │  All Sizes  │ │  References  │
   └──────┬──────┘ └──────┬──────┘ └───────┬──────┘
          │                │                │
          ▼                ▼                ▼
   ┌─────────────────────────────────────────────┐
   │              /public                        │
   │                                             │
   │  favicon.ico ........... 16+32+48 combined  │
   │  favicon-16x16.png ..... browser tab        │
   │  favicon-32x32.png ..... browser tab (2x)   │
   │  favicon-48x48.png ..... Windows pinning    │
   │  apple-touch-icon.png .. iOS home screen    │
   │  android-chrome-192.png  Android / PWA      │
   │  android-chrome-512.png  Android splash     │
   │  site.webmanifest ...... PWA manifest       │
   │                                             │
   └─────────────────────────────────────────────┘
```

### Step-by-step

1. **Detect** — Reads `package.json` to identify the project type (React CRA, Vite, Next.js App/Pages Router)
2. **Scan** — Walks the directory tree (up to 3 levels deep) to find `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg` images
3. **Generate** — Uses [sharp](https://sharp.pixelplumbing.com/) to resize the source image into all required favicon sizes
4. **ICO** — Combines 16×16, 32×32, 48×48 PNGs into a single `favicon.ico`
5. **Manifest** — Creates `site.webmanifest` with PWA icon references
6. **Inject** — Modifies the appropriate project file to add `<link>` tags or Next.js metadata

<br />

---

<br />

## 🖼️ Supported Image Formats

| Format | Extension | Notes                          |
| ------ | --------- | ------------------------------ |
| PNG    | `.png`    | Best quality, recommended      |
| JPEG   | `.jpg` `.jpeg` | Good for photos           |
| WebP   | `.webp`   | Modern format, great quality   |
| SVG    | `.svg`    | Vector, scales perfectly       |

> 💡 **Tip:** Use a square image (1:1 ratio) at least **512×512px** for the best results.

<br />

---

<br />

## 📁 Generated Files

| File                         | Size      | Purpose                     |
| ---------------------------- | --------- | --------------------------- |
| `favicon.ico`                | 16+32+48  | Universal browser favicon   |
| `favicon-16x16.png`          | 16×16     | Browser tab                 |
| `favicon-32x32.png`          | 32×32     | Browser tab (retina)        |
| `favicon-48x48.png`          | 48×48     | Windows site pinning        |
| `apple-touch-icon.png`       | 180×180   | iOS home screen icon        |
| `android-chrome-192x192.png` | 192×192   | Android / PWA icon          |
| `android-chrome-512x512.png` | 512×512   | Android / PWA splash screen |
| `site.webmanifest`           | —         | PWA manifest file           |

<br />

---

<br />

## 🏢 Monorepo Usage

favicli works seamlessly with monorepos. Run it from the root and it will scan for projects:

```bash
# From monorepo root
npx favicli set -d .

# It will find and list projects:
# ? Select a project:
# ❯ apps/web (Next.js App Router)
#   apps/docs (Next.js Pages Router)
#   apps/dashboard (React + Vite)
```

### Supported monorepo structures

```
my-monorepo/
├── apps/
│   ├── web/          ← ✅ detected
│   ├── docs/         ← ✅ detected
│   └── dashboard/    ← ✅ detected
├── packages/
│   └── ui/           ← ✅ detected (if it's a React project)
└── package.json
```

<br />

---

<br />

## 🔗 What Gets Injected

### React (Vite / CRA) — `index.html`

```html
<head>
  <!-- favicli injected -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="theme-color" content="#ffffff" />
</head>
```

### Next.js App Router — `app/layout.tsx`

```tsx
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};
```

### Next.js Pages Router — `pages/_document.tsx`

```tsx
<Head>
  <link rel="icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="theme-color" content="#ffffff" />
</Head>
```

<br />

---

<br />

## 🤔 FAQ

<details>
<summary><strong>Does it replace existing favicons?</strong></summary>

<br />

Yes. It removes existing `<link rel="icon">`, `<link rel="apple-touch-icon">`, and `<link rel="manifest">` tags before injecting new ones. Existing favicon files in `/public` with the same names will be overwritten.

</details>

<details>
<summary><strong>What if my image isn't square?</strong></summary>

<br />

favicli uses `sharp` with `fit: "cover"` and `position: "center"` — it will crop the image to a square from the center. For best results, use a square image.

</details>

<details>
<summary><strong>Can I use it without auto-injection?</strong></summary>

<br />

Yes! Use the `--no-inject` flag:

```bash
npx favicli set logo.png --no-inject
```

This will generate all files in `/public` without modifying any project files.

</details>

<details>
<summary><strong>Does it work with TypeScript?</strong></summary>

<br />

Absolutely. It detects `.tsx` and `.ts` files and generates TypeScript-compatible code (including `Metadata` type imports for Next.js App Router).

</details>

<details>
<summary><strong>Can I undo the changes?</strong></summary>

<br />

Run `favicli remove` to delete all generated files. For the injected code, use `git checkout` or manually remove the added lines.

</details>

<details>
<summary><strong>Does it support SVG favicons?</strong></summary>

<br />

SVG is supported as a **source image**. It will be converted to PNG/ICO for maximum browser compatibility. Native SVG favicons are not yet universally supported by browsers.

</details>

<br />

---

<br />

## 📋 Requirements

- **Node.js** `>=14.0.0`
- A **React** or **Next.js** project
- A source image (`.png`, `.jpg`, `.jpeg`, `.webp`, or `.svg`)

<br />

---

<br />

## 🧰 Tech Stack

| Package                                                              | Purpose              |
| -------------------------------------------------------------------- | -------------------- |
| [commander](https://www.npmjs.com/package/commander)                 | Command parsing      |
| [inquirer](https://www.npmjs.com/package/inquirer)                   | Interactive prompts  |
| [sharp](https://www.npmjs.com/package/sharp)                         | Image resizing       |
| [png-to-ico](https://www.npmjs.com/package/png-to-ico)              | ICO generation       |
| [chalk](https://www.npmjs.com/package/chalk)                         | Terminal colors      |
| [ora](https://www.npmjs.com/package/ora)                             | Spinners             |
| [boxen](https://www.npmjs.com/package/boxen)                         | Boxes                |
| [cli-table3](https://www.npmjs.com/package/cli-table3)               | Tables               |
| [figlet](https://www.npmjs.com/package/figlet)                       | ASCII art banner     |
| [gradient-string](https://www.npmjs.com/package/gradient-string)     | Gradient text        |
| [cheerio](https://www.npmjs.com/package/cheerio)                     | HTML parsing         |
| [fs-extra](https://www.npmjs.com/package/fs-extra)                   | File operations      |

<br />

---

<br />

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork & clone the repo
git clone https://github.com/yourusername/favicli.git
cd favicli

# 2. Install dependencies
npm install

# 3. Link for local testing
npm link

# 4. Make your changes and test
favicli set

# 5. Unlink when done
npm unlink -g favicli
```

### Development commands

```bash
# Test in a React project
cd /path/to/react-project && favicli set

# Test detection
favicli detect -d /path/to/project

# Test removal
favicli remove -d /path/to/project
```

<br />

---

<br />

## 🗺️ Roadmap

- [ ] 🎨 Custom theme color extraction from source image
- [ ] 📱 Generate Open Graph images (`og-image.png`)
- [ ] ⚙️ Config file support (`.faviclirc`)
- [ ] 🔄 Watch mode — auto-regenerate on image change
- [ ] 🌐 Svelte / Vue / Astro support
- [ ] 🧩 Plugin system for custom sizes
- [ ] 📝 Interactive theme color picker
- [ ] 🖥️ Electron app icon generation

<br />

---

<br />

## 📄 License

MIT © [Your Name](https://github.com/yourusername)

<br />

---

<div align="center">

<br />

**If favicli saved you time, consider giving it a ⭐**

<br />

Made with ❤️ and a mass quantity of favicons

<br />

[Report Bug](https://github.com/yourusername/favicli/issues) · [Request Feature](https://github.com/yourusername/favicli/issues) · [npm](https://www.npmjs.com/package/favicli)

<br />

</div>
```

---

### Bonus: Create the `assets/` folder for the banner

```bash
mkdir assets
```

Create a banner image (`assets/banner.png`) for the top of your README. You can use:

- **[Canva](https://canva.com)** — Design a 1400×400 banner
- **[Figma](https://figma.com)** — Professional look
- **[Carbon](https://carbon.now.sh)** — Screenshot of your CLI running

A good banner should show:
- The CLI name "favicli" in large text
- A terminal screenshot or icon
- The tagline "Favicon generator for React & Next.js"
- A gradient purple → cyan background matching your CLI theme

> Replace all `yourusername` references with your actual GitHub/npm username before publishing.