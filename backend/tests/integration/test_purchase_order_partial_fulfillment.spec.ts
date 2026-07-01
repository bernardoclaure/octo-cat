import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

describe('Purchase order partial fulfillment integration', () => {
  beforeEach(() => {
    process.env.DB_PATH = ':memory:';
    vi.resetModules();
  });

  it('transitions a PO to partially fulfilled and preserves history per line item', async () => {
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
            description: 'Widget',
            quantity: 5,
            expectedUnitPrice: 2500,
          },
        ],
      })
      .expect(201);

    const purchaseOrderId = createResponse.body.id;
    const lineItemId = createResponse.body.lineItems[0].id;

    await request(app).post(`/api/purchase-orders/${purchaseOrderId}/submit`).expect(200);
    await request(app).post(`/api/purchase-orders/${purchaseOrderId}/approve`).send({ approverId: 'approver-1' }).expect(200);

    await request(app)
      .post(`/api/purchase-orders/${purchaseOrderId}/fulfill`)
      .send({ lineItemFulfillments: [{ lineItemId, quantity: 1, shipmentReference: 'SHIP-001' }] })
      .expect(200);

    const currentResponse = await request(app).get(`/api/purchase-orders/${purchaseOrderId}`).expect(200);
    expect(currentResponse.body.status).toBe('Partially Fulfilled');
    expect(currentResponse.body.lineItems[0].fulfilledQuantity).toBe(1);

    const historyResponse = await request(app).get(`/api/purchase-orders/${purchaseOrderId}/fulfillment-history`).expect(200);
    expect(historyResponse.body[0].lineItemId).toBe(lineItemId);
    expect(historyResponse.body[0].events[0].quantity).toBe(1);
    expect(historyResponse.body[0].events[0].shipmentReference).toBe('SHIP-001');
  });
});
