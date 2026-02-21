

# 🎨 Favicon CLI — Full Build Guide

Let's build a CLI that auto-detects React/Next.js projects and sets favicons from any image.

## Project Setup

```bash
mkdir favicli
cd favicli
npm init -y
mkdir bin src
```

### Install Dependencies

```bash
npm install commander chalk ora inquirer sharp png-to-ico glob fs-extra cheerio
```

---

## Package.json

```json
{
  "name": "favicli",
  "version": "1.0.0",
  "description": "Auto-set favicons in React & Next.js projects from any image",
  "bin": {
    "favicli": "./bin/index.js"
  },
  "files": [
    "bin",
    "src"
  ],
  "keywords": ["favicon", "cli", "react", "nextjs", "icon"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "chalk": "^4.1.2",
    "cheerio": "^1.0.0",
    "commander": "^12.1.0",
    "fs-extra": "^11.2.0",
    "glob": "^10.3.10",
    "inquirer": "^8.2.6",
    "ora": "^5.4.1",
    "png-to-ico": "^2.1.8",
    "sharp": "^0.33.2"
  }
}
```

> ⚠️ Using chalk v4, ora v5, inquirer v8 (CommonJS versions) for easier compatibility.

---

## File Structure

```
favicli/
├── bin/
│   └── index.js            ← CLI entry point
├── src/
│   ├── detect.js           ← Detect React / Next.js project
│   ├── generate.js         ← Generate all favicon sizes
│   ├── inject.js           ← Auto-inject into project files
│   └── constants.js        ← Favicon sizes & config
├── package.json
└── README.md
```

---

## 1. `src/constants.js` — Config & Sizes

```js
const FAVICON_SIZES = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-48x48.png", size: 48 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
];

const SUPPORTED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".svg"];

const PROJECT_TYPES = {
  NEXT_APP: "next-app",        // Next.js App Router
  NEXT_PAGES: "next-pages",    // Next.js Pages Router
  REACT_VITE: "react-vite",    // React + Vite
  REACT_CRA: "react-cra",     // Create React App
  UNKNOWN: "unknown",
};

module.exports = { FAVICON_SIZES, SUPPORTED_EXTENSIONS, PROJECT_TYPES };
```

---

## 2. `src/detect.js` — Auto-Detect Project Type

```js
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const { PROJECT_TYPES } = require("./constants");

function detectProject(targetDir) {
  const packageJsonPath = path.join(targetDir, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    return { type: PROJECT_TYPES.UNKNOWN, details: null };
  }

  const pkg = fs.readJsonSync(packageJsonPath);
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  // --- Next.js ---
  if (allDeps["next"]) {
    // Check for App Router (app/ directory)
    const appDir = path.join(targetDir, "app");
    const srcAppDir = path.join(targetDir, "src", "app");

    if (fs.existsSync(appDir) || fs.existsSync(srcAppDir)) {
      const actualAppDir = fs.existsSync(srcAppDir) ? srcAppDir : appDir;
      return {
        type: PROJECT_TYPES.NEXT_APP,
        details: {
          appDir: actualAppDir,
          publicDir: path.join(targetDir, "public"),
          useSrc: fs.existsSync(srcAppDir),
        },
      };
    }

    // Pages Router
    return {
      type: PROJECT_TYPES.NEXT_PAGES,
      details: {
        pagesDir: fs.existsSync(path.join(targetDir, "src", "pages"))
          ? path.join(targetDir, "src", "pages")
          : path.join(targetDir, "pages"),
        publicDir: path.join(targetDir, "public"),
      },
    };
  }

  // --- React + Vite ---
  if (allDeps["react"] && allDeps["vite"]) {
    return {
      type: PROJECT_TYPES.REACT_VITE,
      details: {
        publicDir: path.join(targetDir, "public"),
        indexHtml: path.join(targetDir, "index.html"), // Vite has index.html at root
      },
    };
  }

  // --- Create React App ---
  if (allDeps["react"] && allDeps["react-scripts"]) {
    return {
      type: PROJECT_TYPES.REACT_CRA,
      details: {
        publicDir: path.join(targetDir, "public"),
        indexHtml: path.join(targetDir, "public", "index.html"),
      },
    };
  }

  // --- Plain React (other bundlers) ---
  if (allDeps["react"]) {
    return {
      type: PROJECT_TYPES.REACT_VITE, // treat similarly
      details: {
        publicDir: path.join(targetDir, "public"),
        indexHtml: path.join(targetDir, "index.html"),
      },
    };
  }

  return { type: PROJECT_TYPES.UNKNOWN, details: null };
}

function getProjectLabel(type) {
  const labels = {
    [PROJECT_TYPES.NEXT_APP]: "Next.js (App Router)",
    [PROJECT_TYPES.NEXT_PAGES]: "Next.js (Pages Router)",
    [PROJECT_TYPES.REACT_VITE]: "React + Vite",
    [PROJECT_TYPES.REACT_CRA]: "Create React App",
    [PROJECT_TYPES.UNKNOWN]: "Unknown",
  };
  return labels[type] || "Unknown";
}

module.exports = { detectProject, getProjectLabel };
```

