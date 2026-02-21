# favicli

One command to set up favicons for React and Next.js projects.

Detect project -> choose image -> generate all favicon sizes -> inject references.

[![npm version](https://img.shields.io/npm/v/favicli)](https://www.npmjs.com/package/favicli)
[![npm downloads](https://img.shields.io/npm/dm/favicli)](https://www.npmjs.com/package/favicli)
[![license](https://img.shields.io/npm/l/favicli)](./LICENSE)

## Author

- Name: Zain Afzal
- Website: https://zainafzal.dev
- Email: zainsheikh3462@gmail.com

## Installation

```bash
npm install -g favicli
```

Or run without global install:

```bash
npx favicli
```

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

## Commands

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

## Supported Projects

- React + Vite
- Create React App
- Next.js App Router
- Next.js Pages Router

Monorepo support:

- Scans root, direct subfolders, `apps/*`, and `packages/*`

## Generated Files

Inside `public/`:

- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `favicon-48x48.png`
- `apple-touch-icon.png`
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `site.webmanifest`

## Notes

- Re-running `favicli set` updates existing generated files.
- Injection is replacement-based, so favicon references are updated on reruns.

## Repository

- GitHub: https://github.com/sheikhmuhammadzain/favicli
- Issues: https://github.com/sheikhmuhammadzain/favicli/issues

## License

MIT
