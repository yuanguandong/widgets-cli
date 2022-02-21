#!/usr/bin/env node
const { resolve } = require("path");
const fs = require("fs");
const { promisify } = require("util");
const chalk = require("chalk");
const inquirer = require("inquirer");
const figlet = require("figlet");
const clear = require("clear");
const ora = require("ora");
const download = promisify(require("git-pull-or-clone"));
const { spawn, log } = require("./utils");
const goGitIt = require("go-git-it");

//仓库地址
const repo = "git@github.com:yuanguandong/react-keyevent.git";
const repoUrl = "https://github.com/yuanguandong/react-widgets/tree/master";

//清屏
clear();
//打印logo
log(
  figlet.textSync("WIDGETS-CLI", {
    horizontalLayout: "fitted",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  }),
  "green"
);

//工具方法
const actions = {
  //拉取所有
  fetchAll: async () => {
    // 项⽬名称
    const answer = await inquirer.prompt([
      {
        type: "input",
        message: "DirPath:",
        name: "name",
        default: "widgets",
      },
    ]);
    const dir = resolve(`./${answer.name}`);
    const process = ora(chalk["gray"](`${dir} downloading.....`));
    process.start();
    try {
      await download(repo, dir);
      process.succeed();
      log(`✅ Download All Widgets Success`);
    } catch (e) {
      log(e, "red");
      process.fail();
    }
    tool(answer.name, dir);
  },
  fetchOne: async () => {
    // widget名称
    const widgetNameAnswer = await inquirer.prompt([
      {
        type: "input",
        message: "widgetName:",
        name: "name",
        default: "clock", 
      },
    ]);
    const dirAnswer = await inquirer.prompt([
      {
        type: "input",
        message: "DirPath:",
        name: "name",
        default: ".", 
      },
    ]);
    const dir = resolve(`./${dirAnswer.name}`);
    const process = ora(
      chalk["gray"](`${widgetNameAnswer.name} downloading.....`)
    );
    process.start();
    try {
      goGitIt(`${repoUrl}/${widgetNameAnswer.name}`, dir);
      process.succeed();
      log(`✅ Download ${widgetNameAnswer.name} Success`);
    } catch (e) {
      log(e, "red");
      log("There may be a network problem, please try again later");
      process.fail();
    }
    tool(dirAnswer.name, dir);
  },
  exit: async ({ dir, name }) => {
    log("🖐  Bye Bye!", "yellow");
    return;
  },
};

//工具箱
async function tool(name, dir) {
  const answer = await inquirer.prompt([
    {
      type: "rawlist",
      message: "Action",
      name: "operation",
      choices: Object.keys(actions),
    },
  ]);
  const res = await actions[answer.operation]({ dir, name });
  if (!res) {
    return;
  }
  tool(name, dir);
}

tool();

module.exports = { tool };