---

## 3. `src/generate.js` — Generate All Favicon Sizes + ICO

```js
const sharp = require("sharp");
const pngToIco = require("png-to-ico");
const path = require("path");
const fs = require("fs-extra");
const { FAVICON_SIZES } = require("./constants");

async function generateFavicons(inputImage, outputDir) {
  await fs.ensureDir(outputDir);

  const results = [];

  // Generate all PNG sizes
  for (const { name, size } of FAVICON_SIZES) {
    const outputPath = path.join(outputDir, name);

    await sharp(inputImage)
      .resize(size, size, {
        fit: "cover",
        position: "center",
      })
      .png({ quality: 100 })
      .toFile(outputPath);

    results.push({ name, size, path: outputPath });
  }

  // Generate favicon.ico (contains 16, 32, 48)
  const icoSources = [16, 32, 48].map((size) =>
    path.join(outputDir, `favicon-${size}x${size}.png`)
  );

  const icoBuffer = await pngToIco(icoSources);
  const icoPath = path.join(outputDir, "favicon.ico");
  await fs.writeFile(icoPath, icoBuffer);
  results.push({ name: "favicon.ico", size: "multi", path: icoPath });

  // Generate site.webmanifest
  const manifest = {
    name: "",
    short_name: "",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
  };

  const manifestPath = path.join(outputDir, "site.webmanifest");
  await fs.writeJson(manifestPath, manifest, { spaces: 2 });
  results.push({ name: "site.webmanifest", size: "-", path: manifestPath });

  return results;
}

module.exports = { generateFavicons };
```

---

## 4. `src/inject.js` — Auto-Inject Favicons Into Project

```js
const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");
const chalk = require("chalk");
const { PROJECT_TYPES } = require("./constants");

// ─── HTML-based projects (CRA, Vite) ───
function injectIntoHtml(indexHtmlPath) {
  if (!fs.existsSync(indexHtmlPath)) {
    console.log(chalk.yellow(`⚠ index.html not found at ${indexHtmlPath}`));
    return false;
  }

  const html = fs.readFileSync(indexHtmlPath, "utf-8");
  const $ = cheerio.load(html, { decodeEntities: false });

  // Remove existing favicon-related tags
  $('link[rel="icon"]').remove();
  $('link[rel="shortcut icon"]').remove();
  $('link[rel="apple-touch-icon"]').remove();
  $('link[rel="manifest"]').remove();
  $('meta[name="theme-color"]').remove();

  // Add new favicon tags
  const faviconTags = [
    '<link rel="icon" type="image/x-icon" href="/favicon.ico" />',
    '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />',
    '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />',
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />',
    '<link rel="manifest" href="/site.webmanifest" />',
    '<meta name="theme-color" content="#ffffff" />',
  ];

  faviconTags.forEach((tag) => $("head").append(`\n    ${tag}`));

  fs.writeFileSync(indexHtmlPath, $.html());
  return true;
}

// ─── Next.js App Router (uses metadata API, file-based) ───
function injectIntoNextApp(appDir) {
  // In Next.js App Router, favicons are file-based
  // Just need to place them in /app directory OR /public
  // Next.js auto-detects: icon.png, apple-icon.png in /app

  const layoutFiles = ["layout.tsx", "layout.jsx", "layout.js"];
  let layoutPath = null;

  for (const file of layoutFiles) {
    const fullPath = path.join(appDir, file);
    if (fs.existsSync(fullPath)) {
      layoutPath = fullPath;
      break;
    }
  }

  if (!layoutPath) {
    console.log(chalk.yellow("⚠ No layout file found in app directory"));
    return false;
  }

  let content = fs.readFileSync(layoutPath, "utf-8");

  // Check if metadata already has icons
  if (content.includes("icons")) {
    console.log(chalk.yellow("⚠ Metadata 'icons' already exists in layout. Skipping injection."));
    console.log(chalk.dim("  You can manually update the icons in your metadata object."));
    return true;
  }

  // Try to inject into existing metadata export
  const metadataRegex = /export\s+const\s+metadata\s*(?::\s*Metadata\s*)?=\s*\{/;

  if (metadataRegex.test(content)) {
    // Add icons to existing metadata
    const iconsConfig = `
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
  manifest: "/site.webmanifest",`;

    content = content.replace(metadataRegex, (match) => {
      return `${match}${iconsConfig}`;
    });

    fs.writeFileSync(layoutPath, content);
    return true;
  }

  // No metadata export found — add one
  const isTypeScript = layoutPath.endsWith(".tsx") || layoutPath.endsWith(".ts");

  const metadataBlock = isTypeScript
    ? `
