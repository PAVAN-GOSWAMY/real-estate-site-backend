import { Page, expect } from '@playwright/test';

// Common test IDs for stable selectors
export const TestIds = {
  SEARCH_INPUT: 'builder-search-input',
  BUILDER_ROW: (id: string) => `builder-row-${id}`,
  BUILDER_ROW_NAME: 'builder-name',
  ROW_ACTIONS_TRIGGER: 'row-actions-trigger',
  ACTION_EDIT: 'action-edit',
  ACTION_DEACTIVATE: 'action-deactivate',
  ACTION_ACTIVATE: 'action-activate',
  IMAGE_UPLOAD_INPUT: 'image-upload-input',
  IMAGE_UPLOAD_REMOVE: 'image-upload-remove',
};

/**
 * Helper to generate a unique builder name for tests.
 */
export function generateBuilderName(prefix = 'E2E Builder') {
  return `${prefix} ${Date.now()} ${Math.floor(Math.random() * 1000)}`;
}

/**
 * Creates a builder via the UI.
 * Starts from any page, navigates to builders, creates, and waits for list page.
 */
export async function createBuilderUI(page: Page, name: string) {
  // Navigate to Builders list
  await page.goto('/admin/builders', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/admin\/builders/);

  // Click Add Builder
  await page.getByRole('link', { name: 'Add Builder' }).click();
  await page.waitForURL('**/admin/builders/new');

  // Fill form
  await page.getByLabel(/Name/i).fill(name);
  await page.getByLabel(/Established Year/i).fill('2020');
  
  // Submit
  await page.getByRole('button', { name: 'Create Builder' }).click();

  // Wait for redirect to list
  await page.waitForURL('**/admin/builders');
}

/**
 * Finds a builder in the table by name and returns its row locator.
 */
export function getBuilderRowByName(page: Page, name: string) {
  // We use filter on rows to find the exact one containing the name in the builder-name cell
  return page.getByRole('row').filter({
    has: page.getByTestId(TestIds.BUILDER_ROW_NAME).filter({ hasText: name })
  });
}

/**
 * Deactivates a builder via the UI to clean up test data.
 */
export async function cleanUpBuilderUI(page: Page, name: string) {
  await page.goto('/admin/builders', { waitUntil: 'domcontentloaded' });
  
  const row = getBuilderRowByName(page, name);
  
  // If the row doesn't exist, it might have been deleted or we are on the wrong page
  if (await row.count() === 0) return;

  // Check if already inactive
  const inactiveBadge = row.getByText('Inactive', { exact: true });
  if (await inactiveBadge.isVisible()) {
    return;
  }

  // Open Actions Menu
  await row.getByTestId(TestIds.ROW_ACTIONS_TRIGGER).click();
  
  // Click Deactivate in dropdown menu
  await page.getByTestId(TestIds.ACTION_DEACTIVATE).click();
  
  // Click Confirm inside the custom ConfirmDialog
  await page.getByRole('button', { name: 'Deactivate', exact: true }).click();
  
  // Wait for it to become inactive
  await expect(row.getByText('Inactive', { exact: true })).toBeVisible({ timeout: 10000 });
}
