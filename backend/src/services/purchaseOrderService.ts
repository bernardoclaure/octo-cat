import { v4 as uuidv4 } from 'uuid';
import { createPurchaseOrder, getPurchaseOrderById, updatePurchaseOrder, setPurchaseOrderStatus } from '../repositories/purchaseOrderRepository';
import { replaceLineItems, getLineItems, updateLineItemFulfilledQuantity } from '../repositories/lineItemRepository';
import { createFulfillmentEvent, getFulfillmentEventsByPurchaseOrderId } from '../repositories/fulfillmentEventRepository';
import { PurchaseOrder, PurchaseOrderStatus } from '../models/purchaseOrder';
import { PurchaseOrderLineItem } from '../models/purchaseOrderLineItem';
import { createSupplierNotification } from './notificationService';
import { approvePurchaseOrder as approvePurchaseOrderByRule, fulfillPurchaseOrder as fulfillPurchaseOrderByRule } from './approvalService';

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

export const cancelPurchaseOrder = (purchaseOrderId: string) => {
  const po = getPurchaseOrderById(purchaseOrderId);
  if (!po || !['Draft', 'Submitted', 'Approved'].includes(po.status)) {
    return undefined;
  }

  const now = new Date().toISOString();
  const updated = setPurchaseOrderStatus(purchaseOrderId, 'Cancelled', now);
  if (!updated) {
    return undefined;
  }

  return {
    ...updated,
    lineItems: getLineItems(purchaseOrderId),
  };
};

export const approveSubmittedPurchaseOrder = (purchaseOrderId: string, approverId: string) => {
  const result = approvePurchaseOrderByRule(purchaseOrderId, approverId);
  if (!result) {
    return undefined;
  }
  return {
    ...result,
    lineItems: getLineItems(purchaseOrderId),
  };
};

export const fulfillApprovedPurchaseOrder = (purchaseOrderId: string, fulfillments?: { lineItemId: string; quantity: number; shipmentReference?: string }[]) => {
  const po = getPurchaseOrderById(purchaseOrderId);
  if (!po || !['Approved', 'Partially Fulfilled'].includes(po.status)) {
    return undefined;
  }

  const now = new Date().toISOString();
  const lineItems = getLineItems(purchaseOrderId);
  const normalizedFulfillments = fulfillments ?? lineItems.map((item) => ({ lineItemId: item.id, quantity: item.quantity }));

  for (const fulfillment of normalizedFulfillments) {
    const lineItem = lineItems.find((item) => item.id === fulfillment.lineItemId);
    if (!lineItem) {
      continue;
    }

    const currentFulfilledQuantity = lineItem.fulfilledQuantity ?? 0;
    const nextFulfilledQuantity = currentFulfilledQuantity + fulfillment.quantity;
    if (nextFulfilledQuantity > lineItem.quantity) {
      return undefined;
    }

    updateLineItemFulfilledQuantity(lineItem.id, nextFulfilledQuantity, now);
    createFulfillmentEvent({
      id: uuidv4(),
      purchaseOrderId,
      lineItemId: lineItem.id,
      quantity: fulfillment.quantity,
      shipmentReference: fulfillment.shipmentReference ?? null,
      fulfilledAt: now,
      createdAt: now,
      updatedAt: now,
    });
  }

  const updatedLineItems = getLineItems(purchaseOrderId);
  const fullyFulfilled = updatedLineItems.every((item) => (item.fulfilledQuantity ?? 0) >= item.quantity);
  const partiallyFulfilled = updatedLineItems.some((item) => (item.fulfilledQuantity ?? 0) > 0 && (item.fulfilledQuantity ?? 0) < item.quantity);

  const updatedPo = setPurchaseOrderStatus(
    purchaseOrderId,
    fullyFulfilled ? 'Fulfilled' : partiallyFulfilled ? 'Partially Fulfilled' : po.status,
    now,
  );
  if (!updatedPo) {
    return undefined;
  }

  return {
    ...updatedPo,
    lineItems: updatedLineItems,
  };
};

export const getPurchaseOrderFulfillmentHistory = (purchaseOrderId: string) => {
  const po = getPurchaseOrderById(purchaseOrderId);
  if (!po) {
    return undefined;
  }

  const events = getFulfillmentEventsByPurchaseOrderId(purchaseOrderId);
  const lineItems = getLineItems(purchaseOrderId);

  return lineItems.map((lineItem) => ({
    lineItemId: lineItem.id,
    productId: lineItem.productId,
    description: lineItem.description,
    fulfilledQuantity: lineItem.fulfilledQuantity ?? 0,
    quantity: lineItem.quantity,
    events: events.filter((event) => event.lineItemId === lineItem.id),
  }));
};
