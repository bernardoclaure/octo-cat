import { beforeEach, describe, it, expect, vi } from 'vitest';

describe('Purchase order approval contract', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.DB_PATH = ':memory:';
  });

  it('approves and fulfills a high-value submitted purchase order', async () => {
    const { createDraftPurchaseOrder, submitPurchaseOrder, approveSubmittedPurchaseOrder, fulfillApprovedPurchaseOrder } = await import('../../src/services/purchaseOrderService');

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
          quantity: 200,
          expectedUnitPrice: 60,
        },
      ],
    );

    submitPurchaseOrder(po.id);
    const approved = approveSubmittedPurchaseOrder(po.id, 'approver-1');
    const fulfilled = fulfillApprovedPurchaseOrder(po.id);

    expect(approved).toBeDefined();
    expect(approved?.status).toBe('Approved');
    expect(fulfilled).toBeDefined();
    expect(fulfilled?.status).toBe('Fulfilled');
  });
});
