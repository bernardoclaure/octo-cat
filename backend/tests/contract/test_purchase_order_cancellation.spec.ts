import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Purchase order cancellation contract', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.DB_PATH = ':memory:';
  });

  it('cancels a draft purchase order and marks it as cancelled', async () => {
    const { createDraftPurchaseOrder, cancelPurchaseOrder } = await import('../../src/services/purchaseOrderService');

    const po = createDraftPurchaseOrder(
      {
        branchId: 'branch-123',
        supplierId: 'supplier-abc',
        buyerId: 'buyer-xyz',
      },
      [
        {
          productId: 'product-1',
          description: 'One widget',
          quantity: 2,
          expectedUnitPrice: 50,
        },
      ],
    );

    const cancelled = cancelPurchaseOrder(po.id);

    expect(cancelled).toBeDefined();
    expect(cancelled?.status).toBe('Cancelled');
    expect(cancelled?.cancelledAt).toBeTruthy();
  });
});
