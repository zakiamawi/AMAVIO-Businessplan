# Agent Loop Patterns

## Full Loop

Use for high-value, multi-step, ambiguous, or deadline-critical work.

1. Strong planner
   - Define outcome, constraints, risks, decomposition, and acceptance criteria.
   - Decide which work can safely go to cheaper workers.

2. Cheap discovery workers
   - Inspect files, collect facts, summarize source material, list gaps.
   - Output must include file paths, citations, or concrete evidence.

3. Strong synthesis
   - Resolve contradictions, select strategy, define final work plan.
   - Identify what must be implemented, researched, or verified next.

4. Cheap implementation workers
   - Draft sections, update checklists, perform bounded edits, run tests, format artifacts.
   - Keep work scoped to explicit files and criteria.

5. Strong review
   - Check correctness, coherence, missing assumptions, and risk.
   - Decide pass/fail and specify only necessary fixes.

6. Cheap finalizer
   - Apply routine fixes, clean formatting, update status logs and todos.

## Model Tier Routing

Use cheap/fast models for:

- File inventory and extraction
- Repetitive transformations
- First drafts from clear outlines
- Formatting, table cleanup, checklist generation
- Test execution and log summarization
- Simple implementation tasks with narrow acceptance tests

Use balanced models for:

- Moderate implementation
- Integrating multiple sources
- Drafting user-facing explanations
- Debugging with clear symptoms

Use strong models for:

- Strategy and positioning
- Architecture and irreversible design choices
- Ambiguous debugging
- Financial, legal, or high-risk reasoning
- Final review before external delivery
- Evaluating research quality and weak assumptions

## Worker Prompt Template

Use this structure for cheap workers:

```text
Goal: <specific bounded outcome>
Context: <only the required files, facts, constraints>
Inputs to inspect: <paths, docs, URLs, data>
Do not change: <protected files/areas>
Output format: <checklist, diff summary, table, findings>
Acceptance criteria: <objective pass/fail conditions>
Stop condition: <when to stop and report>
```

## Reviewer Prompt Template

Use this structure for strong reviewers:

```text
Review objective: <what decision the review must support>
Artifacts: <worker outputs, diffs, files, research notes>
Criteria: correctness, completeness, coherence, risk, missing evidence
Output: pass/fail, ranked findings, required fixes only
Escalate if: <what needs user input or stronger reasoning>
```

## Loop Budget Defaults

- Simple task: no loop.
- Medium task: 1 cheap worker phase plus 1 review phase.
- Complex task: planner -> workers -> synthesis -> implementation -> review -> finalizer.
- Maximum default loops: 2.
- Continue beyond 2 loops only when there is new evidence, a failed validation, or a material risk.

## AMAVIO Operating Pattern

Morning:

- Strong planner defines daily priorities against the coach date and final submission.
- Cheap workers inspect businessplan, finance model, website, decks, and QA folders.
- Strong synthesis produces the daily priority list.
- Cheap finalizer updates master todo/status/checklists when allowed.

Evening:

- Cheap workers summarize visible progress and changed artifacts.
- Strong reviewer checks whether progress improves coach-readiness.
- Cheap finalizer writes the next-morning todo list and unresolved risks.

## Persistence Rules

Persist durable knowledge in project files:

- Decisions: rationale, date, alternatives rejected.
- Research: source, date, key fact, relevance, confidence.
- Todos: owner if known, priority, due date, artifact, acceptance condition.
- Checklists: objective, pass/fail criteria, evidence required.

Do not rely on chat memory for project-critical knowledge.
