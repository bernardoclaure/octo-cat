import { v4 as uuidv4 } from 'uuid';
import db from '../database';

const insertNotification = db.prepare(`
INSERT INTO notifications (
  id, supplierId, purchaseOrderId, type, status, sentAt, errorMessage, createdAt, updatedAt
) VALUES (
  @id, @supplierId, @purchaseOrderId, @type, @status, @sentAt, @errorMessage, @createdAt, @updatedAt
)
`);

export const createSupplierNotification = (supplierId: string, purchaseOrderId: string) => {
  const now = new Date().toISOString();
  const notification = {
    id: uuidv4(),
    supplierId,
    purchaseOrderId,
    type: 'PO_SUBMITTED',
    status: 'Pending',
    sentAt: null,
    errorMessage: null,
    createdAt: now,
    updatedAt: now,
  };

  insertNotification.run(
    notification.id,
    notification.supplierId,
    notification.purchaseOrderId,
    notification.type,
    notification.status,
    notification.sentAt ?? null,
    notification.errorMessage ?? null,
    notification.createdAt,
    notification.updatedAt,
  );
  return notification;
};
