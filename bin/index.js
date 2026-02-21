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

function showBanner() {
  console.log(
    chalk.cyan(`
  ===================================
   favicli
   Favicon generator for React/Next
  ===================================
  `)
  );
}

function findDetectedProjects(baseDir) {
  const candidates = [baseDir];
  const immediateChildren = fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(baseDir, entry.name));

  candidates.push(...immediateChildren);

  for (const workspaceDir of ["apps", "packages"]) {
    const fullWorkspaceDir = path.join(baseDir, workspaceDir);
    if (!fs.existsSync(fullWorkspaceDir)) continue;
    const nested = fs
      .readdirSync(fullWorkspaceDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(fullWorkspaceDir, entry.name));
    candidates.push(...nested);
  }

  const uniqueDirs = [...new Set(candidates)];
  return uniqueDirs
    .map((dir) => {
      const detected = detectProject(dir);
      return { dir, ...detected };
    })
    .filter((item) => item.type !== PROJECT_TYPES.UNKNOWN);
}

function findImageFiles(rootDir, maxDepth = 3) {
  const ignoreDirs = new Set(["node_modules", ".git", ".next", "dist", "build", ".turbo"]);
  const results = [];

  function walk(currentDir, depth) {
    if (depth > maxDepth) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (!ignoreDirs.has(entry.name)) {
          walk(fullPath, depth + 1);
        }
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        results.push(path.relative(rootDir, fullPath));
      }
    }
  }

  walk(rootDir, 0);
  return results.sort((a, b) => a.localeCompare(b));
}

program.name("favicli").description("Auto-set favicons in React & Next.js projects").version("1.0.0");
program.addHelpText(
  "after",
  `
Behavior:
  - If --dir is not a React/Next.js app, favicli scans nearby folders and lets you pick a project.
  - Then it scans that project for images and shows an interactive image picker.
  - Finally it generates favicon files and injects references automatically.

Examples:
  $ favicli set
  $ favicli set logo.png
  $ favicli set -d .
  $ favicli detect -d .\\apps\\web
  $ favicli remove -d .\\apps\\web
`
);

const setCommand = program
  .command("set [image]")
  .description("Set a favicon from an image file")
  .option("-d, --dir <path>", "Project directory", process.cwd())
  .option("--no-inject", "Skip auto-injecting into project files")
  .action(async (image, options) => {
    showBanner();

    const baseDir = path.resolve(options.dir);
    let projectDir = baseDir;

    const spinner = ora("Detecting project type...").start();
    let { type: projectType, details } = detectProject(projectDir);

    if (projectType === PROJECT_TYPES.UNKNOWN) {
      const detectedProjects = findDetectedProjects(baseDir);

      if (detectedProjects.length === 0) {
        spinner.fail("Could not detect a React or Next.js project");
        console.log(chalk.dim("Tip: run this inside a React/Next.js project, or pass --dir"));
        process.exit(1);
      }

      spinner.succeed(`Found ${chalk.green(detectedProjects.length)} React/Next.js project(s)`);

      const { selectedProject } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedProject",
          message: "Select a project:",
          choices: detectedProjects.map((project) => ({
            name: `${path.relative(baseDir, project.dir) || "."} (${getProjectLabel(project.type)})`,
            value: project,
          })),
        },
      ]);

      projectDir = selectedProject.dir;
      projectType = selectedProject.type;
      details = selectedProject.details;
      console.log(chalk.dim(`Using project: ${projectDir}`));
    } else {
      spinner.succeed(`Detected: ${chalk.green(getProjectLabel(projectType))}`);
    }

    let imagePath = image;

    if (!imagePath) {
      const possibleImages = findImageFiles(projectDir);

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
            pageSize: 18,
          },
        ]);

        if (selectedImage === "__manual__") {
          const { manualPath } = await inquirer.prompt([
            {
              type: "input",
              name: "manualPath",
              message: "Enter the image path:",
              validate: (input) => fs.existsSync(path.resolve(projectDir, input)) || "File not found",
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
            validate: (input) => fs.existsSync(path.resolve(projectDir, input)) || "File not found",
          },
        ]);
        imagePath = manualPath;
      }
    }

    imagePath = path.isAbsolute(imagePath) ? imagePath : path.resolve(projectDir, imagePath);

    if (!fs.existsSync(imagePath)) {
      console.log(chalk.red(`Image not found: ${imagePath}`));
      process.exit(1);
    }

    const ext = path.extname(imagePath).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      console.log(chalk.red(`Unsupported format: ${ext}`));
      console.log(chalk.dim(`Supported: ${SUPPORTED_EXTENSIONS.join(", ")}`));
      process.exit(1);
    }

    console.log(chalk.dim(`Using: ${imagePath}`));

    const genSpinner = ora("Generating favicons...").start();
    try {
      const outputDir = details.publicDir || path.join(projectDir, "public");
      const results = await generateFavicons(imagePath, outputDir);
      genSpinner.succeed(`Generated ${chalk.green(results.length)} files`);
      console.log(chalk.dim("\nGenerated files:"));
      results.forEach(({ name, size }) => {
        const sizeLabel = typeof size === "number" ? `${size}x${size}` : size;
        console.log(chalk.dim(`  - ${name} (${sizeLabel})`));
      });
    } catch (err) {
      genSpinner.fail("Failed to generate favicons");
      console.error(chalk.red(err.message));
      process.exit(1);
    }

    if (options.inject !== false) {
      const injectSpinner = ora("Injecting favicon references...").start();
      try {
        const injected = injectFavicons(projectType, details);
        if (injected) {
          injectSpinner.succeed("Favicon references injected");
        } else {
          injectSpinner.warn("Could not auto-inject. Add references manually.");
        }
      } catch (err) {
        injectSpinner.warn(`Auto-inject warning: ${err.message}`);
      }
    }

    console.log(chalk.green("\nFavicons set successfully.\nRestart your dev server to see changes.\n"));
  });

setCommand.addHelpText(
  "after",
  `
Smart Flow:
  1) Detect project in --dir.
  2) If not detected, scan: current folder, direct subfolders, apps/*, packages/*.
  3) Ask you to select a detected React/Next.js project.
  4) Scan selected project for images (.png, .jpg, .jpeg, .webp, .svg) up to depth 3.
  5) Ask you to pick an image, then generate and inject favicons.

Examples:
  $ favicli set
  $ favicli set -d .
  $ favicli set .\\public\\logo.png -d .\\apps\\web
  $ favicli set --no-inject
`
);

program
  .command("detect")
  .description("Detect the project type")
  .option("-d, --dir <path>", "Project directory", process.cwd())
  .action((options) => {
    const projectDir = path.resolve(options.dir);
    const { type, details } = detectProject(projectDir);
    console.log(chalk.cyan(`\nProject: ${chalk.bold(getProjectLabel(type))}`));
    console.log(chalk.dim(`Directory: ${projectDir}`));
    if (details) {
      console.log(chalk.dim(`Details: ${JSON.stringify(details, null, 2)}`));
    }
    console.log();
  });

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
        console.log(chalk.dim(`Removed ${file}`));
        removed += 1;
      }
    });

    console.log(chalk.green(`\nRemoved ${removed} files\n`));
  });

program
  .argument("[image]", "Image file to use as favicon")
  .action(async (image) => {
    if (image) {
      await program.parseAsync(["node", "favicli", "set", image]);
    } else {
      await program.parseAsync(["node", "favicli", "set"]);
    }
  });

program.parse();
