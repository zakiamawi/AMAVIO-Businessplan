# AMAVIO Master Project — 19.09.2026

## Source of Truth

The operative AMAVIO source of truth is the local project workspace:

`/Users/zakia/Desktop/Businessplan AKTUELL`

This repository is being prepared as the private Git governance and text-source layer for that master project. It must not be treated as a complete mirror of all local files until migration is explicitly completed.

## Project Areas

- 00_START_HIER — project steering, master index, working cockpit
- 01_Businessplan — business plan working material
- 02_Finanztool — financial model and QA references
- 03_Anlagen_Foerderung_GmbH — funding/GmbH/supporting documents
- 04_CV — founder CV and profile material
- 05_Kunden — customer, offer and mandate material
- 06_Investoren — investor and product/MVP material
- 07_Vertraege — contracts and drafts
- 08_Website — website and control-center work
- 09_Unternehmenssystem — internal operating-system/process material
- 90_QA — audits, render checks and review notes
- 99_Archiv — superseded/historical material only

## Repository Boundary

This repository is private, but sensitive source files are still not to be committed by default.

Do not automatically add:
- IDs/passports
- bank or payroll records
- tax/ELSTER material
- signed contracts with sensitive remuneration data
- passwords, tokens, API keys or auth artifacts
- large render archives
- raw personal administrative documents

## Website Separation

Website code remains separately versioned in:

`zakiamawi/amavio-living-site`

The AMAVIO master repository is for project governance and deliberately selected source material, not for duplicating every website build artifact.

## Current Migration State

- local master workspace confirmed
- old website-root Git history preserved locally
- safety branch created locally
- reconciliation branch created locally
- complete pre-migration Git bundle created locally
- Handelsregister MCP configured locally
- this branch is the first controlled GitHub-side master migration layer
