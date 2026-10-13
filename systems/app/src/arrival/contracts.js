const freezeDeep = (value) => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value
  for (const nested of Object.values(value)) freezeDeep(nested)
  return Object.freeze(value)
}

export const arrivalContractVersion = '2.4.2-r2-foundation.1'

export const arrivalScope = freezeDeep({
  maturity: 'local_synthetic_executable_process',
  externalRoleIds: ['professional', 'housing', 'partner'],
  boundaryResponsibilityIds: ['employer', 'operations'],
  internalActorIds: ['workflow_core', 'amavio_acc'],
  boundaries: {
    syntheticOnly: true,
    productiveAuthentication: false,
    backendConnected: true,
    databaseConnected: true,
    backendScopeLocalSynthetic: true,
    technicalAccEndpointAvailable: true,
    localAiGatewayAvailable: true,
    productiveArrivalGraph: false,
    productiveAccIntegration: false,
    realDataAllowed: false,
    realRoleTestsAllowed: false,
    productiveAiAllowed: false,
    externalAiProviderEnabled: false,
    matchingAllowed: false,
    scoringAllowed: false,
    automatedDecisionAllowed: false,
    deploymentAllowed: false,
    publicationAllowed: false,
  },
})

export const canonicalObjectContracts = freezeDeep([
  { id: 'RoleContext', statusContract: null, externalReaders: ['professional', 'housing', 'partner'] },
  { id: 'ProfessionalTask', statusContract: 'ProfessionalTask', externalReaders: ['professional'] },
  { id: 'SupportRequest', statusContract: 'SupportRequest', externalReaders: ['professional'] },
  { id: 'HousingCapacity', statusContract: 'DraftSubmission', externalReaders: ['housing'] },
  { id: 'HousingNeed', statusContract: 'Demand', externalReaders: ['housing'] },
  { id: 'HousingNeedResponse', statusContract: 'DemandResponse', externalReaders: ['housing'] },
  { id: 'HandoverSignal', statusContract: 'HandoverSignal', externalReaders: ['housing'] },
  { id: 'PartnerOffer', statusContract: 'DraftSubmission', externalReaders: ['partner'] },
  { id: 'PartnerDemand', statusContract: 'Demand', externalReaders: ['partner'] },
  { id: 'PartnerDemandResponse', statusContract: 'DemandResponse', externalReaders: ['partner'] },
  { id: 'RoleMessage', statusContract: 'RoleMessageReadState', externalReaders: ['professional', 'housing', 'partner'] },
  { id: 'WorkflowEvent', statusContract: null, externalReaders: ['professional', 'housing', 'partner'] },
  { id: 'ReviewDecision', statusContract: 'ReviewDecision', externalReaders: [] },
])

export const canonicalObjectIds = freezeDeep(canonicalObjectContracts.map(({ id }) => id))

