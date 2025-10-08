#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import chalk from "chalk";
import { cwd } from "process";
import { createSpinner } from "nanospinner";

const args = process.argv.slice(2);
const isVerbose = args.includes("-v") || args.includes("--verbose");
const isAdvanced = args.includes("-a") || args.includes("--advanced");

function log(...x) {
  if (isVerbose) console.log(...x);
}

// Async runCommand for proper spinner animation
const runCommand = (command, options = {}, message) => {
  return new Promise((resolve, reject) => {
    const spinner = message ? createSpinner(message).start() : null;
    const child = exec(command, options, (err, stdout, stderr) => {
      if (err) {
        if (spinner) spinner.error({ text: message || "Command failed" });
        reject(err);
      } else {
        if (spinner) spinner.success({ text: message });
        resolve(stdout);
      }
    });

    // Show output only in verbose mode
    if (isVerbose) {
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
    }
  });
};

const Main = async (repo) => {
  console.log(chalk.cyan.bold("\n StackForge Setup Starting...\n"));

  const stackChoices = [
    { name: "React + JS", value: "Js_react" },
    { name: "React + TS", value: "Ts_react" },
    { name: "Express + Prisma", value: "Express_Prisma" },
    { name: "Express + Mongoose", value: "Express_Mongoose" },
  ];
  const { stack_option } = await inquirer.prompt([
    {
      name: "stack_option",
      type: "list",
      message: "Choose your stack:",
      choices: stackChoices,
    },
  ]);
  log(chalk.gray("Stack chosen:"), stack_option);

  let folder_name = "stackforge-project";
  const { folder_name: fn } = await inquirer.prompt([
    {
      name: "folder_name",
      type: "input",
      message: "Enter your project folder name:",
      default: folder_name,
    },
  ]);
  folder_name = fn;
  log(chalk.gray("Folder name:"), folder_name);

  const targetDir = path.resolve(folder_name);
  fs.ensureDirSync(targetDir);

  const cloneMessages = [
    " Preparing your cosmic project...",
    " Fetching your code spaceship...",
    "Summoning the project magic...",
    " Launching your dev rocket..."
  ];

  let i = 0;
  const cloneSpinner = createSpinner(cloneMessages[i]).start();
  const interval = setInterval(() => {
    i = (i + 1) % cloneMessages.length;
    cloneSpinner.update({ text: cloneMessages[i] });
  }, 800);

  try {
    await runCommand(
      `git clone --branch ${stack_option} --single-branch ${repo} "${targetDir}"`,
      { stdio: "pipe" }
    );
    clearInterval(interval);
    cloneSpinner.success({ text: " Project brewed successfully!" });
  } catch (err) {
    clearInterval(interval);
    cloneSpinner.error({ text: " Failed to brew project." });
    process.exit(1);
  }

  const gitDir = path.join(targetDir, ".git");
  if (fs.existsSync(gitDir)) fs.removeSync(gitDir);

  const folders = fs
    .readdirSync(targetDir)
    .filter((name) => fs.statSync(path.join(targetDir, name)).isDirectory());

  for (const folder of folders) {
    if (folder === ".github") {
      fs.copySync(path.join(targetDir, folder), path.resolve(cwd(), ".github"), {
        overwrite: true,
      });
      fs.removeSync(path.join(targetDir, folder));
      continue;
    }
    const folderpath = path.join(targetDir, folder);
    const pkgfile = path.join(folderpath, "package.json");
    if (fs.existsSync(pkgfile)) {
      for (const item of fs.readdirSync(folderpath)) {
        fs.moveSync(path.join(folderpath, item), path.join(targetDir, item), {
          overwrite: true,
        });
      }
      fs.removeSync(folderpath);
      break;
    }
  }

  await runCommand("npm install", { cwd: targetDir }, " Installing dependencies...");

  // Setup .env
  const envPath = path.join(targetDir, ".env");
  if (!fs.existsSync(envPath)) {
    if (/Express_Prisma/i.test(stack_option)) {
      fs.writeFileSync(
        envPath,
        ["ACCESS_TOKEN_SECRET=hahahaSecret", "REFRESH_TOKEN_SECRET=etrakoSecret%"].join("\n"),
        "utf-8"
      );
    } else if (/Express_Mongoose/i.test(stack_option)) {
      fs.writeFileSync(
        envPath,
        [
          "MONGODB_URL='mongodb://localhost:27017/mydb'",
          "ACCESS_TOKEN_SECRET=hahahaSecret",
          "REFRESH_TOKEN_SECRET=etrakoSecret%",
        ].join("\n"),
        "utf-8"
      );
    } else {
      fs.writeFileSync(envPath, "VITE_BASE_URL='http://localhost:8000'", "utf-8");
    }
  }

  const ignorePath = path.join(targetDir, ".gitignore");
  if (!fs.existsSync(ignorePath)) fs.writeFileSync(ignorePath, ".env\n", "utf-8");
  else {
    const content = fs.readFileSync(ignorePath, "utf-8");
    if (!content.includes(".env")) fs.appendFileSync(ignorePath, "\n.env\n");
  }

  if (isAdvanced) {
    let extraChoices = [];
    if (/React/i.test(stack_option)) {
      extraChoices = [
        { name: "WebSocket", value: "websocket" },
        { name: "@acernity/ui", value: "@acernity/ui" },
      ];
    } else if (/Express/i.test(stack_option)) {
      extraChoices = [
        { name: "Redis", value: "redis" },
        { name: "Socket.IO", value: "socket.io" },
        { name: "Bull Queue", value: "bull" },
        { name: "Kafka", value: "kafka" },
      ];
    }

    if (extraChoices.length > 0) {
      const { extras } = await inquirer.prompt([
        {
          name: "extras",
          type: "checkbox",
          message: "Select additional packages to install:",
          choices: extraChoices,
        },
      ]);

      if (extras.length > 0) {
        await runCommand(
          `npm install ${extras.join(" ")}`,
          { cwd: targetDir },
          `⚡ Installing extras: ${extras.join(", ")}`
        );
      }
    }
  }

  if (/Express_Prisma/i.test(stack_option)) {
    const prismaDir = path.join(targetDir, "prisma");
    if (!fs.existsSync(prismaDir)) {
      await runCommand("npx prisma init", { cwd: targetDir }, " Initializing Prisma...");
    }
  }

  // Fancy final message
console.log(chalk.green.bold("Project setup completed!"));
console.log(chalk.cyanBright(`→ cd ${folder_name} && npm run dev`));


};

const repourl = `https://github.com/RajanDhamala/stackforge`;
Main(repourl).catch((e) => {
  console.error(chalk.red("Error during setup:"), e.message);
  process.exit(1);
});

