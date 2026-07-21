# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: edit-builder.spec.ts >> Edit Builder >> should edit an existing builder successfully
- Location: tests\e2e\edit-builder.spec.ts:27:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator:  getByRole('row').filter({ has: getByTestId('builder-name').filter({ hasText: 'EditE2E 1784637588862 866 Updated' }) })
Expected: visible
Received: undefined
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('row').filter({ has: getByTestId('builder-name').filter({ hasText: 'EditE2E 1784637588862 866 Updated' }) })
    - waiting for" http://localhost:3000/admin/builders" navigation to finish...

```

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('row').filter({ has: getByTestId('builder-name').filter({ hasText: 'EditE2E 1784637588862 866 Updated' }) }).getByText('Inactive', { exact: true })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('row').filter({ has: getByTestId('builder-name').filter({ hasText: 'EditE2E 1784637588862 866 Updated' }) }).getByText('Inactive', { exact: true })

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
            - button "Open menu" [disabled]
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
- dialog:
  - heading "Deactivate Builder" [level=2]
  - paragraph: Are you sure you want to deactivate this builder?
  - button "Cancel" [disabled]
  - button "Loading..." [disabled]
```

# Test source

```ts
  1  | import { Page, expect } from '@playwright/test';
  2  | 
  3  | // Common test IDs for stable selectors
  4  | export const TestIds = {
  5  |   SEARCH_INPUT: 'builder-search-input',
  6  |   BUILDER_ROW: (id: string) => `builder-row-${id}`,
  7  |   BUILDER_ROW_NAME: 'builder-name',
  8  |   ROW_ACTIONS_TRIGGER: 'row-actions-trigger',
  9  |   ACTION_EDIT: 'action-edit',
  10 |   ACTION_DEACTIVATE: 'action-deactivate',
  11 |   ACTION_ACTIVATE: 'action-activate',
  12 |   IMAGE_UPLOAD_INPUT: 'image-upload-input',
  13 |   IMAGE_UPLOAD_REMOVE: 'image-upload-remove',
  14 | };
  15 | 
  16 | /**
  17 |  * Helper to generate a unique builder name for tests.
  18 |  */
  19 | export function generateBuilderName(prefix = 'E2E Builder') {
  20 |   return `${prefix} ${Date.now()} ${Math.floor(Math.random() * 1000)}`;
  21 | }
  22 | 
  23 | /**
  24 |  * Creates a builder via the UI.
  25 |  * Starts from any page, navigates to builders, creates, and waits for list page.
  26 |  */
  27 | export async function createBuilderUI(page: Page, name: string) {
  28 |   // Navigate to Builders list
  29 |   await page.goto('/admin/builders', { waitUntil: 'domcontentloaded' });
  30 |   await expect(page).toHaveURL(/\/admin\/builders/);
  31 | 
  32 |   // Click Add Builder
  33 |   await page.getByRole('link', { name: 'Add Builder' }).click();
  34 |   await page.waitForURL('**/admin/builders/new');
  35 | 
  36 |   // Fill form
  37 |   await page.getByLabel(/Name/i).fill(name);
  38 |   await page.getByLabel(/Established Year/i).fill('2020');
  39 |   
  40 |   // Submit
  41 |   await page.getByRole('button', { name: 'Create Builder' }).click();
  42 | 
  43 |   // Wait for redirect to list
  44 |   await page.waitForURL('**/admin/builders');
  45 | }
  46 | 
  47 | /**
  48 |  * Finds a builder in the table by name and returns its row locator.
  49 |  */
  50 | export function getBuilderRowByName(page: Page, name: string) {
  51 |   // We use filter on rows to find the exact one containing the name in the builder-name cell
  52 |   return page.getByRole('row').filter({
  53 |     has: page.getByTestId(TestIds.BUILDER_ROW_NAME).filter({ hasText: name })
  54 |   });
  55 | }
  56 | 
  57 | /**
  58 |  * Deactivates a builder via the UI to clean up test data.
  59 |  */
  60 | export async function cleanUpBuilderUI(page: Page, name: string) {
  61 |   await page.goto('/admin/builders', { waitUntil: 'domcontentloaded' });
  62 |   
  63 |   const row = getBuilderRowByName(page, name);
  64 |   
  65 |   // If the row doesn't exist, it might have been deleted or we are on the wrong page
  66 |   if (await row.count() === 0) return;
  67 | 
  68 |   // Check if already inactive
  69 |   const inactiveBadge = row.getByText('Inactive', { exact: true });
  70 |   if (await inactiveBadge.isVisible()) {
  71 |     return;
  72 |   }
  73 | 
  74 |   // Open Actions Menu
  75 |   await row.getByTestId(TestIds.ROW_ACTIONS_TRIGGER).click();
  76 |   
  77 |   // Click Deactivate in dropdown menu
  78 |   await page.getByTestId(TestIds.ACTION_DEACTIVATE).click();
  79 |   
  80 |   // Click Confirm inside the custom ConfirmDialog
  81 |   await page.getByRole('button', { name: 'Deactivate', exact: true }).click();
  82 |   
  83 |   // Wait for it to become inactive
> 84 |   await expect(row.getByText('Inactive', { exact: true })).toBeVisible({ timeout: 10000 });
     |                                                            ^ Error: expect(locator).toBeVisible() failed
  85 | }
  86 | 
```