# Quickstart: Validate Purchase Order Management

## Prerequisites

- Node.js 20+ installed
- Yarn or npm available
- A terminal in `repos/copInmersive`

## Setup

1. Install dependencies:

```bash
cd c:\Users\Bernardo Claure\repos\copInmersive
npm install
```

2. Initialize the SQLite database schema for the backend.

```bash
npm run db:init
```

3. Start the backend API and frontend app.

```bash
npm run dev:backend
npm run dev:frontend
```

## Validation Scenarios

### Scenario 1: Create a Draft PO

1. As a branch buyer, create a new purchase order with one supplier.
2. Add one or more line items with quantity and expected price.
3. Save the PO.

Expected result:
- PO is stored with status `Draft`.
- Line items are persisted and retrievable.

### Scenario 2: Submit a PO and notify the supplier

1. Submit the Draft PO.
2. Confirm the PO status changes to `Submitted`.
3. Verify a supplier notification record exists.

Expected result:
- PO status is `Submitted`.
- Notification state is `Pending` or `Sent`.

### Scenario 3: Approve a high-value PO

1. Create or submit a PO with total expected amount above $10,000.
2. Use the approver role to approve the PO.

Expected result:
- PO transitions from `Submitted` to `Approved`.
- Fulfillment is blocked until approval for high-value PO.

### Scenario 4: Cancel a PO

1. Cancel a PO in `Draft`, `Submitted`, or `Approved` status.

Expected result:
- PO status changes to `Cancelled`.
- Further workflow transitions are rejected.

## Test Commands

- Run unit tests:

```bash
npm test
```

- Run integration tests:

```bash
npm run test:integration
```

- Run E2E tests:

```bash
npm run test:e2e
```
