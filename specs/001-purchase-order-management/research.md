# Research: Purchase Order Management

## Decision

Implement Purchase Order Management using a TypeScript-based web application with:
- Express.js for the backend REST API
- SQLite for persistence and real integration testing
- Repository pattern for data access
- Service layer for business logic, approval workflow, notifications, and partial-fulfillment transitions
- React + TypeScript for the frontend UI
- OpenAPI/Swagger for API documentation
- A fulfillment-event model to track shipment activity per line item
- Vitest for tests and Playwright for E2E tests

## Rationale

This stack matches the requested architecture and supports the OctoCAT Supply Chain principles:
- Library-first and minimal-dependency design: Express and React keep the stack small and direct.
- Type safety and contract-first REST: TypeScript plus OpenAPI documents the API boundary.
- Integration tests over mocks: SQLite enables real lifecycle testing for POs and workflow transitions.
- Simplicity over abstraction: Service and repository layers are explicit but not over-engineered.
- Separation of concerns: backend handles workflow and notifications, frontend handles buyer and supplier interactions.

## Clarifications Resolved

- Approval for POs over $10,000 will be performed by a distinct approver role separate from branch buyers.
- Partial fulfillment will be modeled as multiple fulfillment events that apply to one or more line items and will keep the PO in Partially Fulfilled status until the final outstanding quantity is completed.

## Alternatives Considered

- NestJS or Fastify: rejected because Express is more direct and aligns with minimal dependency goals.
- Prisma or TypeORM: rejected in favor of a lightweight repository pattern over SQLite to avoid unnecessary ORM abstraction.
- GraphQL: rejected in favor of REST + OpenAPI to keep the API contract explicit and simpler for the requested data flows.
- In-memory mocks for tests: rejected in favor of SQLite-based integration tests as the primary quality gate.
