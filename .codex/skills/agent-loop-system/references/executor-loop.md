# Executor Loop Reference

## Default Architecture

Planner -> Executor Subagent -> Reviewer -> Executor Fix Pass -> Finalizer

Use the Executor Subagent as the cost-control layer. It should do the bulk of bounded work after the Planner has turned ambiguity into concrete tasks.

## Executor Subagent Prompt Template

```text
Role: Executor Subagent
Model tier: cheap/fast if available

Goal:
<single concrete outcome>

Scope and ownership:
<files, folders, sections, research topic, or artifact slice owned by this executor>

Context:
<only necessary facts, constraints, deadlines, and source paths>

Inputs to inspect:
<paths, URLs, docs, datasets, prior reports>

Allowed changes:
<exact files or artifact types the executor may change>

Forbidden changes:
<files, behavior, assumptions, or decisions the executor must not alter>

Output format:
<findings table, patch summary, todo list, checklist, draft section, test report>

Acceptance criteria:
<objective pass/fail requirements>

Escalation conditions:
- Missing access or missing required source
- Conflicting instructions
- High-risk business, legal, financial, or architectural uncertainty
- Validation fails after one fix attempt

Stop condition:
Stop when acceptance criteria are met or an escalation condition is hit. Report evidence and changed files.
```

## Reviewer Prompt Template

```text
Role: Strong Reviewer

Review objective:
Decide whether the Executor output is fit for purpose.

Artifacts:
<executor result, changed files, reports, sources>

Criteria:
- Correctness
- Completeness
- Coherence
- Evidence quality
- Risk and reversibility
- Fit to deadline and target audience

Output:
- PASS or FAIL
- Ranked findings
- Required fixes only
- What can safely be delegated back to Executor
```

## Cost Routing

Use cheap/fast execution for:

- File inventory and extraction
- Source summarization
- First drafts from a strong outline
- Routine code or document edits
- Formatting and table cleanup
- Checklist generation
- Test execution and log summarization
- Status report maintenance

Use strong planning/review for:

- Positioning and strategy
- Architecture
- Financial model assumptions
- Legal/regulatory interpretation
- External submission quality
- Contradiction resolution
- Final pre-delivery review

## Loop Limits

- Default maximum: 2 full loops.
- Continue only when new evidence appears, validation fails, or the reviewer finds material risk.
- Stop style-only iterations once the artifact is fit for purpose.

## AMAVIO Defaults

Use this loop for AMAVIO when work touches:

- Businessplan argumentation and coach-ready story
- Finanzmodell assumptions, formulas, and consistency
- Website/product development
- Pitch deck and final submission packaging
- Market/design/research synthesis
- QA checklists and readiness tracking

Durable project memory should go into files such as:

- AMAVIO status log
- Master todo
- Research notes
- Decision log
- Businessplan QA checklist
- Finanzmodell QA checklist
- Website QA checklist
- Pitch deck checklist

## Example Executor Prompt for AMAVIO

```text
Role: Executor Subagent
Model tier: cheap/fast if available

Goal:
Inspect the AMAVIO project folders and produce a coach-readiness gap list for the next 48 hours.

Scope and ownership:
Read-only discovery across businessplan, finance model, website, decks, and QA folders.

Inputs to inspect:
Local AMAVIO project files and existing status/checklist artifacts.

Allowed changes:
None unless explicitly instructed by the Planner.

Forbidden changes:
Do not rewrite strategy, financial assumptions, or submission files.

Output format:
A ranked table with gap, affected artifact, evidence path, priority, recommended next action.

Acceptance criteria:
Every finding references a concrete file/path or states that the artifact is missing.

Escalation conditions:
Escalate if required folders are missing, files cannot be read, or the evidence conflicts.

Stop condition:
Stop after producing the ranked gap list and top five next actions.
```
