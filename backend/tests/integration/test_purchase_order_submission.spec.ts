import { describe, it, expect } from 'vitest';
import request from 'supertest';

process.env.DB_PATH = ':memory:';

import app from '../../src/app';

describe('Purchase order submission integration', () => {
  it('submits a draft purchase order and creates a supplier notification', async () => {
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

    const submitResponse = await request(app)
      .post(`/api/purchase-orders/${createResponse.body.id}/submit`)
      .expect(200);

    expect(submitResponse.body.status).toBe('Submitted');
    expect(submitResponse.body.totalExpectedAmount).toBe(100);
  });
});
