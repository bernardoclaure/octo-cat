<!--
Sync Impact Report
Version change: none → 1.0.0
Modified principles:
  - Added I. Library-First Architecture
  - Added II. Test-Driven Development
  - Added III. Integration Testing over Mocks
  - Added IV. Simplicity Over Abstraction
  - Added V. API-First REST with OpenAPI
  - Added VI. Type Safety and Dependency Discipline
Added sections:
  - Technology Constraints
  - Development Workflow
Templates reviewed:
  - .specify/templates/plan-template.md ✅ aligned
  - .specify/templates/spec-template.md ✅ aligned
  - .specify/templates/tasks-template.md ✅ aligned
  - .specify/templates/constitution-template.md ✅ used
Follow-up TODOs: none
-->

# OctoCAT Supply Chain Constitution

## Core Principles

### I. Library-First Architecture
Every feature begins as an independent reusable library module. Libraries must expose clear APIs, be documented, independently testable, and remain decoupled from application wiring. This prevents one-off code, supports reuse across services, and keeps implementation boundaries explicit.

### II. Test-Driven Development
Implementation begins only after a failing contract or feature test exists. Tests are written first, validated, then made to pass in a strict red-green-refactor cycle. This enforces correct behavior, catches regressions early, and makes design decisions explicit.

### III. Integration Testing over Mocks
Real integration tests are the trusted quality gate. Primary behavior must be covered with contract and integration tests against SQLite or equivalent real storage, not mock-only pipelines. Mocks are allowed only for low-level failure injection when real integration is impractical.

### IV. Simplicity Over Abstraction
Prefer direct framework usage and minimal architectural layers. Avoid early abstraction, over-engineered indirection, and permissive patterns that do not clearly reduce complexity. Keep the codebase small, readable, and easy to evolve.

### V. API-First REST with OpenAPI
Design the system around a REST API contract with explicit OpenAPI documentation. Every endpoint must be defined, versioned, and discoverable. API design governs implementation and supports clients, automation, and integration consistency.

### VI. Type Safety and Dependency Discipline
Use TypeScript across the codebase for strong typing and compile-time validation. Add dependencies only when they clearly reduce risk or deliver essential value. Every external package must be evaluated and justified before inclusion.

## Technology Constraints
The project uses TypeScript as the implementation language, SQLite for real integration testing, and REST API patterns with OpenAPI documentation. Minimal dependencies are required; no library may be added without explicit evaluation. The architecture remains library-first, with small reusable modules and clear separation between contract definitions and runtime wiring.

## Development Workflow
Work is driven by contract and feature tests. Every pull request must reference the governing principle(s), include passing integration tests for new behavior, and demonstrate that no unnecessary dependency or abstraction was introduced. Reviews must validate OpenAPI updates, TypeScript correctness, library-first structure, and adherence to integration-test discipline.

## Governance
This constitution supersedes informal preferences and becomes the default guide for OctoCAT Supply Chain development. Changes require documentation, peer review, and a versioned amendment entry in this file. Major architecture changes, dependency additions, or API contract updates must be justified against the principles here. All pull requests must verify compliance with these principles before merge.

**Version**: 1.0.0 | **Ratified**: 2026-06-24 | **Last Amended**: 2026-06-24

