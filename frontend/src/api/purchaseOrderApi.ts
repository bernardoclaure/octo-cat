export type PurchaseOrderPayload = {
  supplierId: string;
  branchId: string;
  buyerId: string;
  lineItems: {
    productId: string;
    description: string;
    quantity: number;
    expectedUnitPrice: number;
  }[];
};

export const createPurchaseOrder = async (payload: PurchaseOrderPayload) => {
  const response = await fetch('/api/purchase-orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
};
