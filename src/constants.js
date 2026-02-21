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
  NEXT_APP: "next-app",
  NEXT_PAGES: "next-pages",
  REACT_VITE: "react-vite",
  REACT_CRA: "react-cra",
  UNKNOWN: "unknown",
};

module.exports = { FAVICON_SIZES, SUPPORTED_EXTENSIONS, PROJECT_TYPES };
