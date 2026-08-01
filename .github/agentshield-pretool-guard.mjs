const input = await new Promise((resolve) => {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => {
    data += chunk;
  });
  process.stdin.on("end", () => resolve(data));
});

let payload = {};
try {
  payload = input ? JSON.parse(input) : {};
} catch {
  payload = {};
}

const command = String(payload.tool_input?.command || payload.command || "");
const blockedPatterns = [
  /\brm\s+-rf\b/i,
  /\bsudo\b/i,
  /\bchmod\s+777\b/i,
  /git\s+reset\s+--hard/i,
  /git\s+push\s+--force/i,
  /\bssh\b/i,
  />\s*\/dev\//i,
];

if (blockedPatterns.some((pattern) => pattern.test(command))) {
  console.error("Blocked by AgentShield pretool guard");
  process.exit(2);
}
