# API Contract: Purchase Order Management

## Overview

This contract defines the backend REST API for the Purchase Order Management feature. The API is documented as OpenAPI/Swagger and serves as the primary integration boundary for the React frontend and any external clients.

## Endpoints

### Create Purchase Order
- `POST /api/purchase-orders`
- Request body: `{ supplierId, branchId, buyerId, lineItems: [{ productId, description, quantity, expectedUnitPrice }] }`
- Response: `201 Created` with created PO payload

### Get Purchase Order
- `GET /api/purchase-orders/:purchaseOrderId`
- Response: `200 OK` with PO details and line items

### Update Draft Purchase Order
- `PUT /api/purchase-orders/:purchaseOrderId`
- Request body: updated PO fields and line items
- Response: `200 OK` with updated PO
- Allowed only when status is `Draft`

### Submit Purchase Order
- `POST /api/purchase-orders/:purchaseOrderId/submit`
- Response: `200 OK` with updated status `Submitted`
- Side effects: create supplier notification

### Approve Purchase Order
- `POST /api/purchase-orders/:purchaseOrderId/approve`
- Request body: `{ approverId }`
- Response: `200 OK` with updated status `Approved`
- Allowed only when status is `Submitted` and totalExpectedAmount > 10000

### Fulfill Purchase Order
- `POST /api/purchase-orders/:purchaseOrderId/fulfill`
- Request body: `{ lineItemFulfillments: [{ lineItemId, quantity, shipmentReference? }] }`
- Response: `200 OK` with updated status `Partially Fulfilled` or `Fulfilled`
- Allowed only when status is `Approved` for high-value POs, or `Submitted` for POs under or equal to 10000 if approval is not required

### Get Purchase Order Fulfillment History
- `GET /api/purchase-orders/:purchaseOrderId/fulfillment-history`
- Response: `200 OK` with the PO’s fulfillment event history grouped by line item

### Cancel Purchase Order
- `POST /api/purchase-orders/:purchaseOrderId/cancel`
- Response: `200 OK` with updated status `Cancelled`
- Allowed when status is `Draft`, `Submitted`, or `Approved`

### Supplier Purchase Orders
- `GET /api/suppliers/:supplierId/purchase-orders`
- Response: `200 OK` with list of POs submitted to that supplier

## Schemas

### PurchaseOrder
- `id`: string
- `supplierId`: string
- `branchId`: string
- `buyerId`: string
- `approverId`: string | null
- `status`: `Draft` | `Submitted` | `Approved` | `Partially Fulfilled` | `Fulfilled` | `Cancelled`
- `totalExpectedAmount`: number
- `lineItems`: PurchaseOrderLineItem[]
- `createdAt`: string
- `updatedAt`: string

### PurchaseOrderLineItem
- `id`: string
- `productId`: string
- `description`: string
- `quantity`: number
- `expectedUnitPrice`: number
- `expectedTotalPrice`: number

### Notification
- `id`: string
- `supplierId`: string
- `purchaseOrderId`: string
- `type`: `PO_SUBMITTED`
- `status`: `Pending` | `Sent` | `Failed`
- `sentAt`: string | null
