import { spawn } from 'node:child_process'

const children = [
  spawn(process.execPath, ['server/http.mjs'], { stdio: 'inherit' }),
  spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev:frontend', '--', ...process.argv.slice(2)], { stdio: 'inherit' }),
]

let exiting = false
function stop(signal = 'SIGTERM') {
  if (exiting) return
  exiting = true
  for (const child of children) {
    if (!child.killed) child.kill(signal)
  }
}

for (const child of children) {
  child.on('exit', (code) => {
    if (!exiting && code) process.exitCode = code
    stop()
  })
}

process.on('SIGINT', () => stop('SIGINT'))
process.on('SIGTERM', () => stop('SIGTERM'))
