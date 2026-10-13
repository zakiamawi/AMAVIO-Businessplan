import { createHash, randomUUID } from 'node:crypto'
import { getCaseProjection } from './case-service.mjs'
import { recordAudit, utcNow } from './database.mjs'
import { evaluateAiOperation } from './readiness-policy.mjs'

export const allowedAiPurposes = Object.freeze(['explain_next_step', 'summarize_visible_status', 'draft_support_question'])
export const aiProviderId = 'local_policy_assistant'

function languageText(language, de, en) {
  return language === 'en' ? en : de
}

function hashInput(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex')
}

function validateRequest(request) {
  const policy = evaluateAiOperation({
    synthetic: request.synthetic,
    roleId: request.roleId,
    purpose: request.purpose,
    provider: process.env.AMAVIO_AI_PROVIDER || aiProviderId,
    dataClasses: request.dataClasses || ['synthetic_demo'],
    autonomy: 'assistive_only',
    caseMutation: false,
    decisionEffect: false,
  })
  return policy.allowed ? null : policy.reason
}

function buildLocalResponse(request) {
  const { projection, language = 'de', purpose } = request
  const next = projection.next
  const status = next
    ? languageText(language, `Als Nächstes ist ${next.actorLabel} verantwortlich: ${next.title}.`, `Next, ${next.actorLabel} is responsible: ${next.title}.`)
    : languageText(language, 'Die synthetische Arrival-Reise ist abgeschlossen.', 'The synthetic arrival journey is complete.')
  const roleAction = next?.canAct
    ? languageText(language, `Sie können den Schritt „${next.action}“ bewusst öffnen.`, `You can deliberately open “${next.action}”.`)
    : languageText(language, 'Sie müssen aktuell nichts erneut einreichen.', 'You do not need to resubmit anything at this time.')
  const boundary = languageText(
    language,
    'Diese Assistenz erklärt nur den sichtbaren synthetischen Stand. Sie bewertet keine Person und trifft keine Entscheidung.',
    'This assistant only explains the visible synthetic state. It does not assess a person or make a decision.',
  )
  const headingByPurpose = {
    explain_next_step: languageText(language, 'Ihr nächster Schritt – verständlich erklärt', 'Your next step — clearly explained'),
    summarize_visible_status: languageText(language, 'Zusammenfassung Ihres sichtbaren Stands', 'Summary of your visible status'),
    draft_support_question: languageText(language, 'Vorbereitete strukturierte Rückfrage', 'Prepared structured question'),
  }
  return {
    heading: headingByPurpose[purpose],
    summary: `${status} ${roleAction}`,
    boundary,
    source: 'role_minimised_projection',
    provider: aiProviderId,
    decisionEffect: false,
    synthetic: true,
  }
}

export function createAssistance(database, request) {
  const error = validateRequest(request)
  if (error) return { ok: false, reason: error }
  const projection = getCaseProjection(database, {
    caseId: request.caseId,
    actorId: request.roleId,
    language: request.language,
  })
  const safeRequest = { ...request, projection }
  const response = buildLocalResponse(safeRequest)
  const id = `AI-SYN-${randomUUID()}`
  database.prepare(`
    INSERT INTO ai_requests (
      id, case_id, role_id, purpose, provider, input_hash, decision_effect, response_json, created_at_utc
    ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
  `).run(
    id,
    request.caseId,
    request.roleId,
    request.purpose,
    aiProviderId,
    hashInput({ purpose: request.purpose, projection }),
    JSON.stringify(response),
    utcNow(),
  )
  recordAudit(database, 'assistive_explanation_created', 'ai_request', id, {
    caseId: request.caseId,
    roleId: request.roleId,
    purpose: request.purpose,
    provider: aiProviderId,
    decisionEffect: false,
  })
  return { ok: true, requestId: id, response }
}

export function aiRuntimeSummary() {
  return {
    provider: aiProviderId,
    externalProviderEnabled: false,
    purposes: allowedAiPurposes,
    decisionsAllowed: false,
    matchingAllowed: false,
    scoringAllowed: false,
    realDataAllowed: false,
  }
}
