#!/usr/bin/env node

const {program} = require("commander")
const chalk = require("chalk")
const ora = require("ora")
const inquirer = require("inquirer")
const path = require("path")
const fs = require("fs-extra")
const {execSync} = require("child_process")
const boxen = require("boxen")
const Table = require("cli-table3")
const figlet = require("figlet")
const gradientLib = require("gradient-string")
const logSymbols = require("log-symbols")

const {detectProject, getProjectLabel} = require("../src/detect")
const {generateFavicons} = require("../src/generate")
const {injectFavicons} = require("../src/inject")
const {SUPPORTED_EXTENSIONS, PROJECT_TYPES} = require("../src/constants")
const {version} = require("../package.json")

const gradient =
  typeof gradientLib === "function"
    ? gradientLib
    : typeof gradientLib.default === "function"
      ? gradientLib.default
      : null

if (!gradient) {
  throw new Error(
    "gradient-string export format is unsupported. Reinstall with: npm i gradient-string",
  )
}

// ──────────────────────────────────────────────
//  THEME & COLORS
// ──────────────────────────────────────────────

const theme = {
  primary: chalk.hex("#6C63FF"), // Purple
  secondary: chalk.hex("#00D9FF"), // Cyan
  accent: chalk.hex("#FFD700"), // Gold
  success: chalk.hex("#00E676"), // Green
  warning: chalk.hex("#FFA726"), // Orange
  error: chalk.hex("#FF5252"), // Red
  muted: chalk.hex("#666666"), // Gray
  subtle: chalk.hex("#444444"), // Dark gray
  white: chalk.hex("#FFFFFF"),
  bg: {
    primary: chalk.bgHex("#6C63FF").hex("#FFFFFF"),
    success: chalk.bgHex("#00E676").hex("#000000"),
    warning: chalk.bgHex("#FFA726").hex("#000000"),
    error: chalk.bgHex("#FF5252").hex("#FFFFFF"),
    info: chalk.bgHex("#00D9FF").hex("#000000"),
  },
}

const icons = {
  favicon: "🎨",
  rocket: "🚀",
  sparkle: "✨",
  package: "📦",
  folder: "📁",
  image: "🖼️ ",
  check: "✅",
  warn: "⚠️ ",
  error: "❌",
  star: "⭐",
  gear: "⚙️ ",
  scissors: "✂️ ",
  eye: "👁️ ",
  lightning: "⚡",
  clock: "🕐",
  paint: "🎯",
  file: "📄",
  inject: "💉",
  trash: "🗑️ ",
  search: "🔍",
  arrow: "→",
  dot: "●",
  line: "│",
  corner: "└",
  tee: "├",
}

// Custom gradient
const faviGradient = gradient(["#6C63FF", "#00D9FF", "#00E676"])
const goldGradient = gradient(["#FFD700", "#FFA726"])
const successGradient = gradient(["#00E676", "#00D9FF"])
const errorGradient = gradient(["#FF5252", "#FFA726"])

// ──────────────────────────────────────────────
//  UI HELPERS
// ──────────────────────────────────────────────

function hr(char = "─", length = 60, color = theme.subtle) {
  return color(char.repeat(length))
}

function blank() {
  console.log("")
}

function stepHeader(stepNum, totalSteps, label) {
  blank()
  const stepBadge = theme.bg.primary(` STEP ${stepNum}/${totalSteps} `)
  const stepLabel = theme.white.bold(` ${label}`)
  console.log(`  ${stepBadge}${stepLabel}`)
  console.log(`  ${hr("─", 52)}`)
}

function sectionHeader(icon, label) {
  blank()
  console.log(`  ${icon}  ${theme.primary.bold(label)}`)
  console.log(`  ${hr("─", 52)}`)
}

function infoLine(icon, label, value) {
  console.log(
    `  ${theme.subtle(icons.line)}  ${icon}  ${theme.muted(label)} ${theme.white(value)}`,
  )
}

