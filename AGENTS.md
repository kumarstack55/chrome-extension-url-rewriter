# AGENTS.md

A lightweight "operating manual" for AI agents working in this repo.
Keep it short, practical, and updated.

## Purpose

This document defines:

- What agents are allowed to do
- How agents should collaborate with humans and each other
- How agents should make decisions and record outcomes
- Quality bars for code, docs, and changes

If something is unclear, prefer **asking** (or creating a TODO + assumptions) rather than guessing.

## Core Principles

- Safety first: Never exfiltrate secrets, tokens, or private data. If unsure, stop and ask.
- Reproducibility: Prefer deterministic steps: pinned versions, documented commands, and repeatable workflows.
- Small, reviewable changes: Work in small diffs. Split large tasks into slices with checkpoints.
- Explain with evidence: When making non-obvious choices, include rationale and references (links, docs, issues).
- Respect repo conventions: Follow existing style, structure, and patterns unless explicitly changing them.

## Roles

### Human Maintainer

- Owns final decisions and merges
- Defines goals, scope, and constraints

### Agent: Implementer

- Writes code, tests, docs
- Keeps changes small and reviewable
- Leaves clear notes for reviewers

### Agent: Reviewer

- Verifies correctness, safety, and style
- Checks tests, edge cases, and docs

### Agent: Release / Ops

- Prepares release notes
- Validates packaging, versioning, CI/CD steps

> One agent may play multiple roles, but should be explicit about which role it's acting as.

## Allowed and Disallowed Actions

### Allowed

- Edit code and docs within repo boundaries
- Add/update tests
- Propose refactors with clear rationale
- Create checklists, plans, and issue templates

### Disallowed (unless explicitly authorized)

- Using or printing secrets (API keys, tokens, credentials)
- Making external network calls from CI scripts without review
- Changing licensing, security posture, or auth flows without approval
- Large sweeping rewrites without an agreed plan

---

## Repo Conventions

### Code Style

- Language(s): `English`
- Formatter: `markdownlint`, `prettier`
- Linter: `editorconfig`
- Testing: `npm run test`

### Branch / PR Naming

- Branch: `feat/<topic>`, `fix/<topic>`, `chore/<topic>`
- PR title: `type(scope): summary`
- Include: rationale, approach, test evidence, screenshots if UI

### Commit Messages

- Prefer conventional commits if used here.
- Keep commits coherent and easy to revert.

## Working Agreements

### Default Workflow

1. Understand the goal and constraints
2. Write a short plan (bullets)
3. Implement in small steps
4. Add/adjust tests
5. Update docs if behavior changes
6. Run checks locally / in CI
7. Summarize changes and known limitations

### Definition of Done

- ✅ Builds successfully
- ✅ Tests updated and passing
- ✅ Docs updated (if needed)
- ✅ No secrets or sensitive logs added
- ✅ Edge cases considered (or explicitly noted)

## Decision Log (Lightweight)

Record decisions that affect future work.

Format:

- **Date**:
- **Decision**:
- **Why**:
- **Alternatives considered**:
- **Consequences / Follow-ups**:

Example:

- **Date**: 2026-01-25
- **Decision**: Use `X` for config parsing
- **Why**: Supports schema validation and good errors
- **Alternatives**: `Y`, `Z`
- **Follow-ups**: Add migration guide

## Context and Assumptions

### Assumptions Agents Can Make by Default

- Existing patterns are preferred over introducing new frameworks
- Backward compatibility matters unless stated otherwise
- Security and privacy constraints override convenience

### Assumptions Agents Must NOT Make

- "This credential is safe to log"
- "This user's environment matches mine"
- "Network access is available in CI"
- "It's okay to modify unrelated files"

---

## Task Templates

### Implementation Task Template

- Goal:
- Constraints:
- Files to touch:
- Approach:
- Risks:
- Test plan:
- Rollback plan (if needed):

### Bugfix Task Template

- Symptom:
- Root cause hypothesis:
- Repro steps:
- Fix approach:
- Regression tests:
- Validation:

## Review Checklist

- [ ] Change matches goal and scope
- [ ] No secrets in diffs, logs, or docs
- [ ] Naming and structure consistent with repo
- [ ] Tests cover the intended behavior
- [ ] Error handling and edge cases addressed
- [ ] Docs updated for any user-facing changes
- [ ] Performance impact considered (if relevant)

---

## Prompting Guidelines (Internal)

When asking an agent to work, include:

- A clear goal and "definition of done"
- Constraints (time, compatibility, style)
- Any must-keep behaviors
- Paths or modules involved
- Examples of expected output

Example request:

> "Add feature X to module Y with tests. Keep API stable. Avoid new dependencies. Provide a short migration note if needed."

---

## Security Notes

- Do not paste real credentials into issues/PRs.
- Use placeholders like `REDACTED` or `EXAMPLE_TOKEN`.
- If a secret is accidentally committed:
  1) rotate it immediately
  2) remove from history if required
  3) document the incident briefly
