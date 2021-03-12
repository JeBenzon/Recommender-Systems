//Kører et program i bash og lukket det ned igen.
require("child_process").spawn('bash', ['alfa.exe test'], {
    cwd: process.cwd(),
    detached: true,
    stdio: "inherit"
  });