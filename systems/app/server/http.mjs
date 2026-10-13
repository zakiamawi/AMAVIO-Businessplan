import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import { aiRuntimeSummary, createAssistance } from './ai-service.mjs'
import {
  executeExternalRoleCommand,
  getCaseProjection,
  listAccOutbox,
  receiveAccMessage,
  runtimeContractSummary,
} from './case-service.mjs'
import { databaseSummary, defaultDatabasePath, openDatabase, resetSyntheticCase } from './database.mjs'
import { productionReadinessSummary } from './readiness-policy.mjs'
import { crossSystemContractSummary } from './system-boundaries.mjs'

const defaultHost = '127.0.0.1'
const defaultPort = 4351
const maxBodyBytes = 256 * 1024

function securityHeaders() {
  return {
    'Cache-Control': 'no-store',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  }
}

function send(response, statusCode, payload) {
  response.writeHead(statusCode, { ...securityHeaders(), 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(payload))
}

async function readJson(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > maxBodyBytes) throw new Error('request_too_large')
    chunks.push(chunk)
  }
  if (!chunks.length) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new Error('invalid_json')
  }
}

function routeMatch(pathname, expression) {
  return pathname.match(expression)
}

function statusForReason(reason) {
  if (reason === 'case_not_found') return 404
  if (reason === 'revision_conflict') return 409
  if (reason === 'request_too_large') return 413
  if (reason === 'invalid_json') return 400
  return 422
}

export function createApiRuntime({ databasePath = process.env.AMAVIO_DATABASE_PATH || defaultDatabasePath } = {}) {
  const database = openDatabase(databasePath)
  const handler = async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host || `${defaultHost}:${defaultPort}`}`)
    try {
      if (request.method === 'GET' && url.pathname === '/api/health') {
        send(response, 200, {
          ok: true,
          service: 'amavio-one-cross-system-alignment-local-backend',
          maturity: 'local_synthetic_foundation',
          persistence: 'sqlite',
          database: databaseSummary(database),
          contracts: runtimeContractSummary(),
          ai: aiRuntimeSummary(),
          readiness: productionReadinessSummary(),
          systemBoundaries: crossSystemContractSummary(),
        })
        return
      }

      if (request.method === 'GET' && url.pathname === '/api/v1/readiness') {
        send(response, 200, { ok: true, readiness: productionReadinessSummary() })
        return
      }

      if (request.method === 'GET' && url.pathname === '/api/v1/system-boundaries') {
        send(response, 200, { ok: true, systemBoundaries: crossSystemContractSummary() })
        return
      }

      const caseMatch = routeMatch(url.pathname, /^\/api\/v1\/cases\/([^/]+)$/)
      if (request.method === 'GET' && caseMatch) {
        const projection = getCaseProjection(database, {
          caseId: decodeURIComponent(caseMatch[1]),
          actorId: url.searchParams.get('role'),
          language: url.searchParams.get('lang') === 'en' ? 'en' : 'de',
        })
        send(response, 200, { ok: true, projection })
        return
      }

      const commandMatch = routeMatch(url.pathname, /^\/api\/v1\/cases\/([^/]+)\/commands$/)
      if (request.method === 'POST' && commandMatch) {
        const body = await readJson(request)
        const result = executeExternalRoleCommand(database, {
          ...body,
          caseId: decodeURIComponent(commandMatch[1]),
          language: body.language === 'en' ? 'en' : 'de',
        })
        send(response, result.ok ? 200 : statusForReason(result.reason), result)
        return
      }

      if (request.method === 'POST' && url.pathname === '/api/v1/integration/acc/messages') {
        const result = receiveAccMessage(database, await readJson(request))
        send(response, result.ok ? 200 : statusForReason(result.reason), result)
        return
      }

      if (request.method === 'GET' && url.pathname === '/api/v1/integration/acc/outbox') {
        send(response, 200, {
          ok: true,
          caseId: url.searchParams.get('case') || 'SYN-ARRIVAL-0417',
          messages: listAccOutbox(database, url.searchParams.get('case') || 'SYN-ARRIVAL-0417'),
        })
        return
      }

      if (request.method === 'POST' && url.pathname === '/api/v1/assist') {
        const result = createAssistance(database, await readJson(request))
        send(response, result.ok ? 200 : statusForReason(result.reason), result)
        return
      }

      if (request.method === 'POST' && url.pathname === '/api/v1/synthetic/reset') {
        const body = await readJson(request)
        const state = resetSyntheticCase(database, body.caseId || 'SYN-ARRIVAL-0417')
        send(response, 200, { ok: true, caseId: state.caseId, revision: state.revision })
        return
      }

      send(response, 404, { ok: false, reason: 'route_not_found' })
    } catch (error) {
      const reason = error?.message || 'internal_error'
      send(response, statusForReason(reason), { ok: false, reason })
    }
  }

  return {
    database,
    server: createServer(handler),
    close() {
      database.close()
    },
  }
}

export async function startApiServer({
  host = process.env.AMAVIO_API_HOST || defaultHost,
  port = Number(process.env.AMAVIO_API_PORT || defaultPort),
  databasePath,
} = {}) {
  const runtime = createApiRuntime({ databasePath })
  await new Promise((resolve, reject) => {
    runtime.server.once('error', reject)
    runtime.server.listen(port, host, resolve)
  })
  const address = runtime.server.address()
  console.log(`AMAVIO One local synthetic API listening on http://${host}:${address.port}`)
  return runtime
}

const executedDirectly = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (executedDirectly) {
  const runtime = await startApiServer()
  const shutdown = () => runtime.server.close(() => runtime.close())
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}