function treeLine(label, value, isLast = false) {
  const connector = isLast ? icons.corner : icons.tee
  console.log(
    `  ${theme.subtle(connector)}── ${theme.muted(label)} ${theme.white(value)}`,
  )
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

function getGitCommit() {
  try {
    return execSync("git rev-parse --short HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim()
  } catch (_) {
    return null
  }
}

function getProjectIcon(type) {
  const iconMap = {
    [PROJECT_TYPES.NEXT_APP]: "▲",
    [PROJECT_TYPES.NEXT_PAGES]: "▲",
    [PROJECT_TYPES.REACT_VITE]: "⚡",
    [PROJECT_TYPES.REACT_CRA]: "⚛",
  }
  return iconMap[type] || "?"
}

function getProjectColor(type) {
  const colorMap = {
    [PROJECT_TYPES.NEXT_APP]: chalk.hex("#FFFFFF"),
    [PROJECT_TYPES.NEXT_PAGES]: chalk.hex("#FFFFFF"),
    [PROJECT_TYPES.REACT_VITE]: chalk.hex("#BD34FE"),
    [PROJECT_TYPES.REACT_CRA]: chalk.hex("#61DAFB"),
  }
  return colorMap[type] || theme.white
}

// ──────────────────────────────────────────────
//  BANNERS
// ──────────────────────────────────────────────

function showBanner() {
  const art = figlet.textSync("favicli", {
    font: "ANSI Shadow",
    horizontalLayout: "fitted",
  })

  blank()
  console.log(faviGradient(art))

  const tagline = boxen(
    [
      `${icons.favicon}  ${theme.white.bold("Favicon Generator")}  ${icons.favicon}`,
      "",
      `${theme.muted("for")} ${theme.secondary("React")} ${theme.muted("&")} ${theme.secondary("Next.js")} ${theme.muted("projects")}`,
      "",
      `${theme.subtle(`v${version}`)}${getGitCommit() ? theme.subtle(` • ${getGitCommit()}`) : ""}`,
    ].join("\n"),
    {
      padding: {top: 0, bottom: 0, left: 2, right: 2},
      margin: {top: 0, bottom: 0, left: 2, right: 0},
      borderStyle: "round",
      borderColor: "#6C63FF",
      textAlignment: "center",
    },
  )

  console.log(tagline)
}

function showHomeScreen() {
  const art = figlet.textSync("favicli", {
    font: "ANSI Shadow",
    horizontalLayout: "fitted",
  })

  blank()
  console.log(faviGradient(art))

  const commit = getGitCommit()
  const versionInfo = `v${version}${commit ? ` ${theme.subtle(`(${commit})`)}` : ""}`

  const homeBox = boxen(
    [
      `${icons.favicon}  ${theme.white.bold("Favicon CLI")}  ${theme.subtle(versionInfo)}`,
      "",
      `${theme.muted("Detect")} ${icons.arrow} ${theme.muted("Choose")} ${icons.arrow} ${theme.muted("Generate")} ${icons.arrow} ${theme.muted("Inject")}`,
      "",
      `${theme.subtle("One command to set up favicons for any React/Next.js project.")}`,
      `${theme.subtle("Supports PNG, JPG, JPEG, WebP, and SVG source images.")}`,
    ].join("\n"),
    {
      padding: {top: 1, bottom: 1, left: 3, right: 3},
      margin: {top: 0, bottom: 0, left: 2, right: 0},
      borderStyle: "double",
      borderColor: "#6C63FF",
      textAlignment: "center",
    },
  )

  console.log(homeBox)
  blank()
}

// ──────────────────────────────────────────────
//  UTILITY FINDERS
// ──────────────────────────────────────────────

function findDetectedProjects(baseDir) {
  const candidates = [baseDir]
  const immediateChildren = fs
    .readdirSync(baseDir, {withFileTypes: true})
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(baseDir, entry.name))

  candidates.push(...immediateChildren)

  for (const workspaceDir of ["apps", "packages"]) {
    const fullWorkspaceDir = path.join(baseDir, workspaceDir)
    if (!fs.existsSync(fullWorkspaceDir)) continue
    const nested = fs
      .readdirSync(fullWorkspaceDir, {withFileTypes: true})
      .filter(entry => entry.isDirectory())
      .map(entry => path.join(fullWorkspaceDir, entry.name))
    candidates.push(...nested)
  }

  const uniqueDirs = [...new Set(candidates)]
  return uniqueDirs
    .map(dir => {
      const detected = detectProject(dir)
      return {dir, ...detected}
    })
    .filter(item => item.type !== PROJECT_TYPES.UNKNOWN)
}

function findImageFiles(rootDir, maxDepth = 3) {
  const ignoreDirs = new Set([
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    ".turbo",
    ".vercel",
  ])
  const generatedFaviconFiles = new Set([
    "favicon.ico",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "favicon-48x48.png",
    "apple-touch-icon.png",
    "android-chrome-192x192.png",
    "android-chrome-512x512.png",
  ])
  const results = []

  function walk(currentDir, depth) {
    if (depth > maxDepth) return
    let entries
    try {
      entries = fs.readdirSync(currentDir, {withFileTypes: true})
    } catch {
      return
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        if (!ignoreDirs.has(entry.name)) walk(fullPath, depth + 1)
        continue
      }
      const ext = path.extname(entry.name).toLowerCase()
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        if (generatedFaviconFiles.has(entry.name)) continue
        results.push(path.relative(rootDir, fullPath))
      }
    }
  }

  walk(rootDir, 0)
  return results.sort((a, b) => a.localeCompare(b))
}

