import Database from 'better-sqlite3';
import { DB_PATH } from './config';

const db = new Database(DB_PATH);

// Initialize schema if it does not exist
const ddl = `
CREATE TABLE IF NOT EXISTS purchase_orders (
  id TEXT PRIMARY KEY,
  branchId TEXT NOT NULL,
  supplierId TEXT NOT NULL,
  buyerId TEXT NOT NULL,
  approverId TEXT,
  status TEXT NOT NULL,
  totalExpectedAmount REAL NOT NULL,
  submittedAt TEXT,
  approvedAt TEXT,
  fulfilledAt TEXT,
  cancelledAt TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS purchase_order_line_items (
  id TEXT PRIMARY KEY,
  purchaseOrderId TEXT NOT NULL,
  productId TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL,
  expectedUnitPrice REAL NOT NULL,
  expectedTotalPrice REAL NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY(purchaseOrderId) REFERENCES purchase_orders(id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  supplierId TEXT NOT NULL,
  purchaseOrderId TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  sentAt TEXT,
  errorMessage TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
`;

db.exec(ddl);

export default db;
