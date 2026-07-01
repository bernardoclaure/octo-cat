# Quickstart: Validate Purchase Order Management

## Prerequisites

- Node.js 20+ installed
- npm available
- A terminal in the repository root

## Setup

1. Install dependencies:

```bash
cd c:\repos\copInmersive
npm install
```

2. Start the backend API:

```bash
npm run dev:backend
```

3. In a second terminal, start the frontend app:

```bash
npm run dev:frontend
```

## Validation Scenarios

### Scenario 1: Create a draft PO

1. Open the app at http://localhost:5173.
2. Create a new draft purchase order with one line item.
3. Save it.

Expected result:
- The order is created with status Draft.
- The total expected amount is shown.

### Scenario 2: Submit and cancel a PO

1. Open the detail view for the created purchase order.
2. Submit it from the UI or API.
3. Cancel it.

Expected result:
- The status moves to Submitted and then Cancelled.

### Scenario 3: Approve and fulfill a high-value PO

1. Create or submit a PO with a total above $10,000.
2. Call the approval endpoint.
3. Call the fulfillment endpoint with a partial shipment for one line item.
4. Call the fulfillment-history endpoint to inspect the event history.

Expected result:
- The status becomes Approved and then Partially Fulfilled after the first shipment.
- The history endpoint returns the shipment events for the PO and its line items.
- A subsequent shipment that completes the outstanding quantity moves the PO to Fulfilled.

## Test Commands

Run backend tests:

```bash
npm --workspace backend test
```

Build the frontend:

```bash
npm --workspace frontend run build
```

Run the Playwright smoke test:

```bash
npx playwright test frontend/tests/e2e/purchaseOrderLifecycle.spec.ts
```
