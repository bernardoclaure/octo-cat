import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

describe('Purchase order draft integration', () => {
  beforeEach(() => {
    process.env.DB_PATH = ':memory:';
  });

  it('creates and updates a draft purchase order through API', async () => {
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

    expect(createResponse.body).toHaveProperty('id');
    expect(createResponse.body.status).toBe('Draft');
    expect(createResponse.body.totalExpectedAmount).toBe(100);

    const purchaseOrderId = createResponse.body.id;

    const updateResponse = await request(app)
      .put(`/api/purchase-orders/${purchaseOrderId}`)
      .send({
        branchId: 'branch-123',
        supplierId: 'supplier-abc',
        buyerId: 'buyer-xyz',
        lineItems: [
          {
            productId: 'product-1',
            description: 'One widget updated',
            quantity: 3,
            expectedUnitPrice: 50,
          },
        ],
      })
      .expect(200);

    expect(updateResponse.body.totalExpectedAmount).toBe(150);
    expect(updateResponse.body.lineItems[0].description).toBe('One widget updated');
  });
});
