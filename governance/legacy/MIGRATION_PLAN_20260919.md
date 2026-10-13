# AMAVIO Git Migration Plan — 19.09.2026

## Goal

Establish a clean private AMAVIO master repository without losing local project history or mixing sensitive source material into Git.

## Existing Repositories

1. `zakiamawi/AMAVIO-Businessplan`
   - private
   - selected as future master governance repository
2. `zakiamawi/amavio-living-site`
   - private
   - remains the website/code repository

## Local Master

`/Users/zakia/Desktop/Businessplan AKTUELL`

This remains the operative source of truth.

## Completed Safety Steps

- fetched current website remote state
- created local safety branch `safety/pre-reorg-20260919`
- created local reconciliation branch `reconcile/website-origin-20260919`
- reconciled local/remote website governance history without touching local main
- created verified Git bundle before migration
- documented historically tracked non-website files
- protected sensitive/unrelated directories through local Git exclude rules
- archived obsolete steering files rather than deleting them

## Migration Phases

### Phase 1 — Governance branch
Current branch: `master-project-20260919`

Add only:
- source-of-truth documentation
- migration plan
- governance rules
- safe text-only working references

### Phase 2 — Controlled text migration
Move only reviewed Markdown/text assets from the local master workspace.

### Phase 3 — Binary/document strategy
Decide per category whether DOCX/XLSX/PDF/PPTX belongs in:
- Git LFS
- Drive/Library
- local-only protected storage
- generated release package

### Phase 4 — Website boundary cleanup
Keep website source and deploy workflow in `amavio-living-site`.
Remove accidental cross-project coupling only after the master repo is established.

## Hard Rules

- no force-push
- no hard reset
- no blind pull/rebase
- no secrets
- no mass binary upload
- no deletion as cleanup default
- archive first, delete only with explicit approval and verified replacement
