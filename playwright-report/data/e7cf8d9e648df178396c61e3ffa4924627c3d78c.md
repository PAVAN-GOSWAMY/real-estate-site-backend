# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: logo-upload.spec.ts >> Logo Upload >> should upload, preview, and remove a logo successfully
- Location: tests\e2e\logo-upload.spec.ts:22:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('row').filter({ has: getByTestId('builder-name').filter({ hasText: 'LogoE2E 1784637588799 994' }) }).getByText('Inactive', { exact: true })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('row').filter({ has: getByTestId('builder-name').filter({ hasText: 'LogoE2E 1784637588799 994' }) }).getByText('Inactive', { exact: true })

```

```yaml
- banner:
  - link "Home":
    - /url: /
    - text: Square AR Spaces
    - img "Square AR Spaces"
  - navigation "Main Navigation":
    - link "Home":
      - /url: /
    - link "Properties":
      - /url: /properties
    - link "About":
      - /url: /about
    - link "Career":
      - /url: /career
    - link "Contact":
      - /url: /contact
    - link "Dashboard":
      - /url: /admin
    - button "Enquire Now"
- main:
  - link "Square AR Spaces Admin":
    - /url: /admin
  - navigation:
    - heading "Overview" [level=4]
    - link "Dashboard":
      - /url: /admin
    - heading "Property Management" [level=4]
    - link "Properties":
      - /url: /admin/properties
    - link "Property Types":
      - /url: /admin/properties/types
    - link "Amenities":
      - /url: /admin/properties/amenities
    - link "Locations":
      - /url: /admin/properties/locations
    - link "Media Library":
      - /url: /admin/properties/media
    - heading "Builder Management" [level=4]
    - link "Builders":
      - /url: /admin/builders
    - heading "Lead Management" [level=4]
    - link "Contact Leads":
      - /url: /admin/leads
    - link "Property Inquiries":
      - /url: /admin/leads/inquiries
    - link "Site Visits":
      - /url: /admin/leads/visits
    - heading "Careers" [level=4]
    - link "Jobs":
      - /url: /admin/careers
    - link "Applications":
      - /url: /admin/careers/applications
    - heading "System" [level=4]
    - link "Users":
      - /url: /admin/users
    - link "Settings":
      - /url: /admin/settings
    - link "Profile":
      - /url: /admin/profile
  - searchbox "Search admin..."
  - button "Notifications"
  - button "AD Toggle user menu"
  - main:
    - navigation "breadcrumb":
      - list:
        - listitem:
          - link "Dashboard":
            - /url: /admin
        - listitem:
          - link "Builders" [disabled]
    - heading "Builders" [level=1]
    - paragraph: Manage your real estate developer profiles.
    - link "Add Builder":
      - /url: /admin/builders/new
    - textbox "Search builders":
      - /placeholder: Search builders...
    - combobox "Filter by status": All Status
    - combobox "Filter by featured": All
    - table:
      - rowgroup:
        - row "Builder Headquarters Est. Year Status Actions":
          - columnheader "Builder"
          - columnheader "Headquarters"
          - columnheader "Est. Year"
          - columnheader "Status"
          - columnheader "Actions"
      - rowgroup:
        - row "SE Search2_Beta 1784637588311 966 search2-beta-1784637588311-966 - 2020 Active Open menu":
          - cell "SE Search2_Beta 1784637588311 966 search2-beta-1784637588311-966"
          - cell "-"
          - cell "2020"
          - cell "Active"
          - cell "Open menu":
            - button "Open menu"
        - row "CR CreateE2E 1784637603423 79 createe2e-1784637603423-79 - 2020 Inactive Open menu":
          - cell "CR CreateE2E 1784637603423 79 createe2e-1784637603423-79"
          - cell "-"
          - cell "2020"
          - cell "Inactive"
          - cell "Open menu":
            - button "Open menu"
        - row "ED EditE2E 1784637588862 866 Updated edite2e-1784637588862-866 - 2020 Active Open menu":
          - cell "ED EditE2E 1784637588862 866 Updated edite2e-1784637588862-866"
          - cell "-"
          - cell "2020"
          - cell "Active"
          - cell "Open menu":
            - button "Open menu"
        - row "CR CreateE2E 1784637602430 571 createe2e-1784637602430-571 - 2020 Inactive Open menu":
          - cell "CR CreateE2E 1784637602430 571 createe2e-1784637602430-571"
          - cell "-"
          - cell "2020"
          - cell "Inactive"
          - cell "Open menu":
            - button "Open menu"
        - row "ST StatusToggleE2E 1784637588710 497 statustogglee2e-1784637588710-497 - 2020 Active Open menu":
          - cell "ST StatusToggleE2E 1784637588710 497 statustogglee2e-1784637588710-497"
          - cell "-"
          - cell "2020"
          - cell "Active"
          - cell "Open menu":
            - button "Open menu"
        - row "SE Search1_Alpha 1784637588311 800 search1-alpha-1784637588311-800 - 2020 Active Open menu":
          - cell "SE Search1_Alpha 1784637588311 800 search1-alpha-1784637588311-800"
          - cell "-"
          - cell "2020"
          - cell "Active"
          - cell "Open menu":
            - button "Open menu"
        - row "LogoE2E 1784637588799 994 LogoE2E 1784637588799 994 logoe2e-1784637588799-994 - 2020 Active Open menu":
          - cell "LogoE2E 1784637588799 994 LogoE2E 1784637588799 994 logoe2e-1784637588799-994":
            - img "LogoE2E 1784637588799 994"
            - text: LogoE2E 1784637588799 994 logoe2e-1784637588799-994
          - cell "-"
          - cell "2020"
          - cell "Active"
          - cell "Open menu":
            - button "Open menu" [disabled]
        - row "SE Search2_Beta 1784637055621 446 search2-beta-1784637055621-446 - 2020 Active Open menu":
          - cell "SE Search2_Beta 1784637055621 446 search2-beta-1784637055621-446"
          - cell "-"
          - cell "2020"
          - cell "Active"
          - cell "Open menu":
            - button "Open menu"
        - row "SE Search1_Alpha 1784637055621 772 search1-alpha-1784637055621-772 - 2020 Active Open menu":
          - cell "SE Search1_Alpha 1784637055621 772 search1-alpha-1784637055621-772"
          - cell "-"
          - cell "2020"
          - cell "Active"
          - cell "Open menu":
            - button "Open menu"
        - row "SE Search2_Beta 1784637036158 555 search2-beta-1784637036158-555 - 2020 Inactive Open menu":
          - cell "SE Search2_Beta 1784637036158 555 search2-beta-1784637036158-555"
          - cell "-"
          - cell "2020"
          - cell "Inactive"
          - cell "Open menu":
            - button "Open menu"
    - text: Showing 1 to 10 of 85 items
    - paragraph: Rows per page
    - combobox "Select rows per page": "10"
    - text: Page 1 of 9
    - button "Go to first page" [disabled]
    - button "Go to previous page" [disabled]
    - button "Go to next page"
    - button "Go to last page"
  - button "Open contact menu"
