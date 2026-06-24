import { getPurchaseOrderById, updatePurchaseOrder } from '../repositories/purchaseOrderRepository';
import { PurchaseOrder } from '../models/purchaseOrder';

export const approvePurchaseOrder = (purchaseOrderId: string, approverId: string) => {
  const po = getPurchaseOrderById(purchaseOrderId);
  if (!po || po.status !== 'Submitted') {
    return undefined;
  }
  if (po.totalExpectedAmount <= 10000) {
    return undefined;
  }

  const now = new Date().toISOString();
  const updated: PurchaseOrder = {
    ...po,
    status: 'Approved',
    approverId,
    approvedAt: now,
    updatedAt: now,
  };

  updatePurchaseOrder(updated);
  return updated;
};
