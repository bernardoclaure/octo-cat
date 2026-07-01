import { describe, it, expect, beforeEach } from 'vitest';

describe('Purchase order draft contract', () => {
  beforeEach(() => {
    process.env.DB_PATH = ':memory:';
  });

  it('creates a draft purchase order with expected payload shape', async () => {
    const payload = {
      branchId: 'branch-123',
      supplierId: 'supplier-abc',
      buyerId: 'buyer-xyz',
    };

    const lineItems = [
      {
        productId: 'product-1',
        description: 'One widget',
        quantity: 3,
        expectedUnitPrice: 25,
      },
    ];

    const { createDraftPurchaseOrder, getDraftPurchaseOrder } = await import('../../src/services/purchaseOrderService');

    const purchaseOrder = createDraftPurchaseOrder(payload, lineItems);

    expect(purchaseOrder).toHaveProperty('id');
    expect(purchaseOrder.status).toBe('Draft');
    expect(purchaseOrder.totalExpectedAmount).toBe(75);
    expect(purchaseOrder.lineItems).toHaveLength(1);
    expect(purchaseOrder.lineItems[0]).toMatchObject({ productId: 'product-1', description: 'One widget' });

    const loadedPo = getDraftPurchaseOrder(purchaseOrder.id);
    expect(loadedPo).toBeDefined();
    expect(loadedPo?.status).toBe('Draft');
    expect(loadedPo?.lineItems[0].expectedTotalPrice).toBe(75);
  });
});
