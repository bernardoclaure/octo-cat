import { createContext, useContext, useState, ReactNode } from 'react';
import {
  createPurchaseOrder,
  getPurchaseOrder,
  updatePurchaseOrder,
  PurchaseOrderPayload,
  PurchaseOrderResponse,
} from '../api/purchaseOrderApi';

interface PurchaseOrderContextValue {
  createPurchaseOrder: (payload: PurchaseOrderPayload) => Promise<PurchaseOrderResponse>;
  updatePurchaseOrder: (purchaseOrderId: string, payload: PurchaseOrderPayload) => Promise<PurchaseOrderResponse>;
  getPurchaseOrder: (purchaseOrderId: string) => Promise<PurchaseOrderResponse>;
  loading: boolean;
}

const PurchaseOrderContext = createContext<PurchaseOrderContextValue | undefined>(undefined);

export const PurchaseOrderProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const create = async (payload: PurchaseOrderPayload) => {
    setLoading(true);
    try {
      return await createPurchaseOrder(payload);
    } finally {
      setLoading(false);
    }
  };

  const update = async (purchaseOrderId: string, payload: PurchaseOrderPayload) => {
    setLoading(true);
    try {
      return await updatePurchaseOrder(purchaseOrderId, payload);
    } finally {
      setLoading(false);
    }
  };

  const get = async (purchaseOrderId: string) => {
    setLoading(true);
    try {
      return await getPurchaseOrder(purchaseOrderId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PurchaseOrderContext.Provider value={{ createPurchaseOrder: create, updatePurchaseOrder: update, getPurchaseOrder: get, loading }}>
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
