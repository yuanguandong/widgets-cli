const chalk = require("chalk");
const { spawn: _spawn } = require("child_process");

const spawn = async (...args) => {
  return new Promise((resolve) => {
    const proc = _spawn(...args);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on("close", (...restArgs) => {
      resolve(restArgs);
    });
  });
};

const log = (msg, color = "green", ...arg) =>
  console.log(chalk[color](msg, arg));

module.exports = { spawn, log };
