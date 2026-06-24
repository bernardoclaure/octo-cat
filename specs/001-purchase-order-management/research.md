# Research: Purchase Order Management

## Decision

Implement Purchase Order Management using a TypeScript-based web application with:
- Express.js for the backend REST API
- SQLite for persistence and real integration testing
- Repository pattern for data access
- Service layer for business logic, approval workflow, and notifications
- React + TypeScript for the frontend UI
- OpenAPI/Swagger for API documentation
- Nodemailer as a stubbed notification mechanism
- Vitest for unit tests and Playwright for E2E tests

## Rationale

This stack matches the requested architecture and supports the OctoCAT Supply Chain principles:
- Library-first and minimal-dependency design: Express and React keep the stack small and direct.
- Type safety and contract-first REST: TypeScript plus OpenAPI documents the API boundary.
- Integration tests over mocks: SQLite enables real lifecycle testing for POs and workflow transitions.
- Simplicity over abstraction: Service and repository layers are explicit but not over-engineered.
- Separation of concerns: backend handles workflow and notifications, frontend handles buyer and supplier interactions.

## Clarifications Resolved

- Approval for POs over $10,000 will be performed by a distinct approver role separate from branch buyers.

## Alternatives Considered

- NestJS or Fastify: rejected because Express is more direct and aligns with minimal dependency goals.
- Prisma or TypeORM: rejected in favor of a lightweight repository pattern over SQLite to avoid unnecessary ORM abstraction.
- GraphQL: rejected in favor of REST + OpenAPI to keep the API contract explicit and simpler for the requested data flows.
- In-memory mocks for tests: rejected in favor of SQLite-based integration tests as the primary quality gate.
