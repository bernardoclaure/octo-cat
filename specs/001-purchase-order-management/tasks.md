---
description: "Task list for Purchase Order Management feature implementation"
---

# Tasks: Purchase Order Management

**Input**: Design documents from `/specs/001-purchase-order-management/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Contract and integration tests are required for each story because the feature is TDD-driven and integration-focused.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend directory structure in `backend/src/controllers`, `backend/src/repositories`, `backend/src/services`, `backend/src/models`, `backend/src/routes`, and `backend/tests`
- [X] T002 Create frontend directory structure in `frontend/src/components`, `frontend/src/context`, `frontend/src/pages`, `frontend/src/services`, `frontend/src/api`, `frontend/src/hooks`, and `frontend/tests/e2e`
- [X] T003 Initialize backend TypeScript project with `backend/package.json`, `backend/tsconfig.json`, `backend/.eslintrc.js`, and `backend/.prettierrc`
- [X] T004 Initialize frontend TypeScript React project with `frontend/package.json`, `frontend/tsconfig.json`, `frontend/.eslintrc.js`, and `frontend/.prettierrc`
- [X] T005 [P] Create shared tooling configuration files at `.prettierrc`, `.eslintrc.js`, and `tsconfig.base.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T006 Setup SQLite schema and repository layer in `backend/src/repositories/purchaseOrderRepository.ts` and `backend/src/repositories/lineItemRepository.ts`
- [X] T007 [P] Create PO domain models and shared types in `backend/src/models/purchaseOrder.ts`, `backend/src/models/purchaseOrderLineItem.ts`, and `backend/src/models/userRoles.ts`
- [X] T008 [P] Implement backend business services in `backend/src/services/purchaseOrderService.ts`, `backend/src/services/approvalService.ts`, and `backend/src/services/notificationService.ts`
- [X] T009 Setup backend API routing and application wiring in `backend/src/routes/purchaseOrderRoutes.ts`, `backend/src/app.ts`, and `backend/src/server.ts`
- [X] T010 [P] Configure environment and application configuration in `backend/src/config.ts` and `backend/src/logger.ts`
- [X] T011 [P] Implement authentication/authorization scaffolding and role guards in `backend/src/middleware/authMiddleware.ts` and `backend/src/middleware/authorizationMiddleware.ts`
- [X] T012 [P] Add OpenAPI/Swagger documentation scaffolding in `backend/src/schemas/purchaseOrderSchemas.ts` and `backend/src/routes/swaggerRoutes.ts`
- [X] T013 [P] Implement frontend API client and shared state scaffolding in `frontend/src/api/purchaseOrderApi.ts`, `frontend/src/context/purchaseOrderContext.tsx`, and `frontend/src/services/apiClient.ts`
- [X] T014 [P] Create frontend design system scaffolding for reusable UI components in `frontend/src/components/ui/` including `Button.tsx`, `Input.tsx`, and `StatusBadge.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and manage purchase orders (Priority: P1) 🎯 MVP

**Goal**: Enable branch buyers to create, save, and edit Draft purchase orders with line items.

**Independent Test**: Verify Draft PO creation, editing, and persistence through API and UI flows.

### Tests for User Story 1

- [X] T015 [P] [US1] Create contract test for `POST /api/purchase-orders` and `PUT /api/purchase-orders/:purchaseOrderId` in `backend/tests/contract/test_purchase_order_draft_flow.spec.ts`
- [X] T016 [P] [US1] Create integration test for Draft PO creation and update in `backend/tests/integration/test_purchase_order_draft_flow.spec.ts`

### Implementation for User Story 1

- [X] T017 [P] [US1] Implement `createDraftPurchaseOrder` and `updateDraftPurchaseOrder` in `backend/src/services/purchaseOrderService.ts`
- [X] T018 [US1] Add repository support for Draft PO persistence in `backend/src/repositories/purchaseOrderRepository.ts` and `backend/src/repositories/lineItemRepository.ts`
- [X] T019 [US1] Implement backend Draft PO endpoints in `backend/src/routes/purchaseOrderRoutes.ts`
- [X] T020 [US1] Create `PurchaseOrderForm` page in `frontend/src/pages/purchase-orders/PurchaseOrderForm.tsx`
- [X] T021 [US1] Implement line item editing UI in `frontend/src/components/purchase-orders/PurchaseOrderLineItemEditor.tsx`
- [X] T022 [US1] Add Draft PO state management and save actions in `frontend/src/context/purchaseOrderContext.tsx`
- [X] T023 [US1] Add frontend validation and API integration in `frontend/src/api/purchaseOrderApi.ts`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Submit purchase orders and notify suppliers (Priority: P2)

**Goal**: Allow buyers to submit Draft POs and generate supplier notifications.

**Independent Test**: Verify submission changes status to Submitted and creates a supplier notification event.

### Tests for User Story 2

- [ ] T024 [P] [US2] Create contract test for `POST /api/purchase-orders/:purchaseOrderId/submit` in `backend/tests/contract/test_purchase_order_submission.spec.ts`
- [ ] T025 [P] [US2] Create integration test for PO submission and notification creation in `backend/tests/integration/test_purchase_order_submission.spec.ts`

### Implementation for User Story 2

- [ ] T026 [P] [US2] Implement PO submission workflow in `backend/src/services/purchaseOrderService.ts`
- [ ] T027 [US2] Implement supplier notification creation in `backend/src/services/notificationService.ts`
- [ ] T028 [US2] Add submission endpoint in `backend/src/routes/purchaseOrderRoutes.ts`
- [ ] T029 [US2] Add submit action and confirmation to `frontend/src/pages/purchase-orders/PurchaseOrderDetail.tsx`
- [ ] T030 [US2] Add supplier-facing PO list page in `frontend/src/pages/suppliers/SupplierPurchaseOrders.tsx`

**Checkpoint**: User Story 2 should be independently testable and complete

---

## Phase 5: User Story 3 - Approval and fulfillment workflow for higher-value orders (Priority: P2)

**Goal**: Provide approval and fulfillment transitions for POs over $10,000.

**Independent Test**: Verify a high-value submitted PO requires approval before fulfillment.

### Tests for User Story 3

- [ ] T031 [P] [US3] Create contract test for `POST /api/purchase-orders/:purchaseOrderId/approve` and `POST /api/purchase-orders/:purchaseOrderId/fulfill` in `backend/tests/contract/test_purchase_order_approval.spec.ts`
- [ ] T032 [P] [US3] Create integration test for approval and fulfillment rules in `backend/tests/integration/test_purchase_order_approval.spec.ts`

### Implementation for User Story 3

- [ ] T033 [US3] Implement approval workflow and guard rules in `backend/src/services/approvalService.ts`
- [ ] T034 [US3] Implement fulfill transition rules in `backend/src/services/purchaseOrderService.ts`
- [ ] T035 [US3] Add approval and fulfillment endpoints in `backend/src/routes/purchaseOrderRoutes.ts`
- [ ] T036 [US3] Create approver dashboard page in `frontend/src/pages/approver/ApprovalDashboard.tsx`
- [ ] T037 [US3] Add approve and fulfill actions to `frontend/src/pages/purchase-orders/PurchaseOrderDetail.tsx`
- [ ] T038 [US3] Enforce approver role and workflow state in `frontend/src/context/purchaseOrderContext.tsx`

**Checkpoint**: User Story 3 should be independently functional after approval workflow completion

---

## Phase 6: User Story 4 - Cancel purchase orders at permitted stages (Priority: P3)

**Goal**: Enable buyers to cancel POs while in Draft, Submitted, or Approved status.

**Independent Test**: Verify Cancelled POs cannot advance and remain in Cancelled status.

### Tests for User Story 4

- [ ] T039 [P] [US4] Create contract test for `POST /api/purchase-orders/:purchaseOrderId/cancel` in `backend/tests/contract/test_purchase_order_cancellation.spec.ts`
- [ ] T040 [P] [US4] Create integration test for cancellation rules in `backend/tests/integration/test_purchase_order_cancellation.spec.ts`

### Implementation for User Story 4

- [ ] T041 [US4] Implement cancellation transition guard in `backend/src/services/purchaseOrderService.ts`
- [ ] T042 [US4] Add cancel endpoint in `backend/src/routes/purchaseOrderRoutes.ts`
- [ ] T043 [US4] Add cancel action to `frontend/src/pages/purchase-orders/PurchaseOrderDetail.tsx`
- [ ] T044 [US4] Add Cancelled status UI in `frontend/src/components/purchase-orders/PurchaseOrderStatusBadge.tsx`

**Checkpoint**: User Story 4 should be independently complete and verifiable

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T045 [P] Update OpenAPI documentation and backend schemas in `backend/src/schemas/purchaseOrderSchemas.ts`
- [ ] T046 [P] Add frontend documentation and help copy in `frontend/src/pages/purchase-orders/Readme.md`
- [ ] T047 [P] Add Playwright end-to-end smoke test for the full PO lifecycle in `frontend/tests/e2e/purchaseOrderLifecycle.spec.ts`
- [ ] T048 [P] Run quickstart validation and update `specs/001-purchase-order-management/quickstart.md`
- [ ] T049 [P] Perform code cleanup and type-safety fixes in `backend/src/` and `frontend/src/`
- [ ] T050 [P] Add test coverage reports and CI validation commands for backend and frontend

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all story work
- **User Stories (Phases 3-6)**: Depend on Foundational phase completion
- **Polish (Phase 7)**: Depends on all stories being implemented and validated

### User Story Dependencies

- **User Story 1 (P1)**: Requires foundational backend, repository, and frontend scaffolding
- **User Story 2 (P2)**: Requires User Story 1 or foundational PO draft storage plus notification service
- **User Story 3 (P2)**: Requires User Story 2 submission flow and approver role authorization
- **User Story 4 (P3)**: Requires foundational transition rules and PO status handling

### Within Each User Story

- Tests are written and failing before implementation
- Models/repositories before services
- Services before endpoints
- Endpoints before frontend integration
- UI actions before frontend state flows

## Parallel Opportunities

- Setup tasks `T005` can run in parallel with package initialization tasks.
- Foundational tasks `T007`, `T008`, `T010`, `T011`, `T012`, and `T014` can run in parallel where files do not overlap.
- Each story’s contract and integration test task can be written in parallel with service implementation tasks when they target separate files.
- Different user stories can be worked on concurrently after foundational phase completion.
- UI component and API client tasks are parallelizable across frontend files for different user stories.

## Suggested MVP Scope

- Complete Phase 1 and Phase 2
- Deliver User Story 1 as the first MVP increment
- Validate Draft PO creation, editing, and persistence before adding submission and approval flows
