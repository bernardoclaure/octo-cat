import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import { PurchaseOrderProvider } from './context/purchaseOrderContext';
import PurchaseOrderForm from './pages/purchase-orders/PurchaseOrderForm';

function App() {
  return (
    <PurchaseOrderProvider>
      <BrowserRouter>
        <div>
          <header>
            <h1>OctoCAT Purchase Order</h1>
            <nav>
              <Link to="/">Home</Link>
              {' | '}
              <Link to="/purchase-orders/new">Create Draft PO</Link>
            </nav>
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/purchase-orders/new" element={<PurchaseOrderForm />} />
            <Route path="/purchase-orders/:purchaseOrderId/edit" element={<PurchaseOrderForm />} />
          </Routes>
        </div>
      </BrowserRouter>
    </PurchaseOrderProvider>
  );
}

export default App;