- contentinfo:
  - link "Square AR Spaces Square AR Spaces":
    - /url: /
    - text: Square AR Spaces
    - img "Square AR Spaces"
  - paragraph: Find your dream luxury home or investment property with Square AR Spaces.
  - heading "Quick Links" [level=4]
  - navigation "Footer Quick Links":
    - list:
      - listitem:
        - link "Home":
          - /url: /
      - listitem:
        - link "Properties":
          - /url: /properties
      - listitem:
        - link "About Us":
          - /url: /about
      - listitem:
        - link "Contact":
          - /url: /contact
      - listitem:
        - link "Privacy Policy":
          - /url: /privacy
  - heading "Popular Locations" [level=4]
  - navigation "Footer Locations":
    - list:
      - listitem:
        - link "Sector 150, Noida":
          - /url: /properties?location=sector-150
      - listitem:
        - link "Sector 128, Noida":
          - /url: /properties?location=sector-128
      - listitem:
        - link "Greater Noida West":
          - /url: /properties?location=greater-noida-west
      - listitem:
        - link "Yamuna Expressway":
          - /url: /properties?location=yamuna-expressway
  - heading "Connect With Us" [level=4]
  - paragraph: 123 Luxury Avenue, Sector 150
  - paragraph: Noida, Uttar Pradesh 201310
  - paragraph:
    - link "info@squarearspaces.com":
      - /url: mailto:info@squarearspaces.com
  - paragraph:
    - link "+91 98765 43210":
      - /url: tel:+919876543210
  - navigation "Social Links":
    - list:
      - listitem:
        - link "Facebook":
          - /url: "#"
      - listitem:
        - link "Instagram":
          - /url: "#"
      - listitem:
        - link "Twitter":
          - /url: "#"
      - listitem:
        - link "LinkedIn":
          - /url: "#"
  - paragraph: © 2026 Square AR Spaces. All rights reserved.
  - paragraph: Designed for Noida & Greater Noida
