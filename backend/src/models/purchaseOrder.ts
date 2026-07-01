export type PurchaseOrderStatus = 'Draft' | 'Submitted' | 'Approved' | 'Partially Fulfilled' | 'Fulfilled' | 'Cancelled';

export interface PurchaseOrder {
  id: string;
  branchId: string;
  supplierId: string;
  buyerId: string;
  approverId?: string | null;
  status: PurchaseOrderStatus;
  totalExpectedAmount: number;
  submittedAt?: string | null;
  approvedAt?: string | null;
  fulfilledAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
