import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Missing E2E_ADMIN_EMAIL or E2E_ADMIN_PASSWORD');
  }

  await page.goto('/login');
  
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  
  await Promise.all([
    page.waitForURL('**/admin'),
    page.click('button[type="submit"]'),
  ]);

  // Wait for networkidle to ensure full stability
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/\/admin/);

  // Save authentication state
  await page.context().storageState({ path: authFile });
});
