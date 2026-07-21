# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: search-builder.spec.ts >> Search Builders >> should search and filter builders correctly
- Location: tests\e2e\search-builder.spec.ts:37:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /search=Alpha/i
Received string:  "http://localhost:3000/admin/builders"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    11 × unexpected value "http://localhost:3000/admin/builders"

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
      - text: Alpha
    - combobox "Filter by status": All Status
    - combobox "Filter by featured": All
    - text: "Active filters: Search: \"Alpha\""
    - button "Clear search filter"
    - button "Clear all"
    - text: Updating results...
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
            - button "Open menu"
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
```

```
"afterAll" hook timeout of 60000ms exceeded.
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
  10 | test.describe('Search Builders', () => {
  11 |   let builder1: string;
  12 |   let builder2: string;
  13 | 
  14 |   test.beforeAll(async ({ browser }) => {
  15 |     // Generate distinct names
  16 |     builder1 = generateBuilderName('Search1_Alpha');
  17 |     builder2 = generateBuilderName('Search2_Beta');
  18 | 
  19 |     // Create the test data specifically for this suite
  20 |     // We use a new page context to run this independently before the tests
  21 |     const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
  22 |     const page = await context.newPage();
  23 |     await createBuilderUI(page, builder1);
  24 |     await createBuilderUI(page, builder2);
  25 |     await context.close();
  26 |   });
  27 | 
> 28 |   test.afterAll(async ({ browser }) => {
     |        ^ "afterAll" hook timeout of 60000ms exceeded.
  29 |     // Cleanup the created builders
  30 |     const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
  31 |     const page = await context.newPage();
  32 |     await cleanUpBuilderUI(page, builder1);
  33 |     await cleanUpBuilderUI(page, builder2);
  34 |     await context.close();
  35 |   });
  36 | 
  37 |   test('should search and filter builders correctly', async ({ page }) => {
  38 |     await page.goto('/admin/builders', { waitUntil: 'domcontentloaded' });
  39 |     
  40 |     // Type into search
  41 |     const searchInput = page.getByTestId(TestIds.SEARCH_INPUT);
  42 |     await searchInput.fill('Alpha');
  43 |     
  44 |     // Search is debounced, verify the URL parameter is updated
  45 |     await expect(page).toHaveURL(/search=Alpha/i);
  46 | 
  47 |     // Verify filtered results show builder1 and hide builder2
  48 |     const row1 = getBuilderRowByName(page, builder1);
  49 |     const row2 = getBuilderRowByName(page, builder2);
  50 |     
  51 |     await expect(row1).toBeVisible();
  52 |     await expect(row2).not.toBeVisible();
  53 | 
  54 |     // Clear search using the UI clear button
  55 |     await page.getByRole('button', { name: 'Clear search filter' }).click();
  56 |     
  57 |     // URL should be clear
  58 |     await expect(page).not.toHaveURL(/search=Alpha/i);
  59 | 
  60 |     // Both should now be visible
  61 |     await expect(row1).toBeVisible();
  62 |     await expect(row2).toBeVisible();
  63 |   });
  64 | });
  65 | 
```