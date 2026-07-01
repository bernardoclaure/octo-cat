export type PurchaseOrderLineItemPayload = {
  productId: string;
  description: string;
  quantity: number;
  expectedUnitPrice: number;
};

export type PurchaseOrderPayload = {
  supplierId: string;
  branchId: string;
  buyerId: string;
  lineItems: PurchaseOrderLineItemPayload[];
};

export type FulfillmentEventResponse = {
  id: string;
  quantity: number;
  shipmentReference?: string | null;
  fulfilledAt: string;
};

export type PurchaseOrderLineItemResponse = PurchaseOrderLineItemPayload & {
  id: string;
  fulfilledQuantity?: number;
  expectedTotalPrice: number;
  createdAt: string;
  updatedAt: string;
};

export type PurchaseOrderResponse = PurchaseOrderPayload & {
  id: string;
  status: string;
  totalExpectedAmount: number;
  createdAt: string;
  updatedAt: string;
  lineItems: PurchaseOrderLineItemResponse[];
};

export type FulfillmentHistoryEntry = {
  lineItemId: string;
  productId: string;
  description: string;
  fulfilledQuantity: number;
  quantity: number;
  events: FulfillmentEventResponse[];
};

export const createPurchaseOrder = async (payload: PurchaseOrderPayload): Promise<PurchaseOrderResponse> => {
  const response = await fetch('/api/purchase-orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Create purchase order failed: ${response.status}`);
  }

  return response.json();
};

export const updatePurchaseOrder = async (
  purchaseOrderId: string,
  payload: PurchaseOrderPayload,
): Promise<PurchaseOrderResponse> => {
  const response = await fetch(`/api/purchase-orders/${purchaseOrderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Update purchase order failed: ${response.status}`);
  }

  return response.json();
};

export const getPurchaseOrder = async (purchaseOrderId: string): Promise<PurchaseOrderResponse> => {
  const response = await fetch(`/api/purchase-orders/${purchaseOrderId}`);

  if (!response.ok) {
    throw new Error(`Fetch purchase order failed: ${response.status}`);
  }

  return response.json();
};

export const cancelPurchaseOrder = async (purchaseOrderId: string): Promise<PurchaseOrderResponse> => {
  const response = await fetch(`/api/purchase-orders/${purchaseOrderId}/cancel`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Cancel purchase order failed: ${response.status}`);
  }

  return response.json();
};

export const fulfillPurchaseOrder = async (
  purchaseOrderId: string,
  lineItemFulfillments: { lineItemId: string; quantity: number; shipmentReference?: string }[],
): Promise<PurchaseOrderResponse> => {
  const response = await fetch(`/api/purchase-orders/${purchaseOrderId}/fulfill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lineItemFulfillments }),
  });

  if (!response.ok) {
    throw new Error(`Fulfill purchase order failed: ${response.status}`);
  }

  return response.json();
};

export const getPurchaseOrderFulfillmentHistory = async (purchaseOrderId: string): Promise<FulfillmentHistoryEntry[]> => {
  const response = await fetch(`/api/purchase-orders/${purchaseOrderId}/fulfillment-history`);

  if (!response.ok) {
    throw new Error(`Fetch fulfillment history failed: ${response.status}`);
  }

  return response.json();
};
