const sharp = require("sharp");
const pngToIco = require("png-to-ico");
const path = require("path");
const fs = require("fs-extra");
const { FAVICON_SIZES } = require("./constants");

async function generateFavicons(inputImage, outputDir) {
  await fs.ensureDir(outputDir);

  const results = [];

  for (const { name, size } of FAVICON_SIZES) {
    const outputPath = path.join(outputDir, name);

    await sharp(inputImage)
      .resize(size, size, { fit: "cover", position: "center" })
      .png({ quality: 100 })
      .toFile(outputPath);

    results.push({ name, size, path: outputPath });
  }

  const icoSources = [16, 32, 48].map((size) =>
    path.join(outputDir, `favicon-${size}x${size}.png`)
  );
  const icoBuffer = await pngToIco(icoSources);
  const icoPath = path.join(outputDir, "favicon.ico");
  await fs.writeFile(icoPath, icoBuffer);
  results.push({ name: "favicon.ico", size: "multi", path: icoPath });

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
