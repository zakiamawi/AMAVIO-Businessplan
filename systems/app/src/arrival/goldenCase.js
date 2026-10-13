import { freezeDeep } from './contracts.js'

const text = (de, en) => ({ de, en })

export const arrivalPhases = freezeDeep([
  { id: 'mandate', label: text('Mandat & Readiness', 'Mandate & readiness') },
  { id: 'access', label: text('Einladung & Zugang', 'Invitation & access') },
  { id: 'before_arrival', label: text('Vor Anreise', 'Before arrival') },
  { id: 'arrival', label: text('Ankunft & Übergabe', 'Arrival & handover') },
  { id: 'work_start', label: text('Berufsstart', 'Work start') },
  { id: 'stabilisation', label: text('Stabilisierung', 'Stabilisation') },
  { id: 'closure', label: text('Abschluss', 'Closure') },
])

const object = (id, objectType, ownerRole, status, label, payload) => ({
  id,
  objectType,
  ownerRole,
  status,
  version: 1,
  synthetic: true,
  label,
  payload,
})

export const initialArrivalObjects = freezeDeep([
  object('syn_role_professional', 'RoleContext', 'professional', null, text('Eigener Arrival-Kontext', 'Own arrival context'), { organisationLabel: 'SYN-Fachkraftkontext', purpose: 'arrival_support' }),
  object('syn_role_housing', 'RoleContext', 'housing', null, text('Eigener Wohnkontext', 'Own housing context'), { organisationLabel: 'SYN-Wohnorganisation', purpose: 'housing_capacity' }),
  object('syn_role_partner', 'RoleContext', 'partner', null, text('Eigener Partnerkontext', 'Own partner context'), { organisationLabel: 'SYN-Partnerorganisation', purpose: 'local_offer' }),
  object('syn_task_arrival', 'ProfessionalTask', 'professional', 'locked', text('Arrival-Plan bestätigen', 'Confirm arrival plan'), { category: 'arrival_readiness', dueWindow: 'SYN-W01', nextResponsibility: 'workflow_core' }),
  object('syn_support_workstart', 'SupportRequest', 'professional', 'submitted', text('Unterstützung zum Berufsstart', 'Work-start support'), { category: 'orientation', urgency: 'normal', nextResponsibility: 'workflow_core' }),
  object('syn_housing_capacity', 'HousingCapacity', 'housing', 'draft', text('Kapazität Düsseldorf-Bilk', 'Capacity Düsseldorf-Bilk'), { category: 'temporary_housing', region: 'SYN-DUS-BILK', availabilityWindow: 'SYN-W02', unitBand: 'one_to_three' }),
  object('syn_housing_need', 'HousingNeed', null, 'open', text('Minimierter Wohnbedarf', 'Minimised housing need'), { category: 'temporary_housing', quantityBand: 'one_to_three', regionCode: 'SYN-DUS', windowCode: 'SYN-W02' }),
  object('syn_housing_response', 'HousingNeedResponse', 'housing', 'draft', text('Strukturierte Wohnantwort', 'Structured housing response'), { fit: 'conditional', reasonCategory: 'availability_window', nextResponsibility: 'housing' }),
  object('syn_handover', 'HandoverSignal', 'housing', 'open', text('Readiness der Übergabe', 'Handover readiness'), { readiness: 'preparation_open', windowCode: 'SYN-W03', nextResponsibility: 'housing' }),
  object('syn_partner_offer', 'PartnerOffer', 'partner', 'draft', text('Orientierungsangebot Düsseldorf', 'Düsseldorf orientation offer'), { category: 'orientation', capacityBand: 'small', windowCode: 'SYN-W04' }),
  object('syn_partner_demand', 'PartnerDemand', null, 'open', text('Minimierte Partnernachfrage', 'Minimised partner demand'), { category: 'orientation', quantityBand: 'one_to_three', regionCode: 'SYN-DUS' }),
  object('syn_partner_response', 'PartnerDemandResponse', 'partner', 'draft', text('Strukturierte Partnerantwort', 'Structured partner response'), { fit: 'matching_category', capacityBand: 'small', nextResponsibility: 'partner' }),
  object('syn_role_message', 'RoleMessage', 'professional', 'unread', text('Nächster Stabilisierungsschritt', 'Next stabilisation step'), { category: 'next_step', nextResponsibility: 'professional' }),
  object('syn_review_cost', 'ReviewDecision', null, 'pending', text('Freigabe Übergabeunterstützung', 'Handover support approval'), { targetObject: 'syn_handover', reasonCategory: 'cost_scope', outcome: null, nextResponsibility: 'employer' }),
])

