export interface PurchaseOrderLineItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  description: string;
  quantity: number;
  expectedUnitPrice: number;
  expectedTotalPrice: number;
  createdAt: string;
  updatedAt: string;
}
