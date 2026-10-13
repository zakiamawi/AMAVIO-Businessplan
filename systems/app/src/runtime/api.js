const caseId = 'SYN-ARRIVAL-0417'

async function request(path, options = {}) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 4000)
  try {
    const response = await fetch(path, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      signal: controller.signal,
    })
    const payload = await response.json()
    if (!response.ok || payload.ok === false) throw new Error(payload.reason || `http_${response.status}`)
    return payload
  } finally {
    window.clearTimeout(timeout)
  }
}

export function getRuntimeHealth() {
  return request('/api/health')
}

export async function getRemoteProjection(roleId, language) {
  const payload = await request(`/api/v1/cases/${caseId}?role=${encodeURIComponent(roleId)}&lang=${encodeURIComponent(language)}`)
  return payload.projection
}

export async function executeRemoteCommand({ roleId, language, projection }) {
  const payload = await request(`/api/v1/cases/${caseId}/commands`, {
    method: 'POST',
    body: JSON.stringify({
      actorId: roleId,
      commandId: projection.next?.id,
      expectedRevision: projection.revision,
      idempotencyKey: `ui:${roleId}:${projection.next?.id}:${projection.revision}`,
      language,
    }),
  })
  return payload
}

export function requestAssistance({ roleId, language, projection, purpose = 'explain_next_step' }) {
  return request('/api/v1/assist', {
    method: 'POST',
    body: JSON.stringify({
      caseId,
      roleId,
      language,
      purpose,
      projection,
      synthetic: true,
    }),
  })
}
