import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import {
  cancelPurchaseOrder,
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
  cancelPurchaseOrder: (purchaseOrderId: string) => Promise<PurchaseOrderResponse>;
  loading: boolean;
}

const PurchaseOrderContext = createContext<PurchaseOrderContextValue | undefined>(undefined);

export const PurchaseOrderProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const create = useCallback(async (payload: PurchaseOrderPayload) => {
    setLoading(true);
    try {
      return await createPurchaseOrder(payload);
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (purchaseOrderId: string, payload: PurchaseOrderPayload) => {
    setLoading(true);
    try {
      return await updatePurchaseOrder(purchaseOrderId, payload);
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(async (purchaseOrderId: string) => {
    setLoading(true);
    try {
      return await getPurchaseOrder(purchaseOrderId);
    } finally {
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(async (purchaseOrderId: string) => {
    setLoading(true);
    try {
      return await cancelPurchaseOrder(purchaseOrderId);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PurchaseOrderContext.Provider value={{ createPurchaseOrder: create, updatePurchaseOrder: update, getPurchaseOrder: get, cancelPurchaseOrder: cancel, loading }}>
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