// ──────────────────────────────────────────────
//  CUSTOM ORA SPINNERS
// ──────────────────────────────────────────────

function createSpinner(text) {
  return ora({
    text: theme.muted(text),
    spinner: "arc",
    color: "cyan",
    indent: 2,
  })
}

// ──────────────────────────────────────────────
//  PROGRAM SETUP
// ──────────────────────────────────────────────

program
  .name("favicli")
  .description("Auto-set favicons in React & Next.js projects")
  .version(version)

program.configureOutput({
  outputError: (str, write) => write(theme.error(str)),
})

program.addHelpText(
  "after",
  [
    "",
    boxen(
      [
        `${theme.primary.bold("Workflow")}`,
        "",
        `  ${theme.secondary("1.")} Detect a React/Next.js project from ${theme.accent("--dir")}`,
        `  ${theme.secondary("2.")} If not found, scan nearby folders and let you pick`,
        `  ${theme.secondary("3.")} Scan the selected project for images`,
        `  ${theme.secondary("4.")} Generate all favicon sizes + ICO + webmanifest`,
        `  ${theme.secondary("5.")} Auto-inject references into project files`,
        "",
        `${theme.primary.bold("Examples")}`,
        "",
        `  ${theme.accent("$")} favicli set`,
        `  ${theme.accent("$")} favicli set logo.png`,
        `  ${theme.accent("$")} favicli set -d ./apps/web`,
        `  ${theme.accent("$")} favicli detect`,
        `  ${theme.accent("$")} favicli remove`,
      ].join("\n"),
      {
        padding: 1,
        margin: {top: 0, bottom: 0, left: 2, right: 0},
        borderStyle: "round",
        borderColor: "#6C63FF",
      },
    ),
    "",
  ].join("\n"),
)

// ──────────────────────────────────────────────
//  COMMAND: set
// ──────────────────────────────────────────────

