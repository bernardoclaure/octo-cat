import Button from '../ui/Button';
import Input from '../ui/Input';
import { PurchaseOrderLineItemPayload } from '../../api/purchaseOrderApi';

type Props = {
  item: PurchaseOrderLineItemPayload;
  index: number;
  onChange: (index: number, item: Partial<PurchaseOrderLineItemPayload>) => void;
  onRemove: (index: number) => void;
};

export default function PurchaseOrderLineItemEditor({ item, index, onChange, onRemove }: Props) {
  return (
    <div style={{ marginBottom: '1rem', border: '1px solid #ddd', padding: '1rem' }}>
      <Input label="Product ID" value={item.productId} onChange={(value) => onChange(index, { productId: value })} />
      <Input label="Description" value={item.description} onChange={(value) => onChange(index, { description: value })} />
      <Input label="Quantity" value={String(item.quantity)} onChange={(value) => onChange(index, { quantity: Number(value) })} />
      <Input label="Unit Price" value={String(item.expectedUnitPrice)} onChange={(value) => onChange(index, { expectedUnitPrice: Number(value) })} />
      <Button onClick={() => onRemove(index)}>Remove line item</Button>
    </div>
  );
}
