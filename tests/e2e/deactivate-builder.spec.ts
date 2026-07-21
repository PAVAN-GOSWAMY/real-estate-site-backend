import { test, expect } from '@playwright/test';
import { 
  generateBuilderName, 
  createBuilderUI, 
  cleanUpBuilderUI, 
  getBuilderRowByName, 
  TestIds 
} from './helpers/builder.helper';

test.describe('Builder Status Toggle', () => {
  let builderName: string;

  test.beforeEach(async ({ page }) => {
    builderName = generateBuilderName('StatusToggleE2E');
    await createBuilderUI(page, builderName);
  });

  test.afterEach(async ({ page }) => {
    await cleanUpBuilderUI(page, builderName);
  });

  test('should successfully toggle a builder between Active and Inactive', async ({ page }) => {
    await page.goto('/admin/builders', { waitUntil: 'domcontentloaded' });
    
    const row = getBuilderRowByName(page, builderName);
    await expect(row).toBeVisible();

    // 1. Verify initially Active
    await expect(row.getByText('Active', { exact: true })).toBeVisible();

    // 2. Deactivate the builder
    await row.getByTestId(TestIds.ROW_ACTIONS_TRIGGER).click();
    await expect(page.getByTestId(TestIds.ACTION_DEACTIVATE)).toBeVisible();
    await expect(page.getByTestId(TestIds.ACTION_ACTIVATE)).not.toBeVisible();
    
    await page.getByTestId(TestIds.ACTION_DEACTIVATE).click();
    await expect(page.getByText('Are you sure you want to deactivate this builder?')).toBeVisible();
    await page.getByRole('button', { name: 'Deactivate', exact: true }).click();

    // Verify success and inactive state
    await expect(page.getByText('Builder deactivated successfully.')).toBeVisible();
    await expect(row.getByText('Inactive', { exact: true })).toBeVisible();
    await expect(row.getByText('Active', { exact: true })).not.toBeVisible();

    // 3. Reactivate the builder
    await row.getByTestId(TestIds.ROW_ACTIONS_TRIGGER).click();
    await expect(page.getByTestId(TestIds.ACTION_ACTIVATE)).toBeVisible();
    await expect(page.getByTestId(TestIds.ACTION_DEACTIVATE)).not.toBeVisible();

    await page.getByTestId(TestIds.ACTION_ACTIVATE).click();
    await expect(page.getByText('Are you sure you want to activate this builder?')).toBeVisible();
    await page.getByRole('button', { name: 'Activate', exact: true }).click();

    // Verify success and active state
    await expect(page.getByText('Builder activated successfully.')).toBeVisible();
    await expect(row.getByText('Active', { exact: true })).toBeVisible();
    await expect(row.getByText('Inactive', { exact: true })).not.toBeVisible();
  });
});
