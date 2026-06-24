import db from '../database';
import { PurchaseOrder, PurchaseOrderStatus } from '../models/purchaseOrder';

const insertPo = db.prepare(`
INSERT INTO purchase_orders (
  id, branchId, supplierId, buyerId, approverId, status, totalExpectedAmount,
  submittedAt, approvedAt, fulfilledAt, cancelledAt, createdAt, updatedAt
) VALUES (
  @id, @branchId, @supplierId, @buyerId, @approverId, @status, @totalExpectedAmount,
  @submittedAt, @approvedAt, @fulfilledAt, @cancelledAt, @createdAt, @updatedAt
)
`);

const updatePo = db.prepare(`
UPDATE purchase_orders SET
  branchId = @branchId,
  supplierId = @supplierId,
  buyerId = @buyerId,
  approverId = @approverId,
  status = @status,
  totalExpectedAmount = @totalExpectedAmount,
  submittedAt = @submittedAt,
  approvedAt = @approvedAt,
  fulfilledAt = @fulfilledAt,
  cancelledAt = @cancelledAt,
  updatedAt = @updatedAt
WHERE id = @id
`);

const getByIdStmt = db.prepare(`SELECT * FROM purchase_orders WHERE id = ?`);

export const createPurchaseOrder = (po: PurchaseOrder) => {
  insertPo.run(po);
  return po;
};

export const updatePurchaseOrder = (po: PurchaseOrder) => {
  updatePo.run(po);
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
