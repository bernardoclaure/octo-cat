import db from '../database';
import { FulfillmentEvent } from '../models/fulfillmentEvent';

const insertEvent = db.prepare(`
INSERT INTO fulfillment_events (
  id, purchaseOrderId, lineItemId, quantity, shipmentReference, fulfilledAt, createdAt, updatedAt
) VALUES (
  ?, ?, ?, ?, ?, ?, ?, ?
)
`);

const getByPurchaseOrderId = db.prepare(`SELECT * FROM fulfillment_events WHERE purchaseOrderId = ? ORDER BY fulfilledAt ASC, createdAt ASC`);
const getByLineItemId = db.prepare(`SELECT * FROM fulfillment_events WHERE lineItemId = ? ORDER BY fulfilledAt ASC, createdAt ASC`);

const normalize = (value: unknown) => (value === undefined ? null : value);

export const createFulfillmentEvent = (event: FulfillmentEvent) => {
  insertEvent.run(
    normalize(event.id),
    normalize(event.purchaseOrderId),
    normalize(event.lineItemId),
    normalize(event.quantity),
    normalize(event.shipmentReference),
    normalize(event.fulfilledAt),
    normalize(event.createdAt),
    normalize(event.updatedAt),
  );
  return event;
};

export const getFulfillmentEventsByPurchaseOrderId = (purchaseOrderId: string): FulfillmentEvent[] => {
  return getByPurchaseOrderId.all(purchaseOrderId) as FulfillmentEvent[];
};

export const getFulfillmentEventsByLineItemId = (lineItemId: string): FulfillmentEvent[] => {
  return getByLineItemId.all(lineItemId) as FulfillmentEvent[];
};
