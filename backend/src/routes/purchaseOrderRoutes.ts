import { Router, Request, Response } from 'express';
import {
  approveSubmittedPurchaseOrder,
  cancelPurchaseOrder,
  createDraftPurchaseOrder,
  fulfillApprovedPurchaseOrder,
  getDraftPurchaseOrder,
  submitPurchaseOrder,
  updateDraftPurchaseOrder,
} from '../services/purchaseOrderService';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const payload = req.body;
  const po = createDraftPurchaseOrder(payload, payload.lineItems);
  res.status(201).json(po);
});

router.get('/:purchaseOrderId', (req: Request, res: Response) => {
  const { purchaseOrderId } = req.params;
  const po = getDraftPurchaseOrder(purchaseOrderId);
  if (!po) {
    return res.status(404).json({ error: 'Purchase order not found' });
  }
  res.json(po);
});

router.put('/:purchaseOrderId', (req: Request, res: Response) => {
  const { purchaseOrderId } = req.params;
  const payload = req.body;
  const po = updateDraftPurchaseOrder(purchaseOrderId, payload, payload.lineItems);
  if (!po) {
    return res.status(400).json({ error: 'Unable to update purchase order' });
  }
  res.json(po);
});

router.post('/:purchaseOrderId/submit', (req: Request, res: Response) => {
  const { purchaseOrderId } = req.params;
  const po = submitPurchaseOrder(purchaseOrderId);
  if (!po) {
    return res.status(400).json({ error: 'Unable to submit purchase order' });
  }
  res.json(po);
});

router.post('/:purchaseOrderId/approve', (req: Request, res: Response) => {
  const { purchaseOrderId } = req.params;
  const { approverId } = req.body;
  const po = approveSubmittedPurchaseOrder(purchaseOrderId, approverId);
  if (!po) {
    return res.status(400).json({ error: 'Unable to approve purchase order' });
  }
  res.json(po);
});

router.post('/:purchaseOrderId/fulfill', (req: Request, res: Response) => {
  const { purchaseOrderId } = req.params;
  const po = fulfillApprovedPurchaseOrder(purchaseOrderId);
  if (!po) {
    return res.status(400).json({ error: 'Unable to fulfill purchase order' });
  }
  res.json(po);
});

router.post('/:purchaseOrderId/cancel', (req: Request, res: Response) => {
  const { purchaseOrderId } = req.params;
  const po = cancelPurchaseOrder(purchaseOrderId);
  if (!po) {
    return res.status(400).json({ error: 'Unable to cancel purchase order' });
  }
  res.json(po);
});

export default router;
