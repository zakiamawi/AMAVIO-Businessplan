import { spawnSync } from 'node:child_process'

const commands = [
  ['npm', ['run', 'lint']],
  ['npm', ['run', 'test']],
  ['node', ['scripts/cross-system-source-audit.mjs']],
  ['node', ['scripts/acc-contract-compatibility-audit.mjs']],
  ['npm', ['run', 'build']],
]

for (const [command, args] of commands) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: false })
  if (result.status !== 0) process.exit(result.status || 1)
}

console.log('AMAVIO One App quality gate passed: lint, tests, three-system source audit, ACC compatibility audit and single-entry build are green.')