const setCommand = program
  .command("set [image]")
  .description("Set a favicon from an image file")
  .option("-d, --dir <path>", "Project directory", process.cwd())
  .option("--no-inject", "Skip auto-injecting into project files")
  .action(async (image, options) => {
    showBanner()

    const startTime = Date.now()
    const baseDir = path.resolve(options.dir)
    let projectDir = baseDir
    const totalSteps = options.inject !== false ? 4 : 3

    // ═══════════════════════════════════════
    //  STEP 1 — DETECT PROJECT
    // ═══════════════════════════════════════

    stepHeader(1, totalSteps, "Detect Project")

    const detectSpinner = createSpinner(
      "Scanning for React/Next.js projects...",
    )
    detectSpinner.start()

    let {type: projectType, details} = detectProject(projectDir)

    if (projectType === PROJECT_TYPES.UNKNOWN) {
      const detectedProjects = findDetectedProjects(baseDir)

      if (detectedProjects.length === 0) {
        detectSpinner.fail(theme.error("No React or Next.js project found"))
        blank()

        const errBox = boxen(
          [
            `${theme.error.bold("Project Not Found")}`,
            "",
            `${theme.muted("Make sure you're running this inside a project")}`,
            `${theme.muted("directory, or pass")} ${theme.accent("--dir <path>")}`,
            "",
            `${theme.subtle("Supported:")} ${theme.white("React (CRA/Vite) • Next.js (App/Pages)")}`,
          ].join("\n"),
          {
            padding: 1,
            margin: {top: 0, bottom: 0, left: 2, right: 0},
            borderStyle: "round",
            borderColor: "#FF5252",
          },
        )

        console.log(errBox)
        blank()
        process.exit(1)
      }

      detectSpinner.succeed(
        `Found ${theme.accent.bold(detectedProjects.length)} project(s)`,
      )
      blank()

      const {selectedProject} = await inquirer.prompt([
        {
          type: "list",
          name: "selectedProject",
          message: theme.primary("Select a project:"),
          choices: detectedProjects.map(project => {
            const relPath = path.relative(baseDir, project.dir) || "."
            const icon = getProjectIcon(project.type)
            const color = getProjectColor(project.type)
            const label = getProjectLabel(project.type)
            return {
              name: `${icon}  ${theme.white.bold(relPath)} ${theme.muted("—")} ${color(label)}`,
              value: project,
              short: relPath,
            }
          }),
          loop: false,
          pageSize: 12,
        },
      ])

      projectDir = selectedProject.dir
      projectType = selectedProject.type
      details = selectedProject.details
    } else {
      detectSpinner.succeed(
        `${theme.success("Detected")} ${getProjectIcon(projectType)}  ${getProjectColor(projectType).bold(getProjectLabel(projectType))}`,
      )
    }

    // Show project info
    infoLine(icons.folder, "Directory:", theme.muted(projectDir))
    infoLine(
      icons.package,
      "Public Dir:",
      theme.muted(details.publicDir || path.join(projectDir, "public")),
    )

    // ═══════════════════════════════════════
    //  STEP 2 — SELECT IMAGE
    // ═══════════════════════════════════════

    stepHeader(2, totalSteps, "Select Source Image")

    let imagePath = image

    if (!imagePath) {
      const searchSpinner = createSpinner("Searching for images...")
      searchSpinner.start()

      const possibleImages = findImageFiles(projectDir)
      searchSpinner.stop()

      if (possibleImages.length > 0) {
        console.log(
          `  ${icons.search}  Found ${theme.accent.bold(possibleImages.length)} image(s) in the project`,
        )
        blank()

        const maxChoices = 120
        const truncated = possibleImages.slice(0, maxChoices)
        const hiddenCount = Math.max(
          0,
          possibleImages.length - truncated.length,
        )

        const {selectedImage} = await inquirer.prompt([
          {
            type: "list",
            name: "selectedImage",
            message: theme.primary("Pick an image to use as favicon:"),
            choices: [
              ...truncated.map(img => {
                const ext = path.extname(img).toUpperCase().replace(".", "")
                const badge = theme.subtle(`[${ext}]`)
                return {
                  name: `${icons.image} ${theme.white(img)} ${badge}`,
                  value: img,
                  short: img,
                }
              }),
              ...(hiddenCount > 0
                ? [
                    new inquirer.Separator(theme.subtle("─".repeat(40))),
                    {
                      name: `${theme.warning(`${hiddenCount} more hidden`)} — enter path manually`,
                      value: "__manual__",
                      short: "manual",
                    },
                  ]
                : []),
              new inquirer.Separator(theme.subtle("─".repeat(40))),
              {
                name: `${icons.gear}  Enter path manually`,
                value: "__manual__",
                short: "manual",
              },
            ],
            pageSize: 16,
            loop: false,
          },
        ])

        if (selectedImage === "__manual__") {
          const {manualPath} = await inquirer.prompt([
            {
              type: "input",
              name: "manualPath",
              message: theme.primary("Enter the image path:"),
              validate: input =>
                fs.existsSync(path.resolve(projectDir, input)) ||
                theme.error("File not found"),
            },
          ])
          imagePath = manualPath
        } else {
          imagePath = selectedImage
        }
      } else {
        console.log(
          `  ${icons.warn}  ${theme.warning("No images found in project")}`,
        )
        blank()

        const {manualPath} = await inquirer.prompt([
          {
            type: "input",
            name: "manualPath",
            message: theme.primary("Enter the image path:"),
            validate: input =>
              fs.existsSync(path.resolve(projectDir, input)) ||
              theme.error("File not found"),
          },
        ])
        imagePath = manualPath
      }
    }

    // Resolve full path
    imagePath = path.isAbsolute(imagePath)
      ? imagePath
      : path.resolve(projectDir, imagePath)

    if (!fs.existsSync(imagePath)) {
      console.log(
        `  ${logSymbols.error}  ${theme.error("Image not found:")} ${theme.muted(imagePath)}`,
      )
      process.exit(1)
    }

    const ext = path.extname(imagePath).toLowerCase()
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      console.log(
        `  ${logSymbols.error}  ${theme.error("Unsupported format:")} ${theme.accent(ext)}`,
      )
      console.log(
        `  ${theme.muted("Supported:")} ${SUPPORTED_EXTENSIONS.map(e => theme.secondary(e)).join(theme.muted(", "))}`,
      )
      process.exit(1)
    }

    // Show selected image info
    const imageStats = fs.statSync(imagePath)
    blank()
    infoLine(icons.image, "Source:", theme.white.bold(path.basename(imagePath)))
    infoLine(icons.file, "Size:", theme.muted(formatBytes(imageStats.size)))
    infoLine(
      icons.paint,
      "Format:",
      theme.muted(ext.replace(".", "").toUpperCase()),
    )

    // ═══════════════════════════════════════
    //  STEP 3 — GENERATE FAVICONS
    // ═══════════════════════════════════════

    stepHeader(3, totalSteps, "Generate Favicons")

    const genSpinner = createSpinner("Generating all favicon sizes...")
    genSpinner.start()

    try {
      const outputDir = details.publicDir || path.join(projectDir, "public")
      const results = await generateFavicons(imagePath, outputDir)
      genSpinner.succeed(
        `Generated ${theme.accent.bold(results.length)} files ${theme.success("successfully")}`,
      )

      // File table
      blank()

      const table = new Table({
        chars: {
          top: "─",
          "top-mid": "┬",
          "top-left": "┌",
          "top-right": "┐",
          bottom: "─",
          "bottom-mid": "┴",
          "bottom-left": "└",
          "bottom-right": "┘",
          left: "│",
          "left-mid": "├",
          mid: "─",
          "mid-mid": "┼",
          right: "│",
          "right-mid": "┤",
          middle: "│",
        },
        style: {
          head: [],
          border: ["gray"],
          "padding-left": 1,
          "padding-right": 1,
        },
        head: [
          theme.primary.bold("File"),
          theme.primary.bold("Size"),
          theme.primary.bold("Dimensions"),
          theme.primary.bold("Status"),
        ],
        colWidths: [32, 10, 14, 10],
      })

      results.forEach(({name, size: dimensions, path: filePath}) => {
        let fileSize = "—"
        try {
          const stat = fs.statSync(filePath)
          fileSize = formatBytes(stat.size)
        } catch {}

        const dimLabel =
          typeof dimensions === "number"
            ? `${dimensions}×${dimensions}`
            : dimensions

        const icon = name.endsWith(".ico")
          ? "🔷"
          : name.endsWith(".webmanifest")
            ? "📋"
            : "🟢"

        table.push([
          `${icon} ${theme.white(name)}`,
          theme.muted(fileSize),
          theme.secondary(dimLabel),
          theme.success("✓ done"),
        ])
      })

      console.log(
        table
          .toString()
          .split("\n")
          .map(line => `  ${line}`)
          .join("\n"),
      )

      // Output directory
      blank()
      infoLine(icons.folder, "Output:", theme.muted(outputDir))
    } catch (err) {
      genSpinner.fail(theme.error("Failed to generate favicons"))
      blank()

      const errBox = boxen(
        [
          `${theme.error.bold("Generation Error")}`,
          "",
          `${theme.muted(err.message)}`,
          "",
          `${theme.subtle("Try using a different image or check file permissions.")}`,
        ].join("\n"),
        {
          padding: 1,
          margin: {top: 0, bottom: 0, left: 2, right: 0},
          borderStyle: "round",
          borderColor: "#FF5252",
        },
      )

      console.log(errBox)
      blank()
      process.exit(1)
    }

    // ═══════════════════════════════════════
    //  STEP 4 — INJECT REFERENCES
    // ═══════════════════════════════════════

    if (options.inject !== false) {
      stepHeader(4, totalSteps, "Inject References")

      const injectSpinner = createSpinner(
        "Injecting favicon references into project files...",
      )
      injectSpinner.start()

      try {
        const injected = injectFavicons(projectType, details)
        if (injected) {
          injectSpinner.succeed(
            `${theme.success("References injected")} into project files`,
          )

          // Show what was modified
          const targetFile = {
            [PROJECT_TYPES.REACT_CRA]: "public/index.html",
            [PROJECT_TYPES.REACT_VITE]: "index.html",
            [PROJECT_TYPES.NEXT_APP]: `${details.useSrc ? "src/" : ""}app/layout.tsx`,
            [PROJECT_TYPES.NEXT_PAGES]: "pages/_document.tsx",
          }

          if (targetFile[projectType]) {
            infoLine(
              icons.inject,
              "Modified:",
              theme.muted(targetFile[projectType]),
            )
          }
        } else {
          injectSpinner.warn(
            theme.warning("Could not auto-inject — add references manually"),
          )
        }
      } catch (err) {
        injectSpinner.warn(
          `${theme.warning("Auto-inject warning:")} ${theme.muted(err.message)}`,
        )
      }
    }

    // ═══════════════════════════════════════
    //  SUMMARY
    // ═══════════════════════════════════════

    const duration = Date.now() - startTime

    blank()

    const summaryBox = boxen(
      [
        successGradient("  ✦ ── FAVICONS SET SUCCESSFULLY ── ✦  "),
        "",
        `  ${icons.lightning} ${theme.muted("Duration:")}     ${theme.white(formatDuration(duration))}`,
        `  ${getProjectIcon(projectType)} ${theme.muted("Project:")}      ${getProjectColor(projectType)(getProjectLabel(projectType))}`,
        `  ${icons.image} ${theme.muted("Source:")}       ${theme.white(path.basename(imagePath))}`,
        `  ${icons.package} ${theme.muted("Output:")}       ${theme.white(details.publicDir || path.join(projectDir, "public"))}`,
        `  ${icons.inject} ${theme.muted("Injected:")}     ${options.inject !== false ? theme.success("Yes") : theme.warning("Skipped")}`,
        "",
        `  ${theme.subtle("Restart your dev server to see the changes.")}`,
      ].join("\n"),
      {
        padding: {top: 1, bottom: 1, left: 1, right: 1},
        margin: {top: 0, bottom: 0, left: 2, right: 0},
        borderStyle: "double",
        borderColor: "#00E676",
      },
    )

    console.log(summaryBox)
    blank()
  })

