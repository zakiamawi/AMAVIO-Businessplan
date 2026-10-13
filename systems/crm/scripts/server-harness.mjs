import { spawn } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function withLocalServer(port, work) {
  const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");
  const child = spawn(process.execPath, [viteBin, "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk; });
  child.stderr.on("data", (chunk) => { output += chunk; });
  try {
    const url = `http://127.0.0.1:${port}`;
    await waitForServer(url, child, () => output);
    return await work(url);
  } finally {
    child.kill("SIGTERM");
    await Promise.race([
      new Promise((resolve) => child.once("exit", resolve)),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);
    if (!child.killed) child.kill("SIGKILL");
  }
}

export async function withCrmServer(port, work) {
  const dataDir = await mkdtemp(path.join(tmpdir(), "amavio-crm-r3-15-qa-"));
  const child = spawn(process.execPath, [path.join(root, "scripts", "local-crm-server.mjs")], {
    cwd: root,
    env: { ...process.env, AMAVIO_CRM_PORT: String(port), AMAVIO_CRM_DATA_DIR: dataDir },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk; });
  child.stderr.on("data", (chunk) => { output += chunk; });
  try {
    const url = `http://127.0.0.1:${port}`;
    await waitForServer(`${url}/api/health`, child, () => output);
    return await work(url);
  } finally {
    child.kill("SIGTERM");
    await Promise.race([
      new Promise((resolve) => child.once("exit", resolve)),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);
    if (!child.killed) child.kill("SIGKILL");
  }
}

async function waitForServer(url, child, readOutput) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Lokaler Vite-Server wurde beendet.\n${readOutput()}`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Der lokale Server startet noch.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Lokaler Vite-Server ist nicht erreichbar.\n${readOutput()}`);
}
