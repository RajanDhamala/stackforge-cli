#!/usr/bin/env node
import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";
import { cwd } from "process";

const Main=async(repo)=>{
console.log(chalk.green('repo url paio hai sathy ',repo))

const answers=await inquirer.prompt([{
  name:"folder_name",
  type:"input",
  message:"Setup ur root folder name"
}])

console.log(chalk.red("folder mande",answers.folder_name))

const choices=[
  {
    name:"1) Ract+ Js",value:"Js_react"
  },{
    name:"2) React+ Ts",value:"Ts_react"
  },{
    name:"3) Express+ Prisma",value:"Express_Prisma"
  },{
    name:"4) Express+ Mongoose",value:"Express_Mongoose"
  }
]

const stack=await inquirer.prompt([{
  name:'stack_option',
  type:'list',
  message:"choose ur stack",
  choices
}])

const rootdir=path.resolve(path.resolve(cwd()),'.github')
console.log("stack choosed iz",stack.stack_option)
const targetDir=path.resolve(answers.folder_name)
console.log("abosulte",targetDir)
execSync(`git clone --branch ${stack.stack_option} --single-branch ${repo} "${targetDir}"`,{
  stdio:"inherit"
})

const gitDir=path.join(targetDir,'.git')
if(fs.existsSync(gitDir)){
  console.log("git found haai")
  fs.removeSync(gitDir)
}

const folders = fs.readdirSync(targetDir)
  .filter(name => fs.statSync(path.join(targetDir, name)).isDirectory());
for (const folder of folders ){
  if(folder ===".github"){
    console.log("folder named github found")
    const srcfolder=path.join(targetDir,folder)
    fs.copySync(srcfolder,rootdir,{overwrite:true})
    fs.removeSync(srcfolder)
    continue;
  }
  const folderpath=path.join(targetDir,folder)
  const pkgfile=path.join(folderpath,"package.json");

  if(fs.existsSync(pkgfile)){
    console.log("package.json file found on folder");
    const items=fs.readdirSync(folderpath)

    for (const item of items){
  fs.moveSync(path.join(folderpath,item),path.join(targetDir,item),{overwrite:true})
    }
    fs.removeSync(folderpath)
   execSync("npm install", { cwd: targetDir, stdio: "inherit" });
   execSync("touch .env",{cwd:targetDir,stdio:"inherit"})
    break ;
  }else{
    console.log(`no package.json file found in ${folder}, skipping...`)
  }
}
const readfile=fs.readFileSync(path.join(targetDir,'.gitignore'),"utf-8");
console.log("data insie .gitignore=",readfile)
if(readfile.includes(".env")){
  console.log("ignore .env found inside")
  fs.writeFileSync(path.join(targetDir,'.env'),"forntendurl='lauda' ","utf-8")
}
}





















const repourl=`https://github.com/RajanDhamala/stackforge`
const branches=['Express_Prisma','Express_Mongoose','Ts_react','Js_react']
Main(repourl);
