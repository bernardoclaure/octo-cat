import { v4 as uuidv4 } from 'uuid';
import { createPurchaseOrder, getPurchaseOrderById, updatePurchaseOrder, setPurchaseOrderStatus } from '../repositories/purchaseOrderRepository';
import { replaceLineItems, getLineItems } from '../repositories/lineItemRepository';
import { PurchaseOrder, PurchaseOrderStatus } from '../models/purchaseOrder';
import { PurchaseOrderLineItem } from '../models/purchaseOrderLineItem';
import { createSupplierNotification } from './notificationService';

export type PurchaseOrderWithLineItems = PurchaseOrder & {
  lineItems: PurchaseOrderLineItem[];
};

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

  return { ...po, lineItems: getLineItems(po.id) };
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

  return { ...updated, lineItems: getLineItems(poId) };
};

export const getDraftPurchaseOrder = (purchaseOrderId: string): PurchaseOrderWithLineItems | undefined => {
  const po = getPurchaseOrderById(purchaseOrderId);
  if (!po) {
    return undefined;
  }
  return {
    ...po,
    lineItems: getLineItems(purchaseOrderId),
  };
};

export const submitPurchaseOrder = (purchaseOrderId: string) => {
  const po = getPurchaseOrderById(purchaseOrderId);
  if (!po || po.status !== 'Draft') {
    return undefined;
  }

  const now = new Date().toISOString();
  const updated = setPurchaseOrderStatus(purchaseOrderId, 'Submitted', now);
  if (!updated) {
    return undefined;
  }

  createSupplierNotification(po.supplierId, po.id);

  return {
    ...updated,
    lineItems: getLineItems(purchaseOrderId),
  };
};
