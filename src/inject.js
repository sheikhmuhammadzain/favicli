const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");
const chalk = require("chalk");
const { PROJECT_TYPES } = require("./constants");

const NEXT_APP_ICONS_CONFIG = `
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  manifest: "/site.webmanifest",`;

const NEXT_PAGES_FAVICON_LINKS = `
            <link rel="icon" href="/favicon.ico" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <meta name="theme-color" content="#ffffff" />`;

function injectIntoHtml(indexHtmlPath) {
  if (!fs.existsSync(indexHtmlPath)) {
    console.log(chalk.yellow(`index.html not found at ${indexHtmlPath}`));
    return false;
  }

  const html = fs.readFileSync(indexHtmlPath, "utf-8");
  const $ = cheerio.load(html, { decodeEntities: false });

  $('link[rel="icon"]').remove();
  $('link[rel="shortcut icon"]').remove();
  $('link[rel="apple-touch-icon"]').remove();
  $('link[rel="manifest"]').remove();
  $('meta[name="theme-color"]').remove();

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

function injectIntoNextApp(appDir) {
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
    console.log(chalk.yellow("No layout file found in app directory"));
    return false;
  }

  let content = fs.readFileSync(layoutPath, "utf-8");

  const metadataRegex = /export\s+const\s+metadata\s*(?::\s*Metadata\s*)?=\s*\{/;

  if (metadataRegex.test(content)) {
    // Remove existing metadata icons/manifest so each run replaces previous favicon config.
    content = content.replace(/icons\s*:\s*\{[\s\S]*?\}\s*,?/g, "");
    content = content.replace(/manifest\s*:\s*["'`][^"'`]+["'`]\s*,?/g, "");
    content = content.replace(metadataRegex, (match) => `${match}${NEXT_APP_ICONS_CONFIG}`);
    fs.writeFileSync(layoutPath, content);
    return true;
  }

  const isTypeScript = layoutPath.endsWith(".tsx") || layoutPath.endsWith(".ts");
  const metadataBlock = isTypeScript
    ? `
import type { Metadata } from "next";

export const metadata: Metadata = {
${NEXT_APP_ICONS_CONFIG.slice(0, -1)}
};
`
    : `
export const metadata = {
${NEXT_APP_ICONS_CONFIG.slice(0, -1)}
};
`;

  const defaultExportRegex = /export\s+default\s+function/;
  if (defaultExportRegex.test(content)) {
    content = content.replace(defaultExportRegex, `${metadataBlock}\nexport default function`);
  } else {
    const lastImportIndex = content.lastIndexOf("import ");
    if (lastImportIndex !== -1) {
      const lineEnd = content.indexOf("\n", lastImportIndex);
      content = content.slice(0, lineEnd + 1) + metadataBlock + content.slice(lineEnd + 1);
    } else {
      content = metadataBlock + "\n" + content;
    }
  }

  fs.writeFileSync(layoutPath, content);
  return true;
}

function injectIntoNextPages(pagesDir) {
  const docFiles = ["_document.tsx", "_document.jsx", "_document.js"];
  let docPath = null;

  for (const file of docFiles) {
    const fullPath = path.join(pagesDir, file);
    if (fs.existsSync(fullPath)) {
      docPath = fullPath;
      break;
    }
  }

  if (docPath) {
    let content = fs.readFileSync(docPath, "utf-8");
    // Remove existing favicon-related tags so the new set replaces old values.
    content = content.replace(/^\s*<link[^>]*rel="icon"[^>]*\/>\s*$/gim, "");
    content = content.replace(/^\s*<link[^>]*rel="shortcut icon"[^>]*\/>\s*$/gim, "");
    content = content.replace(/^\s*<link[^>]*rel="apple-touch-icon"[^>]*\/>\s*$/gim, "");
    content = content.replace(/^\s*<link[^>]*rel="manifest"[^>]*\/>\s*$/gim, "");
    content = content.replace(/^\s*<meta[^>]*name="theme-color"[^>]*\/>\s*$/gim, "");

    const headRegex = /<Head>/i;
    if (headRegex.test(content)) {
      content = content.replace(headRegex, `<Head>${NEXT_PAGES_FAVICON_LINKS}`);
      fs.writeFileSync(docPath, content);
      return true;
    }
  }

  const isTs = fs.existsSync(path.join(pagesDir, "_app.tsx"));
  const ext = isTs ? "tsx" : "jsx";
  const newDocPath = path.join(pagesDir, `_document.${ext}`);

  const documentContent = `import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
${NEXT_PAGES_FAVICON_LINKS.replace(/\n/g, "\n        ").trimStart()}
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
