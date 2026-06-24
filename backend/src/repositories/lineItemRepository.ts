import db from '../database';
import { PurchaseOrderLineItem } from '../models/purchaseOrderLineItem';

const insertLineItem = db.prepare(`
INSERT INTO purchase_order_line_items (
  id, purchaseOrderId, productId, description, quantity, expectedUnitPrice,
  expectedTotalPrice, createdAt, updatedAt
) VALUES (
  @id, @purchaseOrderId, @productId, @description, @quantity, @expectedUnitPrice,
  @expectedTotalPrice, @createdAt, @updatedAt
)
`);

const deleteByPurchaseOrderId = db.prepare(`DELETE FROM purchase_order_line_items WHERE purchaseOrderId = ?`);
const getByPurchaseOrderId = db.prepare(`SELECT * FROM purchase_order_line_items WHERE purchaseOrderId = ?`);

export const createLineItems = (items: PurchaseOrderLineItem[]) => {
  const insert = db.transaction((values: PurchaseOrderLineItem[]) => {
    for (const item of values) {
      insertLineItem.run(item);
    }
  });
  insert(items);
  return items;
};

export const replaceLineItems = (purchaseOrderId: string, items: PurchaseOrderLineItem[]) => {
  const transaction = db.transaction((values: PurchaseOrderLineItem[]) => {
    deleteByPurchaseOrderId.run(purchaseOrderId);
    for (const item of values) {
      insertLineItem.run(item);
    }
  });
  transaction(items);
  return items;
};

export const getLineItems = (purchaseOrderId: string): PurchaseOrderLineItem[] => {
  return getByPurchaseOrderId.all(purchaseOrderId) as PurchaseOrderLineItem[];
};
