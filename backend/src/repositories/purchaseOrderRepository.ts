import db from '../database';
import { PurchaseOrder, PurchaseOrderStatus } from '../models/purchaseOrder';

const insertPo = db.prepare(`
INSERT INTO purchase_orders (
  id, branchId, supplierId, buyerId, approverId, status, totalExpectedAmount,
  submittedAt, approvedAt, fulfilledAt, cancelledAt, createdAt, updatedAt
) VALUES (
  ?, ?, ?, ?, ?, ?, ?,
  ?, ?, ?, ?, ?, ?
)
`);

const updatePo = db.prepare(`
UPDATE purchase_orders SET
  branchId = ?,
  supplierId = ?,
  buyerId = ?,
  approverId = ?,
  status = ?,
  totalExpectedAmount = ?,
  submittedAt = ?,
  approvedAt = ?,
  fulfilledAt = ?,
  cancelledAt = ?,
  updatedAt = ?
WHERE id = ?
`);

const getByIdStmt = db.prepare(`SELECT * FROM purchase_orders WHERE id = ?`);

const normalize = (value: unknown) => (value === undefined ? null : value);

export const createPurchaseOrder = (po: PurchaseOrder) => {
  insertPo.run(
    normalize(po.id),
    normalize(po.branchId),
    normalize(po.supplierId),
    normalize(po.buyerId),
    normalize(po.approverId),
    normalize(po.status),
    normalize(po.totalExpectedAmount),
    normalize(po.submittedAt),
    normalize(po.approvedAt),
    normalize(po.fulfilledAt),
    normalize(po.cancelledAt),
    normalize(po.createdAt),
    normalize(po.updatedAt),
  );
  return po;
};

export const updatePurchaseOrder = (po: PurchaseOrder) => {
  updatePo.run(
    normalize(po.branchId),
    normalize(po.supplierId),
    normalize(po.buyerId),
    normalize(po.approverId),
    normalize(po.status),
    normalize(po.totalExpectedAmount),
    normalize(po.submittedAt),
    normalize(po.approvedAt),
    normalize(po.fulfilledAt),
    normalize(po.cancelledAt),
    normalize(po.updatedAt),
    normalize(po.id),
  );
  return po;
};

export const getPurchaseOrderById = (id: string): PurchaseOrder | undefined => {
  return getByIdStmt.get(id) as PurchaseOrder | undefined;
};

export const setPurchaseOrderStatus = (id: string, status: PurchaseOrderStatus, timestamp: string) => {
  const po = getPurchaseOrderById(id);
  if (!po) {
    return undefined;
  }
  const updated: PurchaseOrder = {
    ...po,
    status,
    updatedAt: timestamp,
    submittedAt: status === 'Submitted' ? timestamp : po.submittedAt,
    approvedAt: status === 'Approved' ? timestamp : po.approvedAt,
    fulfilledAt: status === 'Fulfilled' ? timestamp : po.fulfilledAt,
    cancelledAt: status === 'Cancelled' ? timestamp : po.cancelledAt,
  };
  updatePo.run(updated);
  return updated;
};
