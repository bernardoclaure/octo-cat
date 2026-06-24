import express from 'express';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes';
import swaggerRoutes from './routes/swaggerRoutes';

const app = express();

app.use(express.json());
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/docs', swaggerRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
