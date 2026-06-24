import { v4 as uuidv4 } from 'uuid';
import { createPurchaseOrder, getPurchaseOrderById, updatePurchaseOrder } from '../repositories/purchaseOrderRepository';
import { replaceLineItems } from '../repositories/lineItemRepository';
import { PurchaseOrder, PurchaseOrderStatus } from '../models/purchaseOrder';
import { PurchaseOrderLineItem } from '../models/purchaseOrderLineItem';

export const createDraftPurchaseOrder = (
  payload: Omit<PurchaseOrder, 'status' | 'createdAt' | 'updatedAt'>,
  lineItems: Omit<PurchaseOrderLineItem, 'id' | 'createdAt' | 'updatedAt'>[],
) => {
  const now = new Date().toISOString();
  const po: PurchaseOrder = {
    ...payload,
    id: uuidv4(),
    status: 'Draft',
    totalExpectedAmount: lineItems.reduce((sum, item) => sum + item.quantity * item.expectedUnitPrice, 0),
    createdAt: now,
    updatedAt: now,
  };

  createPurchaseOrder(po);
  replaceLineItems(
    po.id,
    lineItems.map((item) => ({
      ...item,
      id: uuidv4(),
      purchaseOrderId: po.id,
      expectedTotalPrice: item.quantity * item.expectedUnitPrice,
      createdAt: now,
      updatedAt: now,
    })),
  );

  return po;
};

export const updateDraftPurchaseOrder = (
  poId: string,
  payload: Partial<Pick<PurchaseOrder, 'branchId' | 'supplierId' | 'buyerId'>>,
  lineItems: Omit<PurchaseOrderLineItem, 'id' | 'purchaseOrderId' | 'createdAt' | 'updatedAt'>[],
) => {
  const po = getPurchaseOrderById(poId);
  if (!po || po.status !== 'Draft') {
    return undefined;
  }

  const now = new Date().toISOString();
  const updated: PurchaseOrder = {
    ...po,
    ...payload,
    totalExpectedAmount: lineItems.reduce((sum, item) => sum + item.quantity * item.expectedUnitPrice, 0),
    updatedAt: now,
  };

  updatePurchaseOrder(updated);
  replaceLineItems(
    poId,
    lineItems.map((item) => ({
      ...item,
      id: uuidv4(),
      purchaseOrderId: poId,
      expectedTotalPrice: item.quantity * item.expectedUnitPrice,
      createdAt: now,
      updatedAt: now,
    })),
  );

  return updated;
};
