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

const ui = {
  ok: chalk.green("[OK]"),
  warn: chalk.yellow("[WARN]"),
  err: chalk.red("[ERR]"),
  info: chalk.cyan("[INFO]"),
  dim: (text) => chalk.dim(text),
  title: (text) => chalk.bold.cyan(text),
  accent: (text) => chalk.bold.yellow(text),
};

function hr(color = "gray") {
  const line = "=".repeat(66);
  return chalk[color] ? chalk[color](line) : line;
}

function showBanner() {
  console.log(
    [
      "",
      hr("cyan"),
      chalk.bold.cyan("  FAVICLI"),
      chalk.cyan("  Favicon generator for React and Next.js projects"),
      chalk.dim("  Fast setup: detect project -> choose image -> generate -> inject"),
      hr("cyan"),
      "",
    ].join("\n")
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
program.configureOutput({
  outputError: (str, write) => write(chalk.red(str)),
});
program.addHelpText(
  "after",
  [
    "",
    ui.title("Behavior"),
    `  ${chalk.cyan("1.")} Detect a React/Next.js project from ${ui.accent("--dir")}.`,
    `  ${chalk.cyan("2.")} If not found, scan nearby folders and let you pick one.`,
    `  ${chalk.cyan("3.")} Scan the selected project for images and open image picker.`,
    `  ${chalk.cyan("4.")} Generate favicon files and inject references automatically.`,
    "",
    ui.title("Examples"),
    `  ${ui.accent("$")} favicli set`,
    `  ${ui.accent("$")} favicli set logo.png`,
    `  ${ui.accent("$")} favicli set -d .`,
    `  ${ui.accent("$")} favicli detect -d .\\apps\\web`,
    `  ${ui.accent("$")} favicli remove -d .\\apps\\web`,
    "",
  ].join("\n")
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
        console.log(ui.dim("Tip: run this inside a React/Next.js project, or pass --dir"));
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
      console.log(`${ui.info} ${ui.dim(`Using project: ${projectDir}`)}`);
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
      console.log(`${ui.err} Image not found: ${imagePath}`);
      process.exit(1);
    }

    const ext = path.extname(imagePath).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      console.log(`${ui.err} Unsupported format: ${ext}`);
      console.log(ui.dim(`Supported: ${SUPPORTED_EXTENSIONS.join(", ")}`));
      process.exit(1);
    }

    console.log(`${ui.info} ${ui.dim(`Using image: ${imagePath}`)}`);

    const genSpinner = ora("Generating favicons...").start();
    try {
      const outputDir = details.publicDir || path.join(projectDir, "public");
      const results = await generateFavicons(imagePath, outputDir);
      genSpinner.succeed(`Generated ${chalk.green(results.length)} files`);
      console.log(`\n${ui.title("Generated Files")}`);
      results.forEach(({ name, size }) => {
        const sizeLabel = typeof size === "number" ? `${size}x${size}` : size;
        console.log(`  ${ui.ok} ${chalk.white(name)} ${chalk.dim(`(${sizeLabel})`)}`);
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
          injectSpinner.warn(`${ui.warn} Could not auto-inject. Add references manually.`);
        }
      } catch (err) {
        injectSpinner.warn(`${ui.warn} Auto-inject warning: ${err.message}`);
      }
    }

    console.log(
      [
        "",
        hr("green"),
        `  ${ui.ok} ${chalk.bold.green("Favicons set successfully")}`,
        `  ${chalk.dim("Restart your dev server to see the changes.")}`,
        hr("green"),
        "",
      ].join("\n")
    );
  });

setCommand.addHelpText(
  "after",
  [
    "",
    ui.title("Smart Flow"),
    `  ${chalk.cyan("1.")} Detect project in ${ui.accent("--dir")}.`,
    `  ${chalk.cyan("2.")} If not detected, scan: current folder, direct subfolders, apps/*, packages/*.`,
    `  ${chalk.cyan("3.")} Pick a detected React/Next.js project.`,
    `  ${chalk.cyan("4.")} Pick an image (.png, .jpg, .jpeg, .webp, .svg), then generate and inject.`,
    "",
    ui.title("Examples"),
    `  ${ui.accent("$")} favicli set`,
    `  ${ui.accent("$")} favicli set -d .`,
    `  ${ui.accent("$")} favicli set .\\public\\logo.png -d .\\apps\\web`,
    `  ${ui.accent("$")} favicli set --no-inject`,
    "",
  ].join("\n")
);

program
  .command("detect")
  .description("Detect the project type")
  .option("-d, --dir <path>", "Project directory", process.cwd())
  .action((options) => {
    const projectDir = path.resolve(options.dir);
    const { type, details } = detectProject(projectDir);
    console.log(`\n${ui.title("Project Detection")}`);
    console.log(`  ${ui.info} Type: ${chalk.bold(getProjectLabel(type))}`);
    console.log(`  ${ui.info} Directory: ${chalk.dim(projectDir)}`);
    if (details) {
      console.log(`  ${ui.info} Details:\n${chalk.dim(JSON.stringify(details, null, 2))}`);
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
        console.log(`  ${ui.ok} ${chalk.dim(`Removed ${file}`)}`);
        removed += 1;
      }
    });

    console.log(`\n${ui.ok} ${chalk.green(`Removed ${removed} files`)}\n`);
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

program.on("--help", () => {
  console.log(
    [
      ui.title("Tips"),
      `  ${chalk.cyan("-")} Use ${ui.accent("favicli set")} for full interactive flow.`,
      `  ${chalk.cyan("-")} Use ${ui.accent("favicli set logo.png")} to skip image picker.`,
      `  ${chalk.cyan("-")} Use ${ui.accent("--no-inject")} if you only want generated files.`,
      "",
    ].join("\n")
  );
});

setCommand.on("--help", () => {
  console.log(
    [
      ui.title("Set Command Tips"),
      `  ${chalk.cyan("-")} Works great from monorepo root with ${ui.accent("-d .")}.`,
      `  ${chalk.cyan("-")} You can use absolute or project-relative image paths.`,
      "",
    ].join("\n")
  );
});

program.parse();
