export interface PurchaseOrderLineItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  description: string;
  quantity: number;
  fulfilledQuantity?: number;
  expectedUnitPrice: number;
  expectedTotalPrice: number;
  createdAt: string;
  updatedAt: string;
}