- alert
- dialog:
  - heading "Deactivate Builder" [level=2]
  - paragraph: Are you sure you want to deactivate this builder?
  - button "Cancel" [disabled]
  - button "Loading..." [disabled]
```

```
Error: page.waitForURL: Test timeout of 60000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/admin/builders/*/edit" until "load"
============================================================
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { 
  3  |   generateBuilderName, 
  4  |   createBuilderUI, 
  5  |   cleanUpBuilderUI, 
  6  |   getBuilderRowByName, 
  7  |   TestIds 
  8  | } from './helpers/builder.helper';
  9  | 
  10 | test.describe('Logo Upload', () => {
  11 |   let builderName: string;
  12 | 
  13 |   test.beforeEach(async ({ page }) => {
  14 |     builderName = generateBuilderName('LogoE2E');
  15 |     await createBuilderUI(page, builderName);
  16 |   });
  17 | 
  18 |   test.afterEach(async ({ page }) => {
  19 |     await cleanUpBuilderUI(page, builderName);
  20 |   });
  21 | 
  22 |   test('should upload, preview, and remove a logo successfully', async ({ page }) => {
  23 |     await page.goto('/admin/builders', { waitUntil: 'domcontentloaded' });
  24 |     
  25 |     const row = getBuilderRowByName(page, builderName);
  26 |     await row.getByTestId(TestIds.ROW_ACTIONS_TRIGGER).click();
  27 |     await page.getByTestId(TestIds.ACTION_EDIT).click();
  28 |     
  29 |     await page.waitForURL('**/admin/builders/*/edit');
  30 | 
  31 |     // 1. Upload Logo
  32 |     const fileInput = page.getByTestId(TestIds.IMAGE_UPLOAD_INPUT);
  33 |     const buffer = Buffer.from(
  34 |       'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  35 |       'base64'
  36 |     );
  37 | 
  38 |     await fileInput.setInputFiles({
  39 |       name: 'logo.png',
  40 |       mimeType: 'image/png',
  41 |       buffer
  42 |     });
  43 | 
  44 |     // Verify preview appears
  45 |     await expect(page.getByAltText('Preview')).toBeVisible();
  46 |     await page.getByRole('button', { name: 'Save Changes' }).click();
  47 | 
  48 |     // Verify persistence (redirect back to list)
  49 |     await page.waitForURL('**/admin/builders');
  50 | 
  51 |     // 2. Remove Logo
  52 |     await row.getByTestId(TestIds.ROW_ACTIONS_TRIGGER).click();
  53 |     await page.getByTestId(TestIds.ACTION_EDIT).click();
> 54 |     await page.waitForURL('**/admin/builders/*/edit');
     |                ^ Error: page.waitForURL: Test timeout of 60000ms exceeded.
  55 | 
  56 |     // Click remove
  57 |     await page.getByTestId(TestIds.IMAGE_UPLOAD_REMOVE).click();
  58 |     
  59 |     // Verify placeholder text is back
  60 |     await expect(page.getByText(/Click or drag image to upload/i)).toBeVisible();
  61 |     
  62 |     await page.getByRole('button', { name: 'Save Changes' }).click();
  63 |     await page.waitForURL('**/admin/builders');
  64 |   });
  65 | });
  66 | 
```