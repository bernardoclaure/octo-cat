export interface FulfillmentEvent {
  id: string;
  purchaseOrderId: string;
  lineItemId: string;
  quantity: number;
  shipmentReference?: string | null;
  fulfilledAt: string;
  createdAt: string;
  updatedAt: string;
}
