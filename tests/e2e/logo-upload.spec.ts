import { test, expect } from '@playwright/test';
import { 
  generateBuilderName, 
  createBuilderUI, 
  cleanUpBuilderUI, 
  getBuilderRowByName, 
  TestIds 
} from './helpers/builder.helper';

test.describe('Logo Upload', () => {
  let builderName: string;

  test.beforeEach(async ({ page }) => {
    builderName = generateBuilderName('LogoE2E');
    await createBuilderUI(page, builderName);
  });

  test.afterEach(async ({ page }) => {
    await cleanUpBuilderUI(page, builderName);
  });

  test('should upload, preview, and remove a logo successfully', async ({ page }) => {
    await page.goto('/admin/builders', { waitUntil: 'domcontentloaded' });
    
    const row = getBuilderRowByName(page, builderName);
    await row.getByTestId(TestIds.ROW_ACTIONS_TRIGGER).click();
    await page.getByTestId(TestIds.ACTION_EDIT).click();
    
    await page.waitForURL('**/admin/builders/*/edit');

    // 1. Upload Logo
    const fileInput = page.getByTestId(TestIds.IMAGE_UPLOAD_INPUT);
    const buffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64'
    );

    await fileInput.setInputFiles({
      name: 'logo.png',
      mimeType: 'image/png',
      buffer
    });

    // Verify preview appears
    await expect(page.getByAltText('Preview')).toBeVisible();
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Verify persistence (redirect back to list)
    await page.waitForURL('**/admin/builders');

    // 2. Remove Logo
    await row.getByTestId(TestIds.ROW_ACTIONS_TRIGGER).click();
    await page.getByTestId(TestIds.ACTION_EDIT).click();
    await page.waitForURL('**/admin/builders/*/edit');

    // Click remove
    await page.getByTestId(TestIds.IMAGE_UPLOAD_REMOVE).click();
    
    // Verify placeholder text is back
    await expect(page.getByText(/Click or drag image to upload/i)).toBeVisible();
    
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await page.waitForURL('**/admin/builders');
  });
});