const transition = ({ id, phaseId, actor, contractActor = actor, objectId, to, at, title, action, visibility, disruption = null }) => ({
  id,
  kind: 'transition',
  phaseId,
  actor,
  contractActor,
  objectId,
  to,
  at,
  title,
  action,
  visibility,
  disruption,
})

const signal = ({ id, phaseId, actor, at, eventType, title, action, visibility, objectId = null, result = 'recorded', disruption = null }) => ({
  id,
  kind: 'signal',
  phaseId,
  actor,
  objectId,
  at,
  eventType,
  title,
  action,
  visibility,
  result,
  disruption,
})

export const goldenCaseSteps = freezeDeep([
  signal({ id: 'CMD-001', phaseId: 'mandate', actor: 'employer', at: '2026-10-14T08:00:00Z', eventType: 'mandate_readiness_confirmed', title: text('Mandat, Verantwortungen und Startgrenze bestätigt', 'Mandate, responsibilities and start boundary confirmed'), action: text('Readiness bestätigen', 'Confirm readiness'), visibility: ['employer', 'operations'] }),
  transition({ id: 'CMD-002', phaseId: 'access', actor: 'workflow_core', objectId: 'syn_task_arrival', to: 'open', at: '2026-10-14T08:01:00Z', title: text('Arrival-Aufgabe kontrolliert geöffnet', 'Arrival task opened in a controlled way'), action: text('Automatisch öffnen', 'Open automatically'), visibility: ['professional', 'operations'] }),
  transition({ id: 'CMD-003', phaseId: 'access', actor: 'professional', objectId: 'syn_task_arrival', to: 'submitted', at: '2026-10-14T08:12:00Z', title: text('Fachkraft hat den Arrival-Plan strukturiert bestätigt', 'Professional submitted the structured arrival plan'), action: text('Arrival-Plan bestätigen', 'Confirm arrival plan'), visibility: ['professional', 'operations'] }),
  transition({ id: 'CMD-004', phaseId: 'access', actor: 'workflow_core', objectId: 'syn_task_arrival', to: 'under_review', at: '2026-10-14T08:13:00Z', title: text('Arrival-Plan an AMAVIO-Prüfung übergeben', 'Arrival plan handed to AMAVIO review'), action: text('In Prüfung geben', 'Send to review'), visibility: ['professional', 'operations'] }),
  transition({ id: 'CMD-005', phaseId: 'access', actor: 'operations', contractActor: 'amavio_acc', objectId: 'syn_task_arrival', to: 'completed', at: '2026-10-14T08:30:00Z', title: text('Zugang und Arrival-Plan fachlich abgeschlossen', 'Access and arrival plan completed'), action: text('Prüfung abschließen', 'Complete review'), visibility: ['professional', 'operations'] }),

  transition({ id: 'CMD-006', phaseId: 'before_arrival', actor: 'housing', objectId: 'syn_housing_capacity', to: 'submitted', at: '2026-10-15T09:00:00Z', title: text('Wohnkapazität zur Prüfung eingereicht', 'Housing capacity submitted for review'), action: text('Kapazität einreichen', 'Submit capacity'), visibility: ['housing', 'operations'] }),
  transition({ id: 'CMD-007', phaseId: 'before_arrival', actor: 'workflow_core', objectId: 'syn_housing_capacity', to: 'under_review', at: '2026-10-15T09:01:00Z', title: text('Wohnkapazität in kontrollierter Prüfung', 'Housing capacity in controlled review'), action: text('In Prüfung geben', 'Send to review'), visibility: ['housing', 'operations'] }),
  transition({ id: 'CMD-008', phaseId: 'before_arrival', actor: 'operations', contractActor: 'amavio_acc', objectId: 'syn_housing_capacity', to: 'changes_requested', at: '2026-10-15T09:20:00Z', title: text('Zeitfenster muss präzisiert werden', 'Availability window needs clarification'), action: text('Änderung anfordern', 'Request change'), visibility: ['housing', 'operations'], disruption: 'changes_requested' }),
  transition({ id: 'CMD-009', phaseId: 'before_arrival', actor: 'housing', objectId: 'syn_housing_capacity', to: 'draft', at: '2026-10-15T09:42:00Z', title: text('Wohnanbieter übernimmt die Rückfrage in den Entwurf', 'Housing provider returns the question to draft'), action: text('Rückfrage übernehmen', 'Take over question'), visibility: ['housing', 'operations'] }),
  transition({ id: 'CMD-010', phaseId: 'before_arrival', actor: 'housing', objectId: 'syn_housing_capacity', to: 'submitted', at: '2026-10-15T10:05:00Z', title: text('Präzisierte Wohnkapazität erneut eingereicht', 'Clarified housing capacity resubmitted'), action: text('Präzisierte Version einreichen', 'Submit clarified version'), visibility: ['housing', 'operations'] }),
  transition({ id: 'CMD-011', phaseId: 'before_arrival', actor: 'workflow_core', objectId: 'syn_housing_capacity', to: 'under_review', at: '2026-10-15T10:06:00Z', title: text('Neue Kapazitätsversion in Prüfung', 'New capacity version in review'), action: text('In Prüfung geben', 'Send to review'), visibility: ['housing', 'operations'] }),
  transition({ id: 'CMD-012', phaseId: 'before_arrival', actor: 'operations', contractActor: 'amavio_acc', objectId: 'syn_housing_capacity', to: 'approved', at: '2026-10-15T10:30:00Z', title: text('Wohnkapazität für den nächsten Schritt freigegeben', 'Housing capacity approved for the next step'), action: text('Kapazität freigeben', 'Approve capacity'), visibility: ['housing', 'operations'] }),

  transition({ id: 'CMD-013', phaseId: 'before_arrival', actor: 'partner', objectId: 'syn_partner_offer', to: 'submitted', at: '2026-10-15T11:00:00Z', title: text('Orientierungsangebot eingereicht', 'Orientation offer submitted'), action: text('Angebot einreichen', 'Submit offer'), visibility: ['partner', 'operations'] }),
  transition({ id: 'CMD-014', phaseId: 'before_arrival', actor: 'workflow_core', objectId: 'syn_partner_offer', to: 'under_review', at: '2026-10-15T11:01:00Z', title: text('Partnerangebot in kontrollierter Prüfung', 'Partner offer in controlled review'), action: text('In Prüfung geben', 'Send to review'), visibility: ['partner', 'operations'] }),
  transition({ id: 'CMD-015', phaseId: 'before_arrival', actor: 'operations', contractActor: 'amavio_acc', objectId: 'syn_partner_offer', to: 'approved', at: '2026-10-15T11:25:00Z', title: text('Partnerangebot für den nächsten Schritt freigegeben', 'Partner offer approved for the next step'), action: text('Angebot freigeben', 'Approve offer'), visibility: ['partner', 'operations'] }),

  transition({ id: 'CMD-016', phaseId: 'before_arrival', actor: 'housing', objectId: 'syn_housing_response', to: 'submitted', at: '2026-10-15T12:00:00Z', title: text('Strukturierte Wohnantwort eingereicht', 'Structured housing response submitted'), action: text('Wohnantwort einreichen', 'Submit housing response'), visibility: ['housing', 'operations'] }),
  transition({ id: 'CMD-017', phaseId: 'before_arrival', actor: 'workflow_core', objectId: 'syn_housing_response', to: 'under_review', at: '2026-10-15T12:01:00Z', title: text('Wohnantwort in Prüfung', 'Housing response in review'), action: text('In Prüfung geben', 'Send to review'), visibility: ['housing', 'operations'] }),
  transition({ id: 'CMD-018', phaseId: 'before_arrival', actor: 'operations', contractActor: 'amavio_acc', objectId: 'syn_housing_response', to: 'acknowledged', at: '2026-10-15T12:20:00Z', title: text('Wohnantwort entgegengenommen – keine Zuteilung', 'Housing response acknowledged — no allocation'), action: text('Antwort entgegennehmen', 'Acknowledge response'), visibility: ['housing', 'operations'] }),

  transition({ id: 'CMD-019', phaseId: 'before_arrival', actor: 'partner', objectId: 'syn_partner_response', to: 'submitted', at: '2026-10-15T13:00:00Z', title: text('Strukturierte Partnerantwort eingereicht', 'Structured partner response submitted'), action: text('Partnerantwort einreichen', 'Submit partner response'), visibility: ['partner', 'operations'] }),
  transition({ id: 'CMD-020', phaseId: 'before_arrival', actor: 'workflow_core', objectId: 'syn_partner_response', to: 'under_review', at: '2026-10-15T13:01:00Z', title: text('Partnerantwort in Prüfung', 'Partner response in review'), action: text('In Prüfung geben', 'Send to review'), visibility: ['partner', 'operations'] }),
  transition({ id: 'CMD-021', phaseId: 'before_arrival', actor: 'operations', contractActor: 'amavio_acc', objectId: 'syn_partner_response', to: 'acknowledged', at: '2026-10-15T13:20:00Z', title: text('Partnerantwort entgegengenommen – keine Buchung', 'Partner response acknowledged — no booking'), action: text('Antwort entgegennehmen', 'Acknowledge response'), visibility: ['partner', 'operations'] }),
  signal({ id: 'CMD-022', phaseId: 'before_arrival', actor: 'employer', objectId: 'syn_review_cost', at: '2026-10-15T14:00:00Z', eventType: 'employer_scope_confirmation', title: text('Arbeitgeber bestätigt den abgegrenzten Leistungsumfang', 'Employer confirms the defined service scope'), action: text('Leistungsumfang bestätigen', 'Confirm service scope'), visibility: ['employer', 'operations'] }),
  transition({ id: 'CMD-023', phaseId: 'before_arrival', actor: 'operations', contractActor: 'amavio_acc', objectId: 'syn_review_cost', to: 'decided', at: '2026-10-15T14:10:00Z', title: text('Reviewentscheidung mit bestätigter Grundlage dokumentiert', 'Review decision documented with confirmed basis'), action: text('Entscheidung dokumentieren', 'Document decision'), visibility: ['employer', 'operations'] }),

  transition({ id: 'CMD-024', phaseId: 'arrival', actor: 'housing', objectId: 'syn_handover', to: 'submitted', at: '2026-10-16T08:00:00Z', title: text('Übergabe-Readiness eingereicht', 'Handover readiness submitted'), action: text('Readiness einreichen', 'Submit readiness'), visibility: ['housing', 'operations'] }),
  transition({ id: 'CMD-025', phaseId: 'arrival', actor: 'workflow_core', objectId: 'syn_handover', to: 'under_review', at: '2026-10-16T08:01:00Z', title: text('Übergabe-Readiness in Prüfung', 'Handover readiness in review'), action: text('In Prüfung geben', 'Send to review'), visibility: ['housing', 'operations'] }),
  signal({ id: 'CMD-026', phaseId: 'arrival', actor: 'operations', objectId: 'syn_handover', at: '2026-10-16T08:12:00Z', eventType: 'version_conflict_detected', result: 'rejected', title: text('Neuere Version erkannt – keine stille Überschreibung', 'Newer version detected — no silent overwrite'), action: text('Konflikt prüfen', 'Review conflict'), visibility: ['housing', 'operations'], disruption: 'version_conflict' }),
  transition({ id: 'CMD-027', phaseId: 'arrival', actor: 'operations', contractActor: 'amavio_acc', objectId: 'syn_handover', to: 'question', at: '2026-10-16T08:18:00Z', title: text('Konflikt als strukturierte Rückfrage übergeben', 'Conflict returned as a structured question'), action: text('Rückfrage senden', 'Send question'), visibility: ['housing', 'operations'] }),
  transition({ id: 'CMD-028', phaseId: 'arrival', actor: 'housing', objectId: 'syn_handover', to: 'submitted', at: '2026-10-16T08:35:00Z', title: text('Wohnanbieter bestätigt die aktuelle Übergabeversion', 'Housing provider confirms the current handover version'), action: text('Aktuelle Version bestätigen', 'Confirm current version'), visibility: ['housing', 'operations'] }),
  transition({ id: 'CMD-029', phaseId: 'arrival', actor: 'workflow_core', objectId: 'syn_handover', to: 'under_review', at: '2026-10-16T08:36:00Z', title: text('Aktuelle Übergabeversion erneut in Prüfung', 'Current handover version returned to review'), action: text('In Prüfung geben', 'Send to review'), visibility: ['housing', 'operations'] }),
  transition({ id: 'CMD-030', phaseId: 'arrival', actor: 'operations', contractActor: 'amavio_acc', objectId: 'syn_handover', to: 'ready', at: '2026-10-16T09:00:00Z', title: text('Übergabe fachlich als bereit bestätigt', 'Handover confirmed as ready'), action: text('Übergabe bestätigen', 'Confirm handover'), visibility: ['housing', 'professional', 'employer', 'operations'] }),

  transition({ id: 'CMD-031', phaseId: 'work_start', actor: 'workflow_core', objectId: 'syn_support_workstart', to: 'under_review', at: '2026-10-17T08:00:00Z', title: text('Unterstützungsanfrage in Prüfung', 'Support request in review'), action: text('In Prüfung geben', 'Send to review'), visibility: ['professional', 'operations'] }),
  transition({ id: 'CMD-032', phaseId: 'work_start', actor: 'operations', contractActor: 'amavio_acc', objectId: 'syn_support_workstart', to: 'question', at: '2026-10-17T08:20:00Z', title: text('Minimierte Rückfrage zum Unterstützungsweg', 'Minimised question about the support path'), action: text('Rückfrage stellen', 'Ask question'), visibility: ['professional', 'operations'] }),
  transition({ id: 'CMD-033', phaseId: 'work_start', actor: 'professional', objectId: 'syn_support_workstart', to: 'submitted', at: '2026-10-17T08:42:00Z', title: text('Fachkraft beantwortet die strukturierte Rückfrage', 'Professional answers the structured question'), action: text('Rückfrage beantworten', 'Answer question'), visibility: ['professional', 'operations'] }),
  transition({ id: 'CMD-034', phaseId: 'work_start', actor: 'workflow_core', objectId: 'syn_support_workstart', to: 'under_review', at: '2026-10-17T08:43:00Z', title: text('Antwort erneut in Prüfung', 'Answer returned to review'), action: text('In Prüfung geben', 'Send to review'), visibility: ['professional', 'operations'] }),
  transition({ id: 'CMD-035', phaseId: 'work_start', actor: 'operations', contractActor: 'amavio_acc', objectId: 'syn_support_workstart', to: 'answered', at: '2026-10-17T09:05:00Z', title: text('Unterstützungsweg beantwortet', 'Support path answered'), action: text('Unterstützung beantworten', 'Answer support request'), visibility: ['professional', 'operations'] }),
  transition({ id: 'CMD-036', phaseId: 'work_start', actor: 'workflow_core', objectId: 'syn_support_workstart', to: 'closed', at: '2026-10-17T09:06:00Z', title: text('Unterstützungsfall kontrolliert geschlossen', 'Support request closed in a controlled way'), action: text('Fall schließen', 'Close request'), visibility: ['professional', 'operations'] }),

  transition({ id: 'CMD-037', phaseId: 'stabilisation', actor: 'professional', objectId: 'syn_role_message', to: 'read', at: '2026-11-14T08:00:00Z', title: text('Freiwilliger Stabilisierungsschritt gelesen', 'Voluntary stabilisation step read'), action: text('Stabilisierungsschritt öffnen', 'Open stabilisation step'), visibility: ['professional', 'operations'] }),
  transition({ id: 'CMD-038', phaseId: 'stabilisation', actor: 'workflow_core', objectId: 'syn_partner_demand', to: 'expired', at: '2026-11-14T08:01:00Z', title: text('Partnernachfrage nach Servicefenster abgelaufen', 'Partner demand expired after its service window'), action: text('Timeout erfassen', 'Record timeout'), visibility: ['partner', 'operations'], disruption: 'timeout' }),
  signal({ id: 'CMD-039', phaseId: 'stabilisation', actor: 'operations', objectId: 'syn_partner_demand', at: '2026-11-14T08:15:00Z', eventType: 'manual_fallback_activated', title: text('Manueller Fallback ohne Scheinerfolg aktiviert', 'Manual fallback activated without false success'), action: text('Fallback aktivieren', 'Activate fallback'), visibility: ['partner', 'employer', 'operations'], disruption: 'manual_fallback' }),
  signal({ id: 'CMD-040', phaseId: 'stabilisation', actor: 'employer', at: '2026-11-14T09:00:00Z', eventType: 'stabilisation_checkpoint_acknowledged', title: text('Arbeitgeber bestätigt ausschließlich den organisatorischen Checkpoint', 'Employer acknowledges only the organisational checkpoint'), action: text('Checkpoint bestätigen', 'Acknowledge checkpoint'), visibility: ['employer', 'operations'] }),

  transition({ id: 'CMD-041', phaseId: 'closure', actor: 'operations', contractActor: 'amavio_acc', objectId: 'syn_housing_need', to: 'closed', at: '2027-04-14T08:00:00Z', title: text('Wohnbedarf fachlich geschlossen', 'Housing need closed'), action: text('Wohnbedarf schließen', 'Close housing need'), visibility: ['housing', 'employer', 'operations'] }),
  transition({ id: 'CMD-042', phaseId: 'closure', actor: 'operations', contractActor: 'amavio_acc', objectId: 'syn_housing_capacity', to: 'archived', at: '2027-04-14T08:10:00Z', title: text('Verwendete Kapazitätsversion archiviert', 'Used capacity version archived'), action: text('Kapazität archivieren', 'Archive capacity'), visibility: ['housing', 'operations'] }),
  transition({ id: 'CMD-043', phaseId: 'closure', actor: 'operations', contractActor: 'amavio_acc', objectId: 'syn_partner_offer', to: 'archived', at: '2027-04-14T08:20:00Z', title: text('Verwendete Angebotsversion archiviert', 'Used offer version archived'), action: text('Angebot archivieren', 'Archive offer'), visibility: ['partner', 'operations'] }),
  signal({ id: 'CMD-044', phaseId: 'closure', actor: 'operations', at: '2027-04-14T08:30:00Z', eventType: 'arrival_case_closed', title: text('Arrival Case mit Zugriffsauslauf und Aufbewahrungshinweis abgeschlossen', 'Arrival case closed with access expiry and retention notice'), action: text('Arrival Case abschließen', 'Close arrival case'), visibility: ['professional', 'housing', 'partner', 'employer', 'operations'] }),
])

export const goldenCaseMeta = freezeDeep({
  id: 'SYN-ARRIVAL-0417',
  title: text('Durchgängiger synthetischer Arrival Case', 'End-to-end synthetic arrival case'),
  context: text('Düsseldorf · ein gemeinsamer fachlicher Verlauf · keine echten Personen', 'Düsseldorf · one shared process history · no real people'),
  schemaVersion: 2,
  totalSteps: goldenCaseSteps.length,
})