export const statusContracts = freezeDeep({
  DraftSubmission: {
    objectIds: ['HousingCapacity', 'PartnerOffer'],
    states: ['draft', 'submitted', 'under_review', 'approved', 'changes_requested', 'archived'],
    transitions: [
      ['draft', 'submitted', 'external_owner'],
      ['submitted', 'under_review', 'workflow_core'],
      ['under_review', 'approved', 'amavio_acc'],
      ['under_review', 'changes_requested', 'amavio_acc'],
      ['changes_requested', 'draft', 'external_owner'],
      ['approved', 'archived', 'amavio_acc'],
    ],
  },
  ProfessionalTask: {
    objectIds: ['ProfessionalTask'],
    states: ['locked', 'open', 'submitted', 'under_review', 'completed', 'changes_requested'],
    transitions: [
      ['locked', 'open', 'workflow_core'],
      ['open', 'submitted', 'professional'],
      ['submitted', 'under_review', 'workflow_core'],
      ['under_review', 'completed', 'amavio_acc'],
      ['under_review', 'changes_requested', 'amavio_acc'],
      ['changes_requested', 'open', 'professional'],
    ],
  },
  SupportRequest: {
    objectIds: ['SupportRequest'],
    states: ['submitted', 'under_review', 'answered', 'closed', 'question'],
    transitions: [
      ['submitted', 'under_review', 'workflow_core'],
      ['under_review', 'answered', 'amavio_acc'],
      ['under_review', 'question', 'amavio_acc'],
      ['question', 'submitted', 'professional'],
      ['answered', 'closed', 'workflow_core'],
    ],
  },
  Demand: {
    objectIds: ['HousingNeed', 'PartnerDemand'],
    states: ['open', 'closed', 'expired'],
    transitions: [
      ['open', 'closed', 'amavio_acc'],
      ['open', 'expired', 'workflow_core'],
    ],
  },
  DemandResponse: {
    objectIds: ['HousingNeedResponse', 'PartnerDemandResponse'],
    states: ['draft', 'submitted', 'under_review', 'acknowledged', 'changes_requested'],
    transitions: [
      ['draft', 'submitted', 'external_owner'],
      ['submitted', 'under_review', 'workflow_core'],
      ['under_review', 'acknowledged', 'amavio_acc'],
      ['under_review', 'changes_requested', 'amavio_acc'],
      ['changes_requested', 'draft', 'external_owner'],
    ],
  },
  HandoverSignal: {
    objectIds: ['HandoverSignal'],
    states: ['open', 'submitted', 'under_review', 'ready', 'question', 'changes_requested'],
    transitions: [
      ['open', 'submitted', 'housing'],
      ['submitted', 'under_review', 'workflow_core'],
      ['under_review', 'ready', 'amavio_acc'],
      ['under_review', 'question', 'amavio_acc'],
      ['under_review', 'changes_requested', 'amavio_acc'],
      ['question', 'submitted', 'housing'],
      ['changes_requested', 'open', 'housing'],
    ],
  },
  RoleMessageReadState: {
    objectIds: ['RoleMessage'],
    states: ['unread', 'read'],
    transitions: [['unread', 'read', 'external_recipient']],
  },
  ReviewDecision: {
    objectIds: ['ReviewDecision'],
    states: ['pending', 'decided'],
    transitions: [['pending', 'decided', 'amavio_acc']],
  },
})

export const roleVisibility = freezeDeep({
  professional: ['RoleContext', 'ProfessionalTask', 'SupportRequest', 'RoleMessage', 'WorkflowEvent'],
  housing: ['RoleContext', 'HousingCapacity', 'HousingNeed', 'HousingNeedResponse', 'HandoverSignal', 'RoleMessage', 'WorkflowEvent'],
  partner: ['RoleContext', 'PartnerOffer', 'PartnerDemand', 'PartnerDemandResponse', 'RoleMessage', 'WorkflowEvent'],
})

export const payloadProjectionFields = freezeDeep({
  RoleContext: ['organisationLabel', 'purpose'],
  ProfessionalTask: ['category', 'dueWindow', 'nextResponsibility'],
  SupportRequest: ['category', 'urgency', 'nextResponsibility'],
  HousingCapacity: ['category', 'region', 'availabilityWindow', 'unitBand'],
  HousingNeed: ['category', 'quantityBand', 'regionCode', 'windowCode'],
  HousingNeedResponse: ['fit', 'reasonCategory', 'nextResponsibility'],
  HandoverSignal: ['readiness', 'windowCode', 'nextResponsibility'],
  PartnerOffer: ['category', 'capacityBand', 'windowCode'],
  PartnerDemand: ['category', 'quantityBand', 'regionCode'],
  PartnerDemandResponse: ['fit', 'capacityBand', 'nextResponsibility'],
  RoleMessage: ['category', 'nextResponsibility'],
  ReviewDecision: ['targetObject', 'reasonCategory', 'outcome', 'nextResponsibility'],
})

export const actorLabels = freezeDeep({
  professional: { de: 'Fachkraft', en: 'Professional' },
  housing: { de: 'Wohnanbieter', en: 'Housing provider' },
  partner: { de: 'Lokaler Partner', en: 'Local partner' },
  employer: { de: 'die Arbeitgeberseite', en: 'the employer side' },
  operations: { de: 'AMAVIO', en: 'AMAVIO' },
  workflow_core: { de: 'Lokaler Workflow-Kern', en: 'Local workflow core' },
})

export const forbiddenProjectionKeys = freezeDeep([
  'personName', 'privateProfile', 'employerBudget', 'internalNote', 'performanceScore',
  'otherRoleData', 'passport', 'healthData', 'bankData', 'secret', 'token',
])

export { freezeDeep }
