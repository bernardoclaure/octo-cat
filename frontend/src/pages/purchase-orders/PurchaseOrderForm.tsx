import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePurchaseOrder } from '../../context/purchaseOrderContext';
import { PurchaseOrderPayload, PurchaseOrderResponse, PurchaseOrderLineItemPayload } from '../../api/purchaseOrderApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PurchaseOrderLineItemEditor from '../../components/purchase-orders/PurchaseOrderLineItemEditor';

const emptyLineItem = (): PurchaseOrderLineItemPayload => ({
  productId: '',
  description: '',
  quantity: 1,
  expectedUnitPrice: 0,
});

export default function PurchaseOrderForm() {
  const { purchaseOrderId } = useParams();
  const navigate = useNavigate();
  const { createPurchaseOrder, updatePurchaseOrder, getPurchaseOrder, loading } = usePurchaseOrder();
  const [supplierId, setSupplierId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [buyerId, setBuyerId] = useState('');
  const [lineItems, setLineItems] = useState<PurchaseOrderLineItemPayload[]>([emptyLineItem()]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isEditMode = Boolean(purchaseOrderId);

  useEffect(() => {
    if (!purchaseOrderId) {
      return;
    }

    getPurchaseOrder(purchaseOrderId)
      .then((po) => {
        setSupplierId(po.supplierId);
        setBranchId(po.branchId);
        setBuyerId(po.buyerId);
        setLineItems(po.lineItems.length > 0 ? po.lineItems : [emptyLineItem()]);
      })
      .catch(() => {
        setError('Unable to load purchase order for editing.');
      });
  }, [getPurchaseOrder, purchaseOrderId]);

  const totalAmount = useMemo(
    () => lineItems.reduce((sum, item) => sum + item.quantity * item.expectedUnitPrice, 0),
    [lineItems],
  );

  const updateLineItem = (index: number, item: Partial<PurchaseOrderLineItemPayload>) => {
    setLineItems((current) =>
      current.map((line, idx) => (idx === index ? { ...line, ...item } : line)),
    );
  };

  const addLineItem = () => {
    setLineItems((current) => [...current, emptyLineItem()]);
  };

  const removeLineItem = (index: number) => {
    setLineItems((current) => current.filter((_, idx) => idx !== index));
  };

  const validatePayload = (payload: PurchaseOrderPayload) => {
    if (!payload.branchId.trim() || !payload.supplierId.trim() || !payload.buyerId.trim()) {
      return 'Branch, supplier, and buyer are required.';
    }

    if (payload.lineItems.length === 0) {
      return 'At least one line item is required.';
    }

    for (const [index, item] of payload.lineItems.entries()) {
      if (!item.productId.trim() || !item.description.trim()) {
        return `Line item ${index + 1} needs a product ID and description.`;
      }
      if (item.quantity <= 0 || item.expectedUnitPrice < 0) {
        return `Line item ${index + 1} must have a positive quantity and non-negative price.`;
      }
    }

    return null;
  };

  const save = async () => {
    const payload: PurchaseOrderPayload = {
      supplierId,
      branchId,
      buyerId,
      lineItems,
    };

    const validationError = validatePayload(payload);
    if (validationError) {
      setError(validationError);
      setSuccessMessage(null);
      return;
    }

    try {
      setError(null);
      const po: PurchaseOrderResponse = isEditMode
        ? await updatePurchaseOrder(purchaseOrderId!, payload)
        : await createPurchaseOrder(payload);

      setSuccessMessage(`Purchase order ${isEditMode ? 'updated' : 'created'} successfully with ID ${po.id}`);
      if (!isEditMode) {
        navigate(`/purchase-orders/${po.id}/edit`);
      }
    } catch (err) {
      setError('Unable to save purchase order. Please try again.');
      setSuccessMessage(null);
    }
  };

  return (
    <div>
      <h2>{isEditMode ? 'Edit Draft Purchase Order' : 'Create Draft Purchase Order'}</h2>
      <div>
        <Input label="Branch ID" value={branchId} onChange={setBranchId} />
        <Input label="Supplier ID" value={supplierId} onChange={setSupplierId} />
        <Input label="Buyer ID" value={buyerId} onChange={setBuyerId} />
      </div>

      <section>
        <h3>Line Items</h3>
        {lineItems.map((item, index) => (
          <PurchaseOrderLineItemEditor
            key={index}
            item={item}
            index={index}
            onChange={updateLineItem}
            onRemove={removeLineItem}
          />
        ))}
        <Button onClick={addLineItem}>Add line item</Button>
      </section>

      <div>
        <strong>Total expected amount: </strong>${totalAmount.toFixed(2)}
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      <Button onClick={save}>
        {loading ? 'Saving...' : isEditMode ? 'Update Draft PO' : 'Create Draft PO'}
      </Button>
    </div>
  );
}
