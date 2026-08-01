---
name: agent-loop-system
description: Cost-aware multi-agent workflow design and execution for complex projects. Use when the user mentions Loop-System, Sub-Agent Loop, Executor Subagent, cheap models, expensive models, cost optimization, reviewer loops, agent orchestration, reusable future workflow setup, or asks Codex to split work across cheaper executors and stronger planners/reviewers.
---

# Agent Loop System

Use this skill to create a reusable cost-aware execution loop for large projects. The default architecture is: strong Planner creates the plan, cheap Executor Subagent performs bounded work, strong Reviewer checks quality, cheap Executor applies routine fixes, and durable project files capture learning.

## Core Rule

Optimize for total outcome quality per cost, not lowest per-call cost.

Use strong models only where they materially improve strategy, architecture, judgment, risk assessment, or final review. Use cheaper models for bounded execution, extraction, formatting, routine implementation, checklist maintenance, test running, and status reporting.

## Standard Roles

1. Planner
   - Use a strong model or the current main agent.
   - Define goal, constraints, task slices, risk level, acceptance criteria, and executor prompts.
   - Decide which tasks are safe for cheaper execution.

2. Executor Subagent
   - Use a cheap or fast model when available.
   - Execute the Planner prompt exactly within scope.
   - Inspect files, draft content, make bounded edits, run checks, update checklists, and report evidence.
   - Do not make strategy decisions beyond the assigned scope.
   - Escalate only when blocked by missing access, conflicting requirements, high-risk ambiguity, or failed validation.

3. Reviewer
   - Use a strong model or reviewer role.
   - Review executor output against acceptance criteria.
   - Return pass/fail, ranked findings, and required fixes only.

4. Finalizer
   - Usually cheap or local execution.
   - Apply routine fixes, clean formatting, update status logs, and produce the final user-facing summary.

## Workflow

1. Classify the task.
   - Simple: execute directly without loop.
   - Medium: Planner -> Executor -> Review.
   - Complex: Planner -> multiple Executors -> Synthesis -> Reviewer -> Finalizer.

2. Create an execution brief.
   - Include goal, deadline, files/data to inspect, allowed changes, forbidden changes, output format, and acceptance criteria.

3. Spawn or emulate the Executor Subagent.
   - If multi-agent tools are available, spawn a worker/executor with a narrow prompt.
   - If no sub-agent tool is available, emulate the Executor phase in the current agent and keep the same boundaries.

4. Review before broadening scope.
   - Promote to strong review when output affects business strategy, architecture, finance, law, external delivery, or irreversible decisions.
   - Do not spend strong-model budget on formatting-only cleanup.

5. Persist learning.
   - Write durable decisions, checklists, prompts, project knowledge, and reusable executor briefs into project files when allowed.
   - Do not rely on chat memory for project-critical knowledge.

## Executor Prompt Contract

Every Executor Subagent prompt must include:

- Goal
- Scope and ownership
- Inputs to inspect
- Allowed changes
- Forbidden changes
- Output format
- Acceptance criteria
- Escalation conditions
- Stop condition

Read `references/executor-loop.md` for reusable prompt templates and AMAVIO defaults.