setCommand.addHelpText(
  "after",
  [
    "",
    boxen(
      [
        `${theme.primary.bold("Smart Flow")}`,
        "",
        `  ${theme.secondary("1.")} Detect project type in ${theme.accent("--dir")}`,
        `  ${theme.secondary("2.")} If not detected, scan: cwd, subfolders, apps/*, packages/*`,
        `  ${theme.secondary("3.")} Pick a detected React/Next.js project`,
        `  ${theme.secondary("4.")} Pick an image ${theme.muted("(.png, .jpg, .jpeg, .webp, .svg)")}`,
        `  ${theme.secondary("5.")} Generate & inject automatically`,
        "",
        `${theme.primary.bold("Examples")}`,
        "",
        `  ${theme.accent("$")} favicli set`,
        `  ${theme.accent("$")} favicli set logo.png`,
        `  ${theme.accent("$")} favicli set ./public/logo.png -d ./apps/web`,
        `  ${theme.accent("$")} favicli set --no-inject`,
      ].join("\n"),
      {
        padding: 1,
        margin: {top: 0, bottom: 0, left: 2, right: 0},
        borderStyle: "round",
        borderColor: "#6C63FF",
      },
    ),
    "",
  ].join("\n"),
)

// ──────────────────────────────────────────────
//  COMMAND: detect
// ──────────────────────────────────────────────

