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
  const { getPurchaseOrder, cancelPurchaseOrder, fulfillPurchaseOrder, getPurchaseOrderFulfillmentHistory, loading } = usePurchaseOrder();
  const initialPurchaseOrder = (location.state as { purchaseOrder?: PurchaseOrderResponse } | undefined)?.purchaseOrder;
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderResponse | null>(initialPurchaseOrder ?? null);
  const [history, setHistory] = useState<Array<{ lineItemId: string; productId: string; description: string; fulfilledQuantity: number; quantity: number; events: Array<{ id: string; quantity: number; shipmentReference?: string | null; fulfilledAt: string }> }>>([]);
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
      .then((po) => {
        setPurchaseOrder(po);
        return getPurchaseOrderFulfillmentHistory(purchaseOrderId);
      })
      .then(setHistory)
      .catch(() => setError('Unable to load purchase order details.'));
  }, [getPurchaseOrder, getPurchaseOrderFulfillmentHistory, initialPurchaseOrder, purchaseOrderId]);

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

  const handleFulfill = async () => {
    if (!purchaseOrderId || !purchaseOrder) {
      return;
    }

    const firstLineItem = purchaseOrder.lineItems[0];
    if (!firstLineItem) {
      return;
    }

    try {
      const fulfilled = await fulfillPurchaseOrder(purchaseOrderId, [{ lineItemId: firstLineItem.id, quantity: 1, shipmentReference: 'SHIP-001' }]);
      setPurchaseOrder(fulfilled);
      const nextHistory = await getPurchaseOrderFulfillmentHistory(purchaseOrderId);
      setHistory(nextHistory);
      setError(null);
    } catch {
      setError('Unable to fulfill purchase order.');
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
      {['Approved', 'Partially Fulfilled'].includes(purchaseOrder.status) && (
        <Button onClick={handleFulfill}>{loading ? 'Fulfilling...' : 'Record Partial Fulfillment'}</Button>
      )}
      <Button onClick={() => navigate(`/purchase-orders/${purchaseOrder.id}/edit`, { state: { purchaseOrder } })}>Edit Draft</Button>

      {history.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Fulfillment History</h3>
          <ul>
            {history.map((entry) => (
              <li key={entry.lineItemId}>
                {entry.description}: {entry.fulfilledQuantity}/{entry.quantity} fulfilled
                <ul>
                  {entry.events.map((event) => (
                    <li key={event.id}>
                      {event.quantity} units{event.shipmentReference ? ` via ${event.shipmentReference}` : ''}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
