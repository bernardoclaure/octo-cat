import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

describe('Purchase order cancellation integration', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.DB_PATH = ':memory:';
  });

  it('cancels a draft purchase order through the API', async () => {
    const { default: app } = await import('../../src/app');

    const createResponse = await request(app)
      .post('/api/purchase-orders')
      .send({
        branchId: 'branch-123',
        supplierId: 'supplier-abc',
        buyerId: 'buyer-xyz',
        lineItems: [
          {
            productId: 'product-1',
            description: 'One widget',
            quantity: 2,
            expectedUnitPrice: 50,
          },
        ],
      })
      .expect(201);

    const cancelResponse = await request(app)
      .post(`/api/purchase-orders/${createResponse.body.id}/cancel`)
      .expect(200);

    expect(cancelResponse.body.status).toBe('Cancelled');
    expect(cancelResponse.body.cancelledAt).toBeTruthy();
  });
});
