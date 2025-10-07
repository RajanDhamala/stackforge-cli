#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";

const REPO_URL = "https://github.com/RajanDhamala/StackForge.git";

(async () => {
  console.log(chalk.blue.bold("\n Welcome to Stack Forge CLI!\n"));

  const { stack } = await inquirer.prompt([
    {
      type: "list",
      name: "stack",
      message: chalk.yellow("Choose the stack to setup:"),
      choices: [
        { name: "1) Ts + React", value: "Ts_react" },
        { name: "2) Js + React", value: "Js_react" },
        { name: "3) Express + Prisma", value: "Express_Prisma" },
        { name: "4) Express + Mongoose", value: "Express_Mongoose" }
      ]
    }
  ]);

  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: chalk.green("Enter the folder name for your project:"),
      default: "my-app"
    }
  ]);

  const targetDir = path.resolve(projectName);

  console.log(chalk.cyan(`\n Cloning ${stack} branch from GitHub into '${projectName}'...`));
  execSync(`git clone -b ${stack} ${REPO_URL} ${projectName}`, { stdio: "inherit" });

  const gitDir = path.join(targetDir, ".git");
  if (fs.existsSync(gitDir)) {
    console.log(chalk.cyan("🗑 Removing .git folder for a clean project..."));
    fs.removeSync(gitDir);
  }

  let pkgPath = path.join(targetDir, "package.json");
  if (!fs.existsSync(pkgPath)) {
    const subfolders = fs.readdirSync(targetDir).filter(f =>
      fs.statSync(path.join(targetDir, f)).isDirectory()
    );

    for (const folder of subfolders) {
      const possiblePkg = path.join(targetDir, folder, "package.json");
      if (fs.existsSync(possiblePkg)) {
        console.log(chalk.cyan(` Found project inside '${folder}' — moving it up...`));
        fs.copySync(path.join(targetDir, folder), targetDir, { overwrite: true });
        fs.removeSync(path.join(targetDir, folder));
        break;
      }
    }
  }

  if (fs.existsSync(path.join(targetDir, "package.json"))) {
    console.log(chalk.cyan("\n Installing base dependencies..."));
    execSync("npm install", { cwd: targetDir, stdio: "inherit" });
  }

  let optionalPackages = [];

  if (stack.startsWith("Express")) {
    optionalPackages = ["socket.io", "redis", "ioredis", "bull", "helmet", "multer", "cloudinary"];
  } else if (stack.endsWith("React")) {
    optionalPackages = ["socket.io-client"];
  }

  if (optionalPackages.length > 0) {
    const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, "package.json"), "utf-8"));
    const existingDeps = Object.keys(pkg.dependencies || {});
    optionalPackages = optionalPackages.filter(p => !existingDeps.includes(p));

    if (optionalPackages.length > 0) {
      const { extraPackages } = await inquirer.prompt([
        {
          type: "checkbox",
          name: "extraPackages",
          message: chalk.yellow("Select optional packages to install:"),
          choices: optionalPackages
        }
      ]);

      if (extraPackages.length > 0) {
        console.log(chalk.cyan("\n Installing optional packages..."));
        execSync(`npm install ${extraPackages.join(" ")}`, { cwd: targetDir, stdio: "inherit" });
      }
    }
  }

  console.log(chalk.green.bold(`\n Setup complete! Your ${stack} project is ready in '${projectName}'`));
})();

