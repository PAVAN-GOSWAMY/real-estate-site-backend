# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: deactivate-builder.spec.ts >> Builder Status Toggle >> should successfully toggle a builder between Active and Inactive
- Location: tests\e2e\deactivate-builder.spec.ts:22:7

# Error details

```
Test timeout of 60000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: Navigation to "http://localhost:3000/admin/builders" is interrupted by another navigation to "http://localhost:3000/admin/builders"
Call log:
  - navigating to "http://localhost:3000/admin/builders", waiting until "domcontentloaded"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Home" [ref=e4]:
        - /url: /
        - generic [ref=e5]: Square AR Spaces
        - img "Square AR Spaces" [ref=e6]
      - navigation "Main Navigation" [ref=e7]:
        - link "Home" [ref=e8]:
          - /url: /
        - link "Properties" [ref=e9]:
          - /url: /properties
        - link "About" [ref=e10]:
          - /url: /about
        - link "Career" [ref=e11]:
          - /url: /career
        - link "Contact" [ref=e12]:
          - /url: /contact
        - link "Admin" [ref=e13]:
          - /url: /login
        - button "Enquire Now" [ref=e14]
  - main [ref=e15]:
    - generic [ref=e17]:
      - generic [ref=e20]:
        - link "Square AR Spaces Admin" [ref=e22]:
          - /url: /admin
          - generic [ref=e23]: Square AR Spaces Admin
        - navigation [ref=e25]:
          - generic [ref=e26]:
            - heading "Overview" [level=4] [ref=e27]
            - link "Dashboard" [ref=e29]:
              - /url: /admin
              - img [ref=e30]
              - text: Dashboard
          - generic [ref=e35]:
            - heading "Property Management" [level=4] [ref=e36]
            - generic [ref=e37]:
              - link "Properties" [ref=e38]:
                - /url: /admin/properties
                - img [ref=e39]
                - text: Properties
              - link "Property Types" [ref=e42]:
                - /url: /admin/properties/types
                - img [ref=e43]
                - text: Property Types
              - link "Amenities" [ref=e47]:
                - /url: /admin/properties/amenities
                - img [ref=e48]
                - text: Amenities
              - link "Locations" [ref=e50]:
                - /url: /admin/properties/locations
                - img [ref=e51]
                - text: Locations
              - link "Media Library" [ref=e54]:
                - /url: /admin/properties/media
                - img [ref=e55]
                - text: Media Library
          - generic [ref=e59]:
            - heading "Builder Management" [level=4] [ref=e60]
            - link "Builders" [ref=e62]:
              - /url: /admin/builders
              - img [ref=e63]
              - text: Builders
          - generic [ref=e67]:
            - heading "Lead Management" [level=4] [ref=e68]
            - generic [ref=e69]:
              - link "Contact Leads" [ref=e70]:
                - /url: /admin/leads
                - img [ref=e71]
                - text: Contact Leads
              - link "Property Inquiries" [ref=e76]:
                - /url: /admin/leads/inquiries
                - img [ref=e77]
                - text: Property Inquiries
              - link "Site Visits" [ref=e79]:
                - /url: /admin/leads/visits
                - img [ref=e80]
                - text: Site Visits
          - generic [ref=e83]:
            - heading "Careers" [level=4] [ref=e84]
            - generic [ref=e85]:
              - link "Jobs" [ref=e86]:
                - /url: /admin/careers
                - img [ref=e87]
                - text: Jobs
              - link "Applications" [ref=e90]:
                - /url: /admin/careers/applications
                - img [ref=e91]
                - text: Applications
          - generic [ref=e94]:
            - heading "System" [level=4] [ref=e95]
            - generic [ref=e96]:
              - link "Users" [ref=e97]:
                - /url: /admin/users
                - img [ref=e98]
                - text: Users
              - link "Settings" [ref=e103]:
                - /url: /admin/settings
                - img [ref=e104]
                - text: Settings
              - link "Profile" [ref=e107]:
                - /url: /admin/profile
                - img [ref=e108]
                - text: Profile
      - generic [ref=e111]:
        - generic [ref=e113]:
          - generic [ref=e115]:
            - img [ref=e116]
            - searchbox "Search admin..." [ref=e119]
          - button "Notifications" [ref=e120]:
            - img
            - generic [ref=e121]: Notifications
          - button "AD Toggle user menu" [ref=e122]:
            - generic [ref=e124]: AD
            - generic [ref=e125]: Toggle user menu
        - main [ref=e126]:
          - navigation "breadcrumb" [ref=e127]:
            - list [ref=e128]:
              - listitem [ref=e129]:
                - link "Dashboard" [ref=e130]:
                  - /url: /admin
              - listitem [ref=e131]:
                - img [ref=e132]
              - listitem [ref=e134]:
                - link "Builders" [disabled] [ref=e135]
          - generic [ref=e136]:
            - generic [ref=e137]:
              - generic [ref=e138]:
                - heading "Builders" [level=1] [ref=e139]
                - paragraph [ref=e140]: Manage your real estate developer profiles.
              - link "Add Builder" [ref=e142]:
                - /url: /admin/builders/new
                - img
                - text: Add Builder
            - generic [ref=e144]:
              - generic [ref=e145]:
                - img [ref=e146]
                - textbox "Search builders" [ref=e149]:
                  - /placeholder: Search builders...
              - generic [ref=e150]:
                - combobox "Filter by status" [ref=e151]:
                  - img
                - combobox [ref=e152]
                - combobox "Filter by featured" [ref=e153]:
                  - img
                - combobox [ref=e154]
            - table [ref=e158]:
              - rowgroup [ref=e159]:
                - row "Builder Headquarters Est. Year Status Actions" [ref=e160]:
                  - columnheader "Builder" [ref=e161]
                  - columnheader "Headquarters" [ref=e162]
                  - columnheader "Est. Year" [ref=e163]
                  - columnheader "Status" [ref=e164]
                  - columnheader "Actions" [ref=e165]
              - rowgroup [ref=e166]:
                - row "SE Search2_Beta 1784637588311 966 search2-beta-1784637588311-966 - 2020 Active Open menu" [ref=e167]:
                  - cell "SE Search2_Beta 1784637588311 966 search2-beta-1784637588311-966" [ref=e168]:
                    - generic [ref=e169]:
                      - generic [ref=e171]: SE
                      - generic [ref=e172]:
                        - generic [ref=e173]: Search2_Beta 1784637588311 966
                        - generic [ref=e174]: search2-beta-1784637588311-966
                  - cell "-" [ref=e175]
                  - cell "2020" [ref=e176]
                  - cell "Active" [ref=e177]:
                    - generic [ref=e179]: Active
                  - cell "Open menu" [ref=e180]:
                    - button "Open menu" [ref=e181]:
                      - generic [ref=e182]: Open menu
                      - img
                - row "CR CreateE2E 1784637603423 79 createe2e-1784637603423-79 - 2020 Inactive Open menu" [ref=e183]:
                  - cell "CR CreateE2E 1784637603423 79 createe2e-1784637603423-79" [ref=e184]:
                    - generic [ref=e185]:
                      - generic [ref=e187]: CR
                      - generic [ref=e188]:
                        - generic [ref=e189]: CreateE2E 1784637603423 79
                        - generic [ref=e190]: createe2e-1784637603423-79
                  - cell "-" [ref=e191]
                  - cell "2020" [ref=e192]
                  - cell "Inactive" [ref=e193]:
                    - generic [ref=e195]: Inactive
                  - cell "Open menu" [ref=e196]:
                    - button "Open menu" [ref=e197]:
                      - generic [ref=e198]: Open menu
                      - img
                - row "ED EditE2E 1784637588862 866 Updated edite2e-1784637588862-866 - 2020 Active Open menu" [ref=e199]:
                  - cell "ED EditE2E 1784637588862 866 Updated edite2e-1784637588862-866" [ref=e200]:
                    - generic [ref=e201]:
                      - generic [ref=e203]: ED
                      - generic [ref=e204]:
                        - generic [ref=e205]: EditE2E 1784637588862 866 Updated
                        - generic [ref=e206]: edite2e-1784637588862-866
                  - cell "-" [ref=e207]
                  - cell "2020" [ref=e208]
                  - cell "Active" [ref=e209]:
                    - generic [ref=e211]: Active
                  - cell "Open menu" [ref=e212]:
                    - button "Open menu" [ref=e213]:
                      - generic [ref=e214]: Open menu
                      - img
                - row "CR CreateE2E 1784637602430 571 createe2e-1784637602430-571 - 2020 Inactive Open menu" [ref=e215]:
                  - cell "CR CreateE2E 1784637602430 571 createe2e-1784637602430-571" [ref=e216]:
                    - generic [ref=e217]:
                      - generic [ref=e219]: CR
                      - generic [ref=e220]:
                        - generic [ref=e221]: CreateE2E 1784637602430 571
                        - generic [ref=e222]: createe2e-1784637602430-571
                  - cell "-" [ref=e223]
                  - cell "2020" [ref=e224]
                  - cell "Inactive" [ref=e225]:
                    - generic [ref=e227]: Inactive
                  - cell "Open menu" [ref=e228]:
                    - button "Open menu" [ref=e229]:
                      - generic [ref=e230]: Open menu
                      - img
                - row "ST StatusToggleE2E 1784637588710 497 statustogglee2e-1784637588710-497 - 2020 Active Open menu" [ref=e231]:
                  - cell "ST StatusToggleE2E 1784637588710 497 statustogglee2e-1784637588710-497" [ref=e232]:
                    - generic [ref=e233]:
                      - generic [ref=e235]: ST
                      - generic [ref=e236]:
                        - generic [ref=e237]: StatusToggleE2E 1784637588710 497
                        - generic [ref=e238]: statustogglee2e-1784637588710-497
                  - cell "-" [ref=e239]
                  - cell "2020" [ref=e240]
                  - cell "Active" [ref=e241]:
                    - generic [ref=e243]: Active
                  - cell "Open menu" [ref=e244]:
                    - button "Open menu" [ref=e245]:
                      - generic [ref=e246]: Open menu
                      - img
                - row "SE Search1_Alpha 1784637588311 800 search1-alpha-1784637588311-800 - 2020 Active Open menu" [ref=e247]:
                  - cell "SE Search1_Alpha 1784637588311 800 search1-alpha-1784637588311-800" [ref=e248]:
                    - generic [ref=e249]:
                      - generic [ref=e251]: SE
                      - generic [ref=e252]:
                        - generic [ref=e253]: Search1_Alpha 1784637588311 800
                        - generic [ref=e254]: search1-alpha-1784637588311-800
                  - cell "-" [ref=e255]
                  - cell "2020" [ref=e256]
                  - cell "Active" [ref=e257]:
                    - generic [ref=e259]: Active
                  - cell "Open menu" [ref=e260]:
                    - button "Open menu" [ref=e261]:
                      - generic [ref=e262]: Open menu
                      - img
                - row "LO LogoE2E 1784637588799 994 logoe2e-1784637588799-994 - 2020 Active Open menu" [ref=e263]:
                  - cell "LO LogoE2E 1784637588799 994 logoe2e-1784637588799-994" [ref=e264]:
                    - generic [ref=e265]:
                      - generic [ref=e267]: LO
                      - generic [ref=e268]:
                        - generic [ref=e269]: LogoE2E 1784637588799 994
                        - generic [ref=e270]: logoe2e-1784637588799-994
                  - cell "-" [ref=e271]
                  - cell "2020" [ref=e272]
                  - cell "Active" [ref=e273]:
                    - generic [ref=e275]: Active
                  - cell "Open menu" [ref=e276]:
                    - button "Open menu" [ref=e277]:
                      - generic [ref=e278]: Open menu
                      - img
                - row "SE Search2_Beta 1784637055621 446 search2-beta-1784637055621-446 - 2020 Active Open menu" [ref=e279]:
                  - cell "SE Search2_Beta 1784637055621 446 search2-beta-1784637055621-446" [ref=e280]:
                    - generic [ref=e281]:
                      - generic [ref=e283]: SE
                      - generic [ref=e284]:
                        - generic [ref=e285]: Search2_Beta 1784637055621 446
                        - generic [ref=e286]: search2-beta-1784637055621-446
                  - cell "-" [ref=e287]
                  - cell "2020" [ref=e288]
                  - cell "Active" [ref=e289]:
                    - generic [ref=e291]: Active
                  - cell "Open menu" [ref=e292]:
                    - button "Open menu" [ref=e293]:
                      - generic [ref=e294]: Open menu
                      - img
                - row "SE Search1_Alpha 1784637055621 772 search1-alpha-1784637055621-772 - 2020 Active Open menu" [ref=e295]:
                  - cell "SE Search1_Alpha 1784637055621 772 search1-alpha-1784637055621-772" [ref=e296]:
                    - generic [ref=e297]:
                      - generic [ref=e299]: SE
                      - generic [ref=e300]:
                        - generic [ref=e301]: Search1_Alpha 1784637055621 772
                        - generic [ref=e302]: search1-alpha-1784637055621-772
                  - cell "-" [ref=e303]
                  - cell "2020" [ref=e304]
                  - cell "Active" [ref=e305]:
                    - generic [ref=e307]: Active
                  - cell "Open menu" [ref=e308]:
                    - button "Open menu" [ref=e309]:
                      - generic [ref=e310]: Open menu
                      - img
                - row "SE Search2_Beta 1784637036158 555 search2-beta-1784637036158-555 - 2020 Inactive Open menu" [ref=e311]:
                  - cell "SE Search2_Beta 1784637036158 555 search2-beta-1784637036158-555" [ref=e312]:
                    - generic [ref=e313]:
                      - generic [ref=e315]: SE
                      - generic [ref=e316]:
                        - generic [ref=e317]: Search2_Beta 1784637036158 555
                        - generic [ref=e318]: search2-beta-1784637036158-555
                  - cell "-" [ref=e319]
                  - cell "2020" [ref=e320]
                  - cell "Inactive" [ref=e321]:
                    - generic [ref=e323]: Inactive
                  - cell "Open menu" [ref=e324]:
                    - button "Open menu" [ref=e325]:
                      - generic [ref=e326]: Open menu
                      - img
            - generic [ref=e328]:
              - generic [ref=e329]:
                - text: Showing
                - generic [ref=e330]: "1"
                - text: to
                - generic [ref=e331]: "10"
                - text: of
                - generic [ref=e332]: "85"
                - text: items
              - generic [ref=e333]:
                - generic [ref=e334]:
                  - paragraph [ref=e335]: Rows per page
                  - combobox "Select rows per page" [ref=e336]:
                    - img
                  - combobox [ref=e337]
                - generic [ref=e338]: Page 1 of 9
                - generic [ref=e339]:
                  - button "Go to first page" [disabled]:
                    - img
                  - button "Go to previous page" [disabled]:
                    - img
                  - button "Go to next page" [ref=e340]:
                    - img
                  - button "Go to last page" [ref=e341]:
                    - img
    - button "Open contact menu" [ref=e343]:
      - img [ref=e344]
  - contentinfo [ref=e346]:
    - generic [ref=e347]:
      - generic [ref=e348]:
        - generic [ref=e349]:
          - link "Square AR Spaces Square AR Spaces" [ref=e350]:
            - /url: /
            - generic [ref=e351]: Square AR Spaces
            - img "Square AR Spaces" [ref=e352]
          - paragraph [ref=e353]: Find your dream luxury home or investment property with Square AR Spaces.
        - generic [ref=e354]:
          - heading "Quick Links" [level=4] [ref=e355]
          - navigation "Footer Quick Links" [ref=e356]:
            - list [ref=e357]:
              - listitem [ref=e358]:
                - link "Home" [ref=e359]:
                  - /url: /
              - listitem [ref=e360]:
                - link "Properties" [ref=e361]:
                  - /url: /properties
              - listitem [ref=e362]:
                - link "About Us" [ref=e363]:
                  - /url: /about
              - listitem [ref=e364]:
                - link "Contact" [ref=e365]:
                  - /url: /contact
              - listitem [ref=e366]:
                - link "Privacy Policy" [ref=e367]:
                  - /url: /privacy
        - generic [ref=e368]:
          - heading "Popular Locations" [level=4] [ref=e369]
          - navigation "Footer Locations" [ref=e370]:
            - list [ref=e371]:
              - listitem [ref=e372]:
                - link "Sector 150, Noida" [ref=e373]:
                  - /url: /properties?location=sector-150
              - listitem [ref=e374]:
                - link "Sector 128, Noida" [ref=e375]:
                  - /url: /properties?location=sector-128
              - listitem [ref=e376]:
                - link "Greater Noida West" [ref=e377]:
                  - /url: /properties?location=greater-noida-west
              - listitem [ref=e378]:
                - link "Yamuna Expressway" [ref=e379]:
                  - /url: /properties?location=yamuna-expressway
        - generic [ref=e380]:
          - heading "Connect With Us" [level=4] [ref=e381]
          - generic [ref=e382]:
            - generic [ref=e383]:
              - paragraph [ref=e384]: 123 Luxury Avenue, Sector 150
              - paragraph [ref=e385]: Noida, Uttar Pradesh 201310
              - paragraph [ref=e386]:
                - link "info@squarearspaces.com" [ref=e387]:
                  - /url: mailto:info@squarearspaces.com
              - paragraph [ref=e388]:
                - link "+91 98765 43210" [ref=e389]:
                  - /url: tel:+919876543210
            - navigation "Social Links" [ref=e390]:
              - list [ref=e391]:
                - listitem [ref=e392]:
                  - link "Facebook" [ref=e393]:
                    - /url: "#"
                - listitem [ref=e394]:
                  - link "Instagram" [ref=e395]:
                    - /url: "#"
                - listitem [ref=e396]:
                  - link "Twitter" [ref=e397]:
                    - /url: "#"
                - listitem [ref=e398]:
                  - link "LinkedIn" [ref=e399]:
                    - /url: "#"
      - generic [ref=e400]:
        - paragraph [ref=e401]: © 2026 Square AR Spaces. All rights reserved.
        - paragraph [ref=e402]: Designed for Noida & Greater Noida
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
> 29 |   await page.goto('/admin/builders', { waitUntil: 'domcontentloaded' });
     |              ^ Error: page.goto: Navigation to "http://localhost:3000/admin/builders" is interrupted by another navigation to "http://localhost:3000/admin/builders"
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
  84 |   await expect(row.getByText('Inactive', { exact: true })).toBeVisible({ timeout: 10000 });
  85 | }
  86 | 
```