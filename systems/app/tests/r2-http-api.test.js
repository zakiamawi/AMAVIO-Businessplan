import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { startApiServer } from '../server/http.mjs'

test('local HTTP API exposes health and role-minimised case projection', async () => {
  const folder = mkdtempSync(join(tmpdir(), 'amavio-r2-http-'))
  const runtime = await startApiServer({ port: 0, databasePath: join(folder, 'test.sqlite') })
  const { port } = runtime.server.address()
  const baseUrl = `http://127.0.0.1:${port}`
  try {
    const healthResponse = await fetch(`${baseUrl}/api/health`)
    const health = await healthResponse.json()
    assert.equal(healthResponse.status, 200)
    assert.equal(health.ok, true)
    assert.equal(health.persistence, 'sqlite')
    assert.equal(health.contracts.authentication, 'not_implemented')
    assert.equal(health.ai.externalProviderEnabled, false)
    assert.equal(health.readiness.productiveReleaseAllowed, false)
    assert.equal(health.readiness.contracts.identity, 'amavio.one.identity-tenant-rights.v1')
    assert.equal(health.systemBoundaries.products.length, 3)
    assert.equal(health.systemBoundaries.transports.appAccConnected, false)
    assert.equal(health.systemBoundaries.transports.appCrmAllowed, false)

    const readinessResponse = await fetch(`${baseUrl}/api/v1/readiness`)
    const readiness = await readinessResponse.json()
    assert.equal(readinessResponse.status, 200)
    assert.equal(readiness.ok, true)
    assert.equal(readiness.readiness.closedGates.length, 9)

    const boundariesResponse = await fetch(`${baseUrl}/api/v1/system-boundaries`)
    const boundaries = await boundariesResponse.json()
    assert.equal(boundariesResponse.status, 200)
    assert.equal(boundaries.ok, true)
    assert.equal(boundaries.systemBoundaries.contractVersions.ownership, 'amavio.cross-system.ownership-registry.v1')
    assert.equal(boundaries.systemBoundaries.separation.sharedDatabaseAllowed, false)

    const caseResponse = await fetch(`${baseUrl}/api/v1/cases/SYN-ARRIVAL-0417?role=partner&lang=en`)
    const payload = await caseResponse.json()
    assert.equal(caseResponse.status, 200)
    assert.equal(payload.projection.actorId, 'partner')
    assert.equal(payload.projection.objects.every((entry) => !['ProfessionalTask', 'HousingCapacity'].includes(entry.objectType)), true)
    assert.equal(caseResponse.headers.get('x-content-type-options'), 'nosniff')
  } finally {
    await new Promise((resolve) => runtime.server.close(resolve))
    runtime.close()
    rmSync(folder, { recursive: true, force: true })
  }
})