program
  .command("detect")
  .description("Detect the project type")
  .option("-d, --dir <path>", "Project directory", process.cwd())
  .action(options => {
    const projectDir = path.resolve(options.dir)

    blank()

    const spinner = createSpinner("Analyzing project...")
    spinner.start()

    const {type, details} = detectProject(projectDir)
    const detected = type !== PROJECT_TYPES.UNKNOWN

    if (detected) {
      spinner.succeed(theme.success("Project detected"))
    } else {
      spinner.fail(theme.error("No project detected"))
    }

    blank()

    const icon = getProjectIcon(type)
    const color = getProjectColor(type)

    const detailLines = details
      ? Object.entries(details)
          .map(
            ([key, val], i, arr) =>
              `  ${i === arr.length - 1 ? icons.corner : icons.tee}── ${theme.muted(key + ":")} ${theme.white(val)}`,
          )
          .join("\n")
      : `  ${theme.muted("No details available")}`

    const detectBox = boxen(
      [
        `${detected ? icons.check : icons.error}  ${theme.white.bold("Project Detection Result")}`,
        "",
        `  ${theme.muted("Type:")}       ${icon}  ${color.bold(getProjectLabel(type))}`,
        `  ${theme.muted("Directory:")}  ${theme.subtle(projectDir)}`,
        `  ${theme.muted("Status:")}     ${detected ? theme.success("✓ Ready to use") : theme.error("✗ Not supported")}`,
        "",
        detected ? `  ${theme.muted("Details:")}` : "",
        detected ? detailLines : "",
      ]
        .filter(Boolean)
        .join("\n"),
      {
        padding: 1,
        margin: {top: 0, bottom: 0, left: 2, right: 0},
        borderStyle: "round",
        borderColor: detected ? "#00E676" : "#FF5252",
      },
    )

    console.log(detectBox)
    blank()
  })

