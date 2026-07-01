import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Purchase order approval workflow', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.DB_PATH = ':memory:';
  });

  it('transitions a submitted purchase order to approved and fulfilled', async () => {
    const { createDraftPurchaseOrder, submitPurchaseOrder, approveSubmittedPurchaseOrder, fulfillApprovedPurchaseOrder } = await import('../../src/services/purchaseOrderService');
    const { getPurchaseOrderById } = await import('../../src/repositories/purchaseOrderRepository');

    const po = createDraftPurchaseOrder(
      {
        branchId: 'branch-1',
        supplierId: 'supplier-1',
        buyerId: 'buyer-1',
      },
      [
        {
          productId: 'product-1',
          description: 'Widget',
          quantity: 100,
          expectedUnitPrice: 120,
        },
      ],
    );

    const submitted = submitPurchaseOrder(po.id);
    expect(submitted?.status).toBe('Submitted');

    const approved = approveSubmittedPurchaseOrder(po.id, 'approver-1');
    expect(approved?.status).toBe('Approved');
    expect(approved?.approverId).toBe('approver-1');

    const fulfilled = fulfillApprovedPurchaseOrder(po.id);
    expect(fulfilled?.status).toBe('Fulfilled');

    const persisted = getPurchaseOrderById(po.id);
    expect(persisted?.status).toBe('Fulfilled');
    expect(persisted?.approvedAt).toBeTruthy();
    expect(persisted?.fulfilledAt).toBeTruthy();
  });
});
