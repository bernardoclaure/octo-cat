# Partial Fulfillment Tasks

## Phase 8: User Story 5 - Partial fulfillment and shipment history (Priority: P2)

**Goal**: Allow approved POs to be fulfilled incrementally across multiple shipments while tracking fulfillment history per line item.

**Independent Test**: Record a partial shipment against an approved PO and verify that the PO moves to Partially Fulfilled, the line-item fulfillment history is recorded, and the history retrieval endpoint returns the events.

### Tests for User Story 5

- [ ] T051 [P] [US5] Create contract test for `POST /api/purchase-orders/:purchaseOrderId/fulfill` and `GET /api/purchase-orders/:purchaseOrderId/fulfillment-history` in `backend/tests/contract/test_purchase_order_partial_fulfillment.spec.ts`
- [ ] T052 [P] [US5] Create integration test for partial-fulfillment transitions and fulfillment history retrieval in `backend/tests/integration/test_purchase_order_partial_fulfillment.spec.ts`

### Implementation for User Story 5

- [ ] T053 [US5] Extend the purchase order data model with line-item fulfillment state and shipment event persistence in `backend/src/models/purchaseOrder.ts`, `backend/src/models/purchaseOrderLineItem.ts`, and `backend/src/repositories/lineItemRepository.ts`
- [ ] T054 [US5] Implement partial-fulfillment business rules in `backend/src/services/purchaseOrderService.ts`
- [ ] T055 [US5] Add fulfillment-event repository support in `backend/src/repositories/fulfillmentEventRepository.ts`
- [ ] T056 [US5] Add fulfillment-history endpoints in `backend/src/routes/purchaseOrderRoutes.ts`
- [ ] T057 [US5] Update OpenAPI and schemas in `backend/src/schemas/purchaseOrderSchemas.ts` and `backend/src/schemas/swagger.json`
- [ ] T058 [US5] Add frontend API support for partial fulfillment and fulfillment-history retrieval in `frontend/src/api/purchaseOrderApi.ts`
- [ ] T059 [US5] Add partial-fulfillment UI actions and history display in `frontend/src/pages/purchase-orders/PurchaseOrderDetail.tsx`
- [ ] T060 [US5] Expose fulfillment state in shared frontend state in `frontend/src/context/purchaseOrderContext.tsx`

**Checkpoint**: User Story 5 should be independently functional and testable after partial-fulfillment implementation.
