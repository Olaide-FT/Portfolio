import { spawn } from "node:child_process";

const services = [
  {
    name: "API server",
    args: ["server/index.js"],
  },
  {
    name: "Vite",
    args: ["node_modules/vite/bin/vite.js"],
  },
];

const children = services.map(({ args }) =>
  spawn(process.execPath, args, {
    cwd: process.cwd(),
    stdio: "inherit",
  }),
);

let shuttingDown = false;

function shutdown(exitCode) {
  if (shuttingDown) return;
  shuttingDown = true;
  process.exitCode = exitCode;
  children.forEach((child) => {
    if (child.exitCode === null && !child.killed) child.kill();
  });
}

children.forEach((child, index) => {
  child.on("error", (error) => {
    console.error(`Failed to start ${services[index].name}:`, error.message);
    shutdown(1);
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    const exitCode = code ?? 1;
    console.error(
      `${services[index].name} stopped${signal ? ` (${signal})` : ` with exit code ${exitCode}`}.`,
    );
    shutdown(exitCode);
  });
});

process.once("SIGINT", () => shutdown(0));
process.once("SIGTERM", () => shutdown(0));