// ──────────────────────────────────────────────
//  COMMAND: remove
// ──────────────────────────────────────────────

program
  .command("remove")
  .description("Remove generated favicon files")
  .option("-d, --dir <path>", "Project directory", process.cwd())
  .action(async options => {
    const projectDir = path.resolve(options.dir)
    const {details} = detectProject(projectDir)
    const publicDir = details?.publicDir || path.join(projectDir, "public")

    const filesToRemove = [
      "favicon.ico",
      "favicon-16x16.png",
      "favicon-32x32.png",
      "favicon-48x48.png",
      "apple-touch-icon.png",
      "android-chrome-192x192.png",
      "android-chrome-512x512.png",
      "site.webmanifest",
    ]

    // Check which files exist
    const existingFiles = filesToRemove.filter(f =>
      fs.existsSync(path.join(publicDir, f)),
    )

    blank()

    if (existingFiles.length === 0) {
      const emptyBox = boxen(
        [
          `${icons.search}  ${theme.white.bold("Nothing to Remove")}`,
          "",
          `${theme.muted("No generated favicon files found in")}`,
          `${theme.subtle(publicDir)}`,
        ].join("\n"),
        {
          padding: 1,
          margin: {top: 0, bottom: 0, left: 2, right: 0},
          borderStyle: "round",
          borderColor: "#FFD700",
        },
      )

      console.log(emptyBox)
      blank()
      return
    }

    sectionHeader(icons.trash, "Remove Favicons")

    console.log(
      `  ${theme.muted("The following")} ${theme.accent.bold(existingFiles.length)} ${theme.muted("files will be removed:")}`,
    )
    blank()

    existingFiles.forEach((file, i) => {
      const isLast = i === existingFiles.length - 1
      const filePath = path.join(publicDir, file)
      const size = formatBytes(fs.statSync(filePath).size)
      treeLine(theme.white(file), theme.subtle(`(${size})`), isLast)
    })

    blank()

    const {confirm} = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: theme.warning("Permanently delete these files?"),
        default: false,
      },
    ])

    if (!confirm) {
      console.log(`  ${theme.muted("Cancelled. No files were removed.")}`)
      blank()
      return
    }

    blank()
    let removed = 0

    existingFiles.forEach(file => {
      const filePath = path.join(publicDir, file)
      fs.removeSync(filePath)
      console.log(
        `  ${logSymbols.success}  ${theme.muted("Removed")} ${theme.white(file)}`,
      )
      removed += 1
    })

    blank()

    const removeBox = boxen(
      [
        `${icons.check}  ${theme.success.bold(`Removed ${removed} file${removed !== 1 ? "s" : ""}`)}`,
        "",
        `${theme.subtle("You may also want to remove favicon references")}`,
        `${theme.subtle("from your project files (index.html / layout.tsx).")}`,
      ].join("\n"),
      {
        padding: 1,
        margin: {top: 0, bottom: 0, left: 2, right: 0},
        borderStyle: "round",
        borderColor: "#00E676",
      },
    )

    console.log(removeBox)
    blank()
  })

// ──────────────────────────────────────────────
//  DEFAULT (no command)
// ──────────────────────────────────────────────

program
  .argument("[image]", "Image file to use as favicon")
  .action(async image => {
    if (image) {
      await program.parseAsync(["node", "favicli", "set", image])
    } else {
      showHomeScreen()

      const {startupAction} = await inquirer.prompt([
        {
          type: "list",
          name: "startupAction",
          message: theme.primary("What would you like to do?"),
          loop: false,
          pageSize: 10,
          choices: [
            {
              name: `${icons.favicon}  ${theme.white.bold("Set favicons")}            ${theme.subtle("— interactive setup")}`,
              value: "set",
              short: "Set favicons",
            },
            {
              name: `${icons.search}  ${theme.white.bold("Detect project")}          ${theme.subtle("— check project type")}`,
              value: "detect",
              short: "Detect",
            },
            {
              name: `${icons.trash}  ${theme.white.bold("Remove generated files")}  ${theme.subtle("— clean up")}`,
              value: "remove",
              short: "Remove",
            },
            new inquirer.Separator(theme.subtle("─".repeat(44))),
            {
              name: `${icons.gear}  ${theme.muted("Help")}`,
              value: "help",
              short: "Help",
            },
            {
              name: `${theme.muted("   Exit")}`,
              value: "exit",
              short: "Exit",
            },
          ],
        },
      ])

      switch (startupAction) {
        case "set":
          await program.parseAsync(["node", "favicli", "set"])
          break
        case "detect":
          await program.parseAsync(["node", "favicli", "detect"])
          break
        case "remove":
          await program.parseAsync(["node", "favicli", "remove"])
          break
        case "help":
          program.outputHelp()
          break
        case "exit":
          console.log(`  ${theme.muted("Goodbye!")} ${icons.sparkle}`)
          blank()
          break
      }
    }
  })

program.parse()
