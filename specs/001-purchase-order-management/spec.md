# Feature Specification: Purchase Order Management

**Feature Branch**: `[001-purchase-order-management]`

**Created**: 2026-06-24

**Status**: Draft

**Input**: User description: "Create a Purchase Order management system. Buyers at branches can create purchase orders to suppliers for products. Each PO contains multiple line items with quantities and expected prices. Track PO status (Draft, Submitted, Approved, Partially Fulfilled, Fulfilled, Cancelled). Suppliers receive notifications when POs are submitted. Include approval workflow for POs over $10,000. Support partial fulfillment where line items can be fulfilled across multiple shipments, track fulfillment history per line item, and expose fulfillment history through a retrieval endpoint."

## Clarifications

### Session 2026-06-24

- Q: Should approval be performed by the same branch buyer or a separate role? → A: A distinct approver role separate from branch buyers.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and manage purchase orders (Priority: P1)

A branch buyer can create a purchase order for a supplier, add multiple product line items with quantities and expected prices, save it as a draft, and update it before submission.

**Why this priority**: This is the core business flow needed for procurement and starts the PO lifecycle.

**Independent Test**: Create a new PO, add line items, save it as Draft, then verify the PO data and status.

**Acceptance Scenarios**:

1. **Given** a branch buyer is authenticated, **When** they create a new PO with supplier and at least one line item, **Then** the system saves the PO in Draft status and displays all entered details.
2. **Given** a PO is in Draft status, **When** the buyer updates the line items or expected prices, **Then** the system preserves the updated values and keeps the PO in Draft.

---

### User Story 2 - Submit purchase orders and notify suppliers (Priority: P2)

A branch buyer can submit a Draft PO to a supplier, triggering a supplier notification and moving the PO to Submitted status.

**Why this priority**: Submission is required for supplier engagement and starts the approval and fulfillment workflow.

**Independent Test**: Submit a Draft PO and verify that the status changes to Submitted and that the supplier notification record is created.

**Acceptance Scenarios**:

1. **Given** a PO is in Draft status, **When** the buyer submits it, **Then** the system changes the PO status to Submitted and records a supplier notification.
2. **Given** a PO has been submitted, **When** the supplier views their incoming POs, **Then** they see the new PO with Submitted status.

---

### User Story 3 - Approval and fulfillment workflow for higher-value orders (Priority: P2)

A submitted PO above $10,000 requires approval before it can be fulfilled. Approved POs may then be fulfilled incrementally across multiple shipments. The PO remains in Partially Fulfilled status until every line item has completed, and the system records a fulfillment history for each line item.

**Why this priority**: Approval controls protect the business for large commitments and ensure fulfillment is visible and auditable over time.

**Independent Test**: Submit a PO over $10,000, approve it, record partial fulfillment for one line item, and verify that the PO remains Partially Fulfilled until the final shipment completes the order.

**Acceptance Scenarios**:

1. **Given** a submitted PO has a total expected value greater than $10,000, **When** an approver reviews it, **Then** the PO can move from Submitted to Approved.
2. **Given** a submitted PO is over $10,000 and has not been approved, **When** fulfillment is attempted, **Then** the system prevents fulfillment and keeps the PO in Submitted status.
3. **Given** an approved PO has outstanding quantity on one or more line items, **When** a shipment is recorded for part of the outstanding quantity, **Then** the system updates the line item fulfillment record and moves the PO to Partially Fulfilled.
4. **Given** a PO is in Partially Fulfilled status, **When** the final outstanding quantity for all line items is recorded, **Then** the system moves the PO to Fulfilled.
5. **Given** a PO has partial fulfillment activity, **When** fulfillment history is requested, **Then** the system returns the shipment history for each line item.

---

### User Story 4 - Cancel purchase orders at permitted stages (Priority: P3)

A buyer can cancel a PO while it is Draft, Submitted, or Approved. Cancelled POs cannot be fulfilled.

**Why this priority**: Cancellation provides a safe recovery path for incorrect or changed orders.

**Independent Test**: Cancel a PO in each allowed status and verify it moves to Cancelled and cannot be fulfilled.

**Acceptance Scenarios**:

1. **Given** a PO is in Draft, Submitted, or Approved status, **When** the buyer cancels it, **Then** the system sets status to Cancelled.
2. **Given** a PO is Cancelled, **When** anyone tries to advance it, **Then** the system rejects the action and preserves Cancelled status.

