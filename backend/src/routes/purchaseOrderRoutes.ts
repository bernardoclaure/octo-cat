import { Router } from 'express';

const router = Router();

router.post('/', (_req, res) => {
  res.status(201).json({ message: 'Create PO endpoint placeholder' });
});

export default router;
