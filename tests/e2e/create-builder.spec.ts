import { test, expect } from '@playwright/test';
import { generateBuilderName, cleanUpBuilderUI } from './helpers/builder.helper';

test.describe('Create Builder', () => {
  let builderName: string;

  test.beforeEach(async ({ page }) => {
    // Navigate to Builders list
    await page.goto('/admin/builders', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/admin\/builders/);
    builderName = generateBuilderName('CreateE2E');
  });

  test.afterEach(async ({ page }) => {
    // Cleanup the created builder
    await cleanUpBuilderUI(page, builderName);
  });

  test('should create a new builder successfully', async ({ page }) => {
    // Click Add Builder
    await page.getByRole('link', { name: 'Add Builder' }).click();
    await page.waitForURL('**/admin/builders/new');

    // Fill form
    await page.getByLabel(/Name/i).fill(builderName);
    await page.getByLabel(/Established Year/i).fill('2020');
    
    // Submit
    await page.getByRole('button', { name: 'Create Builder' }).click();

    // Verify redirect to list and success
    await page.waitForURL('**/admin/builders');
    
    // Using getByRole('row') with getByText for stability
    const newRow = page.getByRole('row', { name: builderName });
    await expect(newRow).toBeVisible();
    await expect(newRow.getByText('Active')).toBeVisible();
  });
});
