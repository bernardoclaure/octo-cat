# Data Model: Purchase Order Management

## Entities

### PurchaseOrder
- `id`: string (UUID)
- `branchId`: string
- `supplierId`: string
- `buyerId`: string
- `approverId`: string | null
- `status`: enum `Draft | Submitted | Approved | Fulfilled | Cancelled`
- `totalExpectedAmount`: number
- `submittedAt`: string | null
- `approvedAt`: string | null
- `fulfilledAt`: string | null
- `cancelledAt`: string | null
- `createdAt`: string
- `updatedAt`: string

### PurchaseOrderLineItem
- `id`: string (UUID)
- `purchaseOrderId`: string
- `productId`: string
- `description`: string
- `quantity`: number
- `expectedUnitPrice`: number
- `expectedTotalPrice`: number
- `createdAt`: string
- `updatedAt`: string

### Supplier
- `id`: string
- `name`: string
- `email`: string
- `contactName`: string | null

### BranchBuyer
- `id`: string
- `branchId`: string
- `name`: string
- `email`: string

### Approver
- `id`: string
- `name`: string
- `email`: string
- `canApproveAmount`: number

### Notification
- `id`: string (UUID)
- `supplierId`: string
- `purchaseOrderId`: string
- `type`: enum `PO_SUBMITTED`
- `status`: enum `Pending | Sent | Failed`
- `sentAt`: string | null
- `errorMessage`: string | null
- `createdAt`: string
- `updatedAt`: string

## Relationships

- A `PurchaseOrder` belongs to one `Supplier`, one `BranchBuyer`, and optionally one `Approver`.
- A `PurchaseOrder` has many `PurchaseOrderLineItem` records.
- A `PurchaseOrder` generates one or more `Notification` events when submitted.

## Validation Rules

- Every PO must have at least one line item.
- Line item `quantity` must be a positive integer.
- Line item `expectedUnitPrice` must be a non-negative decimal.
- `totalExpectedAmount` must equal the sum of line item `expectedTotalPrice` values.
- Only `Draft` POs may be edited or submitted.
- POs over $10,000 require `Approved` status before `Fulfilled`.
- `Cancelled` POs cannot transition to `Submitted`, `Approved`, or `Fulfilled`.
