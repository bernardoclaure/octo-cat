import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PurchaseOrderResponse } from '../../api/purchaseOrderApi';
import { usePurchaseOrder } from '../../context/purchaseOrderContext';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';

export default function PurchaseOrderDetail() {
  const { purchaseOrderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getPurchaseOrder, cancelPurchaseOrder, loading } = usePurchaseOrder();
  const initialPurchaseOrder = (location.state as { purchaseOrder?: PurchaseOrderResponse } | undefined)?.purchaseOrder;
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderResponse | null>(initialPurchaseOrder ?? null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!purchaseOrderId) {
      return;
    }

    if (initialPurchaseOrder && initialPurchaseOrder.id === purchaseOrderId) {
      setPurchaseOrder(initialPurchaseOrder);
      return;
    }

    getPurchaseOrder(purchaseOrderId)
      .then(setPurchaseOrder)
      .catch(() => setError('Unable to load purchase order details.'));
  }, [getPurchaseOrder, initialPurchaseOrder, purchaseOrderId]);

  const handleCancel = async () => {
    if (!purchaseOrderId) {
      return;
    }

    try {
      const cancelled = await cancelPurchaseOrder(purchaseOrderId);
      setPurchaseOrder(cancelled);
      setError(null);
    } catch {
      setError('Unable to cancel purchase order.');
    }
  };

  if (!purchaseOrder) {
    return <div>{loading ? 'Loading...' : 'Purchase order not found.'}</div>;
  }

  return (
    <div>
      <h2>Purchase Order Details</h2>
      <p>
        <strong>ID:</strong> {purchaseOrder.id}
      </p>
      <p>
        <strong>Status:</strong> <StatusBadge status={purchaseOrder.status} />
      </p>
      <p>
        <strong>Workflow note:</strong>{' '}
        {purchaseOrder.status === 'Cancelled'
          ? 'This purchase order has been cancelled and cannot advance.'
          : purchaseOrder.status === 'Fulfilled'
            ? 'This purchase order has been fulfilled.'
            : 'This purchase order is still active in the workflow.'}
      </p>
      <p>
        <strong>Total:</strong> ${purchaseOrder.totalExpectedAmount.toFixed(2)}
      </p>
      <p>
        <strong>Supplier:</strong> {purchaseOrder.supplierId}
      </p>
      <p>
        <strong>Buyer:</strong> {purchaseOrder.buyerId}
      </p>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {['Draft', 'Submitted', 'Approved'].includes(purchaseOrder.status) && (
        <Button onClick={handleCancel}>{loading ? 'Cancelling...' : 'Cancel Purchase Order'}</Button>
      )}
      <Button onClick={() => navigate(`/purchase-orders/${purchaseOrder.id}/edit`, { state: { purchaseOrder } })}>Edit Draft</Button>
    </div>
  );
}
