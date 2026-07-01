import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { getDbPath } from './config';

const { DatabaseSync } = require('node:sqlite') as {
  DatabaseSync: new (path: string) => {
    exec(sql: string): void;
    prepare(sql: string): {
      run(params?: unknown): unknown;
      get(params?: unknown): unknown;
      all(params?: unknown): unknown;
    };
  };
};

type Statement = {
  run(params?: unknown): unknown;
  get(params?: unknown): unknown;
  all(params?: unknown): unknown;
};

type NativeDatabase = {
  exec(sql: string): void;
  prepare(sql: string): Statement;
};

class SqliteDatabase {
  private nativeDb: NativeDatabase;

  constructor(path: string) {
    this.nativeDb = new DatabaseSync(path);
  }

  exec(sql: string) {
    this.nativeDb.exec(sql);
  }

  prepare(sql: string): Statement {
    return this.nativeDb.prepare(sql);
  }

  transaction<TArgs extends unknown[], TResult>(fn: (...args: TArgs) => TResult) {
    return (...args: TArgs): TResult => {
      this.nativeDb.exec('BEGIN');
      try {
        const result = fn(...args);
        this.nativeDb.exec('COMMIT');
        return result;
      } catch (error) {
        this.nativeDb.exec('ROLLBACK');
        throw error;
      }
    };
  }
}

const dbPath = getDbPath();
if (dbPath !== ':memory:' && dbPath !== '') {
  mkdirSync(dirname(dbPath), { recursive: true });
}

const db = new SqliteDatabase(dbPath);

const ensureColumnExists = (tableName: string, columnName: string, definition: string) => {
  const existingColumns = db.prepare(`SELECT name FROM pragma_table_info('${tableName}')`).all() as Array<{ name: string }>;
  if (!existingColumns.some((column) => column.name === columnName)) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${definition}`);
  }
};

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
  fulfilledQuantity INTEGER DEFAULT 0,
  expectedUnitPrice REAL NOT NULL,
  expectedTotalPrice REAL NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY(purchaseOrderId) REFERENCES purchase_orders(id)
);

CREATE TABLE IF NOT EXISTS fulfillment_events (
  id TEXT PRIMARY KEY,
  purchaseOrderId TEXT NOT NULL,
  lineItemId TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  shipmentReference TEXT,
  fulfilledAt TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY(purchaseOrderId) REFERENCES purchase_orders(id),
  FOREIGN KEY(lineItemId) REFERENCES purchase_order_line_items(id)
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
ensureColumnExists('purchase_order_line_items', 'fulfilledQuantity', 'fulfilledQuantity INTEGER DEFAULT 0');

export default db;
