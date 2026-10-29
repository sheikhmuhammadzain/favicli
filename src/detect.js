const fs = require("fs-extra");
const path = require("path");
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

  if (allDeps.next) {
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

  if (allDeps.react && allDeps.vite) {
    return {
      type: PROJECT_TYPES.REACT_VITE,
      details: {
        publicDir: path.join(targetDir, "public"),
        indexHtml: path.join(targetDir, "index.html"),
      },
    };
  }

  if (allDeps.react && allDeps["react-scripts"]) {
    return {
      type: PROJECT_TYPES.REACT_CRA,
      details: {
        publicDir: path.join(targetDir, "public"),
        indexHtml: path.join(targetDir, "public", "index.html"),
      },
    };
  }

  if (allDeps.react) {
    return {
      type: PROJECT_TYPES.REACT_VITE,
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