import type { Metadata } from "next";

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
`
    : `
export const metadata = {
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
`;

  // Add before the default export
  const defaultExportRegex = /export\s+default\s+function/;
  if (defaultExportRegex.test(content)) {
    content = content.replace(defaultExportRegex, `${metadataBlock}\nexport default function`);
  } else {
    // Prepend at the top after imports
    const lastImportIndex = content.lastIndexOf("import ");
    if (lastImportIndex !== -1) {
      const lineEnd = content.indexOf("\n", lastImportIndex);
      content =
        content.slice(0, lineEnd + 1) + metadataBlock + content.slice(lineEnd + 1);
    } else {
      content = metadataBlock + "\n" + content;
    }
  }

  fs.writeFileSync(layoutPath, content);
  return true;
}

// ─── Next.js Pages Router ───
function injectIntoNextPages(pagesDir) {
  // Look for _document file
  const docFiles = ["_document.tsx", "_document.jsx", "_document.js"];
  let docPath = null;

  for (const file of docFiles) {
    const fullPath = path.join(pagesDir, file);
    if (fs.existsSync(fullPath)) {
      docPath = fullPath;
      break;
    }
  }

  // If _document exists, try to inject Head tags
  if (docPath) {
    let content = fs.readFileSync(docPath, "utf-8");

    if (content.includes("favicon")) {
      console.log(chalk.yellow("⚠ Favicon references already exist in _document"));
      return true;
    }

    const faviconLinks = `
            <link rel="icon" href="/favicon.ico" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <meta name="theme-color" content="#ffffff" />`;

    // Insert inside <Head>
    const headRegex = /<Head>/i;
    if (headRegex.test(content)) {
      content = content.replace(headRegex, `<Head>${faviconLinks}`);
      fs.writeFileSync(docPath, content);
      return true;
    }
  }

  // Create _document if it doesn't exist
  const isTs = fs.existsSync(path.join(pagesDir, "_app.tsx"));
  const ext = isTs ? "tsx" : "jsx";
  const newDocPath = path.join(pagesDir, `_document.${ext}`);

  const documentContent = `import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
`;

  fs.writeFileSync(newDocPath, documentContent);
  return true;
}

// ─── Main inject function ───
function injectFavicons(projectType, details) {
  switch (projectType) {
    case PROJECT_TYPES.REACT_CRA:
    case PROJECT_TYPES.REACT_VITE:
      return injectIntoHtml(details.indexHtml);

    case PROJECT_TYPES.NEXT_APP:
      return injectIntoNextApp(details.appDir);

    case PROJECT_TYPES.NEXT_PAGES:
      return injectIntoNextPages(details.pagesDir);

    default:
      return false;
  }
}

module.exports = { injectFavicons };
```

---

## 5. `bin/index.js` — Main CLI Entry Point

```js
#!/usr/bin/env node

const { program } = require("commander");
const chalk = require("chalk");
const ora = require("ora");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs-extra");
const { detectProject, getProjectLabel } = require("../src/detect");
const { generateFavicons } = require("../src/generate");
const { injectFavicons } = require("../src/inject");
const { SUPPORTED_EXTENSIONS, PROJECT_TYPES } = require("../src/constants");

// ASCII banner
function showBanner() {
  console.log(
    chalk.cyan(`
  ╔═══════════════════════════════════╗
  ║                                   ║
  ║   🎨  ${chalk.bold("favicli")}                    ║
  ║   Favicon generator for           ║
  ║   React & Next.js                 ║
  ║                                   ║
  ╚═══════════════════════════════════╝
  `)
  );
}

// ─── MAIN COMMAND: set ───
program
  .name("favicli")
  .description("Auto-set favicons in React & Next.js projects")
  .version("1.0.0");

program
  .command("set [image]")
  .description("Set a favicon from an image file")
  .option("-d, --dir <path>", "Project directory", process.cwd())
  .option("--no-inject", "Skip auto-injecting into project files")
  .action(async (image, options) => {
    showBanner();

    const projectDir = path.resolve(options.dir);

    // ── Step 1: Detect project ──
    const spinner = ora("Detecting project type...").start();
    const { type: projectType, details } = detectProject(projectDir);

    if (projectType === PROJECT_TYPES.UNKNOWN) {
      spinner.fail("Could not detect a React or Next.js project");
      console.log(chalk.dim("  Make sure you're in a project directory with package.json"));
      process.exit(1);
    }

    spinner.succeed(`Detected: ${chalk.green(getProjectLabel(projectType))}`);

    // ── Step 2: Get image path ──
    let imagePath = image;

    if (!imagePath) {
      // Search for common image files in current directory
      const possibleImages = fs
        .readdirSync(projectDir)
        .filter((f) => {
          const ext = path.extname(f).toLowerCase();
          return SUPPORTED_EXTENSIONS.includes(ext);
        });

      if (possibleImages.length > 0) {
        const { selectedImage } = await inquirer.prompt([
          {
            type: "list",
            name: "selectedImage",
            message: "Select an image to use as favicon:",
            choices: [
              ...possibleImages,
              new inquirer.Separator(),
              { name: "Enter path manually", value: "__manual__" },
            ],
          },
        ]);

        if (selectedImage === "__manual__") {
          const { manualPath } = await inquirer.prompt([
            {
              type: "input",
              name: "manualPath",
              message: "Enter the image path:",
              validate: (input) =>
                fs.existsSync(input) || "File not found!",
            },
          ]);
          imagePath = manualPath;
        } else {
          imagePath = selectedImage;
        }
      } else {
        const { manualPath } = await inquirer.prompt([
          {
            type: "input",
            name: "manualPath",
            message: "No images found. Enter the image path:",
            validate: (input) =>
              fs.existsSync(path.resolve(projectDir, input)) || "File not found!",
          },
        ]);
        imagePath = manualPath;
      }
    }

    // Resolve full path
    imagePath = path.resolve(projectDir, imagePath);

    if (!fs.existsSync(imagePath)) {
      console.log(chalk.red(`✖ Image not found: ${imagePath}`));
      process.exit(1);
    }

    const ext = path.extname(imagePath).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      console.log(chalk.red(`✖ Unsupported format: ${ext}`));
      console.log(chalk.dim(`  Supported: ${SUPPORTED_EXTENSIONS.join(", ")}`));
      process.exit(1);
    }

    console.log(chalk.dim(`  Using: ${imagePath}`));

    // ── Step 3: Generate favicons ──
    const genSpinner = ora("Generating favicons...").start();

    try {
      const outputDir = details.publicDir || path.join(projectDir, "public");
      const results = await generateFavicons(imagePath, outputDir);
      genSpinner.succeed(`Generated ${chalk.green(results.length)} files`);

      // Show generated files
      console.log(chalk.dim("\n  Generated files:"));
      results.forEach(({ name, size }) => {
        const sizeLabel = typeof size === "number" ? `${size}x${size}` : size;
        console.log(chalk.dim(`    ✓ ${name} (${sizeLabel})`));
      });
    } catch (err) {
      genSpinner.fail("Failed to generate favicons");
      console.error(chalk.red(err.message));
      process.exit(1);
    }

    // ── Step 4: Inject into project ──
    if (options.inject !== false) {
      console.log();
      const injectSpinner = ora("Injecting favicon references...").start();

      try {
        const injected = injectFavicons(projectType, details);
        if (injected) {
          injectSpinner.succeed("Favicon references injected into project files");
        } else {
          injectSpinner.warn("Could not auto-inject. You may need to add references manually.");
        }
      } catch (err) {
        injectSpinner.warn(`Auto-inject warning: ${err.message}`);
      }
    }

    // ── Done! ──
    console.log(
      chalk.green(`
  ✅ Favicons set successfully!

  ${chalk.dim("Restart your dev server to see the changes.")}
  `)
    );
  });

// ─── COMMAND: detect ───
program
  .command("detect")
  .description("Detect the project type")
  .option("-d, --dir <path>", "Project directory", process.cwd())
  .action((options) => {
    const projectDir = path.resolve(options.dir);
    const { type, details } = detectProject(projectDir);

    console.log(chalk.cyan(`\n  Project: ${chalk.bold(getProjectLabel(type))}`));
    console.log(chalk.dim(`  Directory: ${projectDir}`));

    if (details) {
      console.log(chalk.dim(`  Details: ${JSON.stringify(details, null, 2)}`));
    }
    console.log();
  });

// ─── COMMAND: remove ───
program
  .command("remove")
  .description("Remove generated favicon files")
  .option("-d, --dir <path>", "Project directory", process.cwd())
  .action(async (options) => {
    const projectDir = path.resolve(options.dir);
    const { details } = detectProject(projectDir);
    const publicDir = details?.publicDir || path.join(projectDir, "public");

    const filesToRemove = [
      "favicon.ico",
      "favicon-16x16.png",
      "favicon-32x32.png",
      "favicon-48x48.png",
      "apple-touch-icon.png",
      "android-chrome-192x192.png",
      "android-chrome-512x512.png",
      "site.webmanifest",
    ];

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `Remove all generated favicons from ${publicDir}?`,
        default: false,
      },
    ]);

    if (!confirm) return;

    let removed = 0;
    filesToRemove.forEach((file) => {
      const filePath = path.join(publicDir, file);
      if (fs.existsSync(filePath)) {
        fs.removeSync(filePath);
        console.log(chalk.dim(`  ✓ Removed ${file}`));
        removed++;
      }
    });

    console.log(chalk.green(`\n  ✅ Removed ${removed} files\n`));
  });

// ─── Default action (no command) ───
program
  .argument("[image]", "Image file to use as favicon")
  .action(async (image) => {
    if (image) {
      // Run "set" command directly
      await program.parseAsync(["node", "favicli", "set", image]);
    } else {
      await program.parseAsync(["node", "favicli", "set"]);
    }
  });

program.parse();
```

---

## Make It Executable

```bash
chmod +x bin/index.js
```

---

## Test Locally

```bash
# Link globally
npm link

# Go to any React/Next.js project
cd ~/my-react-app

# Run it!
favicli set logo.png

# Or interactive mode (auto-finds images)
favicli set

# Just detect project type
favicli detect

# Remove generated favicons
favicli remove
```

---

## Usage After Publishing

```bash
# One-liner in any React/Next.js project
npx favicli set logo.png

# Interactive — auto-finds images in the project
npx favicli set

# Shorthand (image arg goes to "set" by default)
npx favicli logo.png

# Detect project type
npx favicli detect

# Clean up
npx favicli remove
```

---

## What It Does Per Project Type

```
┌──────────────────┬──────────────────────────────────────────┐
│ Project Type     │ What favicli does                        │
├──────────────────┼──────────────────────────────────────────┤
│ React + Vite     │ • Generates to /public                  │
│                  │ • Injects <link> tags in index.html      │
├──────────────────┼──────────────────────────────────────────┤
│ Create React App │ • Generates to /public                  │
│                  │ • Injects <link> tags in public/         │
│                  │   index.html                             │
├──────────────────┼──────────────────────────────────────────┤
│ Next.js App      │ • Generates to /public                  │
│ Router           │ • Injects metadata icons config into     │
│                  │   app/layout.tsx                         │
├──────────────────┼──────────────────────────────────────────┤
│ Next.js Pages    │ • Generates to /public                  │
│ Router           │ • Injects <link> tags into              │
│                  │   _document.tsx <Head>                   │
└──────────────────┴──────────────────────────────────────────┘
```

---

## Generated Files

```
public/
├── favicon.ico                  ← Multi-size ICO (16+32+48)
├── favicon-16x16.png            ← Browser tab
├── favicon-32x32.png            ← Browser tab (retina)
├── favicon-48x48.png            ← Windows site pinning
├── apple-touch-icon.png         ← iOS home screen (180x180)
├── android-chrome-192x192.png   ← Android/PWA
├── android-chrome-512x512.png   ← Android/PWA splash
└── site.webmanifest             ← PWA manifest
```

---

## Publish to npm

```bash
npm login
npm publish
# or scoped:
npm publish --access public
```

Now anyone can run `npx favicli set mylogo.png` inside their React or Next.js project and get full favicon setup in seconds! 🚀