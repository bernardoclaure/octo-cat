import { describe, it, expect } from 'vitest';

process.env.DB_PATH = ':memory:';

import { createDraftPurchaseOrder, submitPurchaseOrder } from '../../src/services/purchaseOrderService';

describe('Purchase order submission contract', () => {
  it('submits a draft purchase order and marks it as submitted', () => {
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

    const submitted = submitPurchaseOrder(po.id);

    expect(submitted).toBeDefined();
    expect(submitted?.status).toBe('Submitted');
    expect(submitted?.totalExpectedAmount).toBe(100);
  });
});
