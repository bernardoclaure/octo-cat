import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Draft purchase order workflow', () => {
  test('creates a draft purchase order and displays total amount', async ({ page }) => {
    await page.goto(`${BASE_URL}/purchase-orders/new`);

    await page.fill('input[aria-label="Branch ID"]', 'branch-123');
    await page.fill('input[aria-label="Supplier ID"]', 'supplier-abc');
    await page.fill('input[aria-label="Buyer ID"]', 'buyer-xyz');

    await page.fill('input[aria-label="Product ID"]', 'product-1');
    await page.fill('input[aria-label="Description"]', 'One widget');
    await page.fill('input[aria-label="Quantity"]', '2');
    await page.fill('input[aria-label="Unit Price"]', '50');

    await page.click('button:has-text("Create Draft PO")');

    await expect(page.locator('text=Purchase order created successfully')).toBeVisible();
    await expect(page.locator('text=Total expected amount: $100.00')).toBeVisible();
  });
});