---

### Edge Cases

- What happens when a PO is submitted without any line items? The system must prevent submission and require at least one line item.
- How does the system handle duplicate product lines? The system should either merge duplicates or require explicit correction before submission.
- What happens if a supplier notification fails? The PO should remain Submitted and generate a retry or alert for notification delivery.
- How does the system behave if a buyer attempts to approve a PO below $10,000? The system should allow direct fulfillment without the approval gate.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow a branch buyer to create a purchase order for a specific supplier.
- **FR-002**: System MUST allow a PO to include multiple line items, each with product identifier, quantity, and expected price.
- **FR-003**: System MUST save newly created POs in Draft status.
- **FR-004**: System MUST allow buyers to edit Draft POs and preserve changes.
- **FR-005**: System MUST allow buyers to submit Draft POs and change status to Submitted.
- **FR-006**: System MUST notify the selected supplier when a PO is submitted.
- **FR-007**: System MUST require approval for submitted POs with total expected value above $10,000 before they can be fulfilled.
- **FR-008**: System MUST track PO status using the states Draft, Submitted, Approved, Partially Fulfilled, Fulfilled, and Cancelled.
- **FR-009**: System MUST allow buyers to cancel POs while they are Draft, Submitted, or Approved.
- **FR-010**: System MUST prevent fulfillment of POs that have not reached Approved status when approval is required, that are Cancelled, or that would exceed the outstanding quantity on a line item.
- **FR-011**: System MUST preserve the PO lifecycle history so that status transitions can be audited.
- **FR-012**: System MUST require high-value PO approvals to be performed by a distinct approver role separate from branch buyers.
- **FR-013**: System MUST allow approved POs to be fulfilled incrementally across multiple shipments, with each shipment applying to one or more line items.
- **FR-014**: System MUST track fulfillment history per line item, including the quantity fulfilled, shipment timestamp, and shipment reference.
- **FR-015**: System MUST expose a retrieval capability for purchase order fulfillment history so that shipment activity can be reviewed for the PO and its line items.

### Key Entities *(include if feature involves data)*

- **Purchase Order (PO)**: Represents a procurement request from a branch to a supplier, including supplier info, branch buyer, status, and totals.
- **Line Item**: Represents a product request on a PO with quantity, expected unit price, and product reference.
- **Fulfillment Event**: Represents a shipment or partial delivery applied to one or more line items, including quantity fulfilled and timestamp.
- **Branch Buyer**: Represents the buyer role at a branch who creates and manages POs.
- **Supplier**: Represents the vendor receiving the PO and notifications when a PO is submitted.
- **Approver**: Represents the role authorized to approve higher-value POs, distinct from branch buyers.
- **Notification**: Represents the supplier-facing alert created when a PO is submitted.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A branch buyer can create a PO with at least one line item and save it as Draft.
- **SC-002**: A submitted PO moves to Submitted status and a supplier notification is recorded within one minute of submission.
- **SC-003**: Submitted POs with total expected value above $10,000 require approval before they can transition to Fulfilled, and approved POs may be fulfilled incrementally.
- **SC-004**: The system supports the defined PO status lifecycle: Draft → Submitted → Approved → Partially Fulfilled → Fulfilled, plus Cancelled.
- **SC-005**: A cancelled PO cannot be fulfilled and remains in Cancelled status.
- **SC-006**: Acceptance tests cover both normal and edge case transitions for PO creation, submission, approval, partial fulfillment, fulfillment, and cancellation.
- **SC-007**: A PO moves to Partially Fulfilled while any line item still has outstanding quantity and reaches Fulfilled once all line items are complete.
- **SC-008**: A fulfillment history retrieval request returns the shipment timeline for the PO and each line item.

## Assumptions

- Buyers at branches are already authenticated and authorized to create POs for their own branch.
- An approver role exists separately from branch buyers for approval of high-value purchase orders.
- Products referenced in line items are represented by a stable product identifier, but a full catalog lookup is not required in this feature.
- Supplier notification can be modeled as a recorded delivery event; actual delivery mechanics may be implemented separately.
- The approval workflow is based on expected total price, not actual invoiced cost.
- Change requests, purchase order revisions, and supplier quote negotiation are out of scope for this initial feature.
- Fulfillment is recorded as shipment events against existing line-item quantities and does not require integration with external logistics systems for this feature.
