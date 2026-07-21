import { test, expect } from '@playwright/test';
import { 
  generateBuilderName, 
  createBuilderUI, 
  cleanUpBuilderUI, 
  getBuilderRowByName, 
  TestIds 
} from './helpers/builder.helper';

test.describe('Search Builders', () => {
  let builder1: string;
  let builder2: string;

  test.beforeAll(async ({ browser }) => {
    // Generate distinct names
    builder1 = generateBuilderName('Search1_Alpha');
    builder2 = generateBuilderName('Search2_Beta');

    // Create the test data specifically for this suite
    // We use a new page context to run this independently before the tests
    const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
    const page = await context.newPage();
    await createBuilderUI(page, builder1);
    await createBuilderUI(page, builder2);
    await context.close();
  });

  test.afterAll(async ({ browser }) => {
    // Cleanup the created builders
    const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
    const page = await context.newPage();
    await cleanUpBuilderUI(page, builder1);
    await cleanUpBuilderUI(page, builder2);
    await context.close();
  });

  test('should search and filter builders correctly', async ({ page }) => {
    await page.goto('/admin/builders', { waitUntil: 'domcontentloaded' });
    
    // Type into search
    const searchInput = page.getByTestId(TestIds.SEARCH_INPUT);
    await searchInput.fill('Alpha');
    
    // Search is debounced, verify the URL parameter is updated
    await expect(page).toHaveURL(/search=Alpha/i);

    // Verify filtered results show builder1 and hide builder2
    const row1 = getBuilderRowByName(page, builder1);
    const row2 = getBuilderRowByName(page, builder2);
    
    await expect(row1).toBeVisible();
    await expect(row2).not.toBeVisible();

    // Clear search using the UI clear button
    await page.getByRole('button', { name: 'Clear search filter' }).click();
    
    // URL should be clear
    await expect(page).not.toHaveURL(/search=Alpha/i);

    // Both should now be visible
    await expect(row1).toBeVisible();
    await expect(row2).toBeVisible();
  });
});
