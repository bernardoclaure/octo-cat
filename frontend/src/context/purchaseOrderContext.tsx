import { createContext, useContext, useState, ReactNode } from 'react';
import { createPurchaseOrder, PurchaseOrderPayload } from '../api/purchaseOrderApi';

interface PurchaseOrderContextValue {
  createPurchaseOrder: (payload: PurchaseOrderPayload) => Promise<void>;
  loading: boolean;
}

const PurchaseOrderContext = createContext<PurchaseOrderContextValue | undefined>(undefined);

export const PurchaseOrderProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const create = async (payload: PurchaseOrderPayload) => {
    setLoading(true);
    await createPurchaseOrder(payload);
    setLoading(false);
  };

  return (
    <PurchaseOrderContext.Provider value={{ createPurchaseOrder: create, loading }}>
      {children}
    </PurchaseOrderContext.Provider>
  );
};

export const usePurchaseOrder = () => {
  const context = useContext(PurchaseOrderContext);
  if (!context) {
    throw new Error('usePurchaseOrder must be used within a PurchaseOrderProvider');
  }
  return context;
};
