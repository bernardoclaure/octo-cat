export const purchaseOrderSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    supplierId: { type: 'string' },
    branchId: { type: 'string' },
    buyerId: { type: 'string' },
    approverId: { type: ['string', 'null'] },
    status: { type: 'string' },
    totalExpectedAmount: { type: 'number' },
    lineItems: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
          description: { type: 'string' },
          quantity: { type: 'number' },
          expectedUnitPrice: { type: 'number' },
        },
        required: ['productId', 'quantity', 'expectedUnitPrice'],
      },
    },
  },
  required: ['id', 'supplierId', 'branchId', 'buyerId', 'status', 'totalExpectedAmount', 'lineItems'],
};
