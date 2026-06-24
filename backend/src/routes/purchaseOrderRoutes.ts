import { Router, Request, Response } from 'express';
import { createDraftPurchaseOrder, updateDraftPurchaseOrder } from '../services/purchaseOrderService';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const payload = req.body;
  const po = createDraftPurchaseOrder(payload, payload.lineItems);
  res.status(201).json(po);
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

export default router;
