import { test, expect } from '@playwright/test';
import { 
  generateBuilderName, 
  createBuilderUI, 
  cleanUpBuilderUI, 
  getBuilderRowByName, 
  TestIds 
} from './helpers/builder.helper';

test.describe('Edit Builder', () => {
  let builderName: string;
  let updatedName: string;

  test.beforeEach(async ({ page }) => {
    builderName = generateBuilderName('EditE2E');
    updatedName = `${builderName} Updated`;
    
    // Create the test data specifically for this test
    await createBuilderUI(page, builderName);
  });

  test.afterEach(async ({ page }) => {
    // Cleanup the updated builder
    await cleanUpBuilderUI(page, updatedName);
  });

  test('should edit an existing builder successfully', async ({ page }) => {
    await page.goto('/admin/builders', { waitUntil: 'domcontentloaded' });
    
    const row = getBuilderRowByName(page, builderName);
    await expect(row).toBeVisible();

    // Open Actions Menu and click Edit
    await row.getByTestId(TestIds.ROW_ACTIONS_TRIGGER).click();
    await page.getByTestId(TestIds.ACTION_EDIT).click();
    
    // Wait for edit page
    await page.waitForURL('**/admin/builders/*/edit');

    // Update builder information
    await page.getByLabel(/Name/i).fill(updatedName);
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Verify persistence on list page
    await page.waitForURL('**/admin/builders');
    
    const updatedRow = getBuilderRowByName(page, updatedName);
    await expect(updatedRow).toBeVisible();
  });
});
