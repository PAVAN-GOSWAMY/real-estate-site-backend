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
Error: page.waitForURL: NS_BINDING_ABORTED
=========================== logs ===========================
waiting for navigation to "**/admin/builders/new" until "load"
============================================================
```

```
Error: page.goto: NS_BINDING_ABORTED
Call log:
  - navigating to "http://localhost:3000/admin/builders", waiting until "domcontentloaded"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Home" [ref=e4] [cursor=pointer]:
        - /url: /
        - generic [ref=e5]: Square AR Spaces
        - img "Square AR Spaces" [ref=e6]
      - navigation "Main Navigation" [ref=e7]:
        - link "Home" [ref=e8] [cursor=pointer]:
          - /url: /
        - link "Properties" [ref=e9] [cursor=pointer]:
          - /url: /properties
        - link "About" [ref=e10] [cursor=pointer]:
          - /url: /about
        - link "Career" [ref=e11] [cursor=pointer]:
          - /url: /career
        - link "Contact" [ref=e12] [cursor=pointer]:
          - /url: /contact
        - link "Dashboard" [ref=e13] [cursor=pointer]:
          - /url: /admin
        - button "Enquire Now" [ref=e14]
  - main [ref=e15]:
    - generic [ref=e17]:
      - generic [ref=e20]:
        - link "Square AR Spaces Admin" [ref=e22] [cursor=pointer]:
          - /url: /admin
          - generic [ref=e23]: Square AR Spaces Admin
        - navigation [ref=e25]:
          - generic [ref=e26]:
            - heading "Overview" [level=4] [ref=e27]
            - link "Dashboard" [ref=e29] [cursor=pointer]:
              - /url: /admin
              - img [ref=e30]
              - text: Dashboard
          - generic [ref=e35]:
            - heading "Property Management" [level=4] [ref=e36]
            - generic [ref=e37]:
              - link "Properties" [ref=e38] [cursor=pointer]:
                - /url: /admin/properties
                - img [ref=e39]
                - text: Properties
              - link "Property Types" [ref=e42] [cursor=pointer]:
                - /url: /admin/properties/types
                - img [ref=e43]
                - text: Property Types
              - link "Amenities" [ref=e49] [cursor=pointer]:
                - /url: /admin/properties/amenities
                - img [ref=e50]
                - text: Amenities
              - link "Locations" [ref=e52] [cursor=pointer]:
                - /url: /admin/properties/locations
                - img [ref=e53]
                - text: Locations
              - link "Media Library" [ref=e56] [cursor=pointer]:
                - /url: /admin/properties/media
                - img [ref=e57]
                - text: Media Library
          - generic [ref=e61]:
            - heading "Builder Management" [level=4] [ref=e62]
            - link "Builders" [ref=e64] [cursor=pointer]:
              - /url: /admin/builders
              - img [ref=e65]
              - text: Builders
          - generic [ref=e71]:
            - heading "Lead Management" [level=4] [ref=e72]
            - generic [ref=e73]:
              - link "Contact Leads" [ref=e74] [cursor=pointer]:
                - /url: /admin/leads
                - img [ref=e75]
                - text: Contact Leads
              - link "Property Inquiries" [ref=e80] [cursor=pointer]:
                - /url: /admin/leads/inquiries
                - img [ref=e81]
                - text: Property Inquiries
              - link "Site Visits" [ref=e83] [cursor=pointer]:
                - /url: /admin/leads/visits
                - img [ref=e84]
                - text: Site Visits
          - generic [ref=e87]:
            - heading "Careers" [level=4] [ref=e88]
            - generic [ref=e89]:
              - link "Jobs" [ref=e90] [cursor=pointer]:
                - /url: /admin/careers
                - img [ref=e91]
                - text: Jobs
              - link "Applications" [ref=e94] [cursor=pointer]:
                - /url: /admin/careers/applications
                - img [ref=e95]
                - text: Applications
          - generic [ref=e101]:
            - heading "System" [level=4] [ref=e102]
            - generic [ref=e103]:
              - link "Users" [ref=e104] [cursor=pointer]:
                - /url: /admin/users
                - img [ref=e105]
                - text: Users
              - link "Settings" [ref=e110] [cursor=pointer]:
                - /url: /admin/settings
                - img [ref=e111]
                - text: Settings
              - link "Profile" [ref=e114] [cursor=pointer]:
                - /url: /admin/profile
                - img [ref=e115]
                - text: Profile
      - generic [ref=e118]:
        - generic [ref=e120]:
          - generic [ref=e122]:
            - img [ref=e123]
            - searchbox "Search admin..." [ref=e126]
          - button "Notifications" [ref=e127]:
            - img
            - generic [ref=e128]: Notifications
          - button "AD Toggle user menu" [ref=e129]:
            - generic [ref=e131]: AD
            - generic [ref=e132]: Toggle user menu
        - main [ref=e133]:
          - navigation "breadcrumb" [ref=e134]:
            - list [ref=e135]:
              - listitem [ref=e136]:
                - link "Dashboard" [ref=e137] [cursor=pointer]:
                  - /url: /admin
              - listitem [ref=e138]:
                - img [ref=e139]
              - listitem [ref=e141]:
                - link "Builders" [disabled] [ref=e142]
          - generic [ref=e143]:
            - generic [ref=e144]:
              - generic [ref=e145]:
                - heading "Builders" [level=1] [ref=e146]
                - paragraph [ref=e147]: Manage your real estate developer profiles.
              - link "Add Builder" [active] [ref=e149] [cursor=pointer]:
                - /url: /admin/builders/new
                - img
                - text: Add Builder
            - generic [ref=e151]:
              - generic [ref=e152]:
                - img [ref=e153]
                - textbox "Search builders" [ref=e156]:
                  - /placeholder: Search builders...
              - generic [ref=e157]:
                - combobox "Filter by status" [ref=e158]:
                  - generic: All Status
                  - img
                - combobox "Filter by featured" [ref=e159]:
                  - generic: All
                  - img
            - table [ref=e163]:
              - rowgroup [ref=e164]:
                - row "Builder Headquarters Est. Year Status Actions" [ref=e165]:
                  - columnheader "Builder" [ref=e166]
                  - columnheader "Headquarters" [ref=e167]
                  - columnheader "Est. Year" [ref=e168]
                  - columnheader "Status" [ref=e169]
                  - columnheader "Actions" [ref=e170]
              - rowgroup [ref=e171]:
                - row "SE Search2_Beta 1784637588311 966 search2-beta-1784637588311-966 - 2020 Active Open menu" [ref=e172]:
                  - cell "SE Search2_Beta 1784637588311 966 search2-beta-1784637588311-966" [ref=e173]:
                    - generic [ref=e174]:
                      - generic [ref=e176]: SE
                      - generic [ref=e177]:
                        - generic [ref=e178]: Search2_Beta 1784637588311 966
                        - generic [ref=e179]: search2-beta-1784637588311-966
                  - cell "-" [ref=e180]
                  - cell "2020" [ref=e181]
                  - cell "Active" [ref=e182]:
                    - generic [ref=e184]: Active
                  - cell "Open menu" [ref=e185]:
                    - button "Open menu" [ref=e186]:
                      - generic [ref=e187]: Open menu
                      - img
                - row "CR CreateE2E 1784637603423 79 createe2e-1784637603423-79 - 2020 Inactive Open menu" [ref=e188]:
                  - cell "CR CreateE2E 1784637603423 79 createe2e-1784637603423-79" [ref=e189]:
                    - generic [ref=e190]:
                      - generic [ref=e192]: CR
                      - generic [ref=e193]:
                        - generic [ref=e194]: CreateE2E 1784637603423 79
                        - generic [ref=e195]: createe2e-1784637603423-79
                  - cell "-" [ref=e196]
                  - cell "2020" [ref=e197]
                  - cell "Inactive" [ref=e198]:
                    - generic [ref=e200]: Inactive
                  - cell "Open menu" [ref=e201]:
                    - button "Open menu" [ref=e202]:
                      - generic [ref=e203]: Open menu
                      - img
                - row "ED EditE2E 1784637588862 866 Updated edite2e-1784637588862-866 - 2020 Active Open menu" [ref=e204]:
                  - cell "ED EditE2E 1784637588862 866 Updated edite2e-1784637588862-866" [ref=e205]:
                    - generic [ref=e206]:
                      - generic [ref=e208]: ED
                      - generic [ref=e209]:
                        - generic [ref=e210]: EditE2E 1784637588862 866 Updated
                        - generic [ref=e211]: edite2e-1784637588862-866
                  - cell "-" [ref=e212]
                  - cell "2020" [ref=e213]
                  - cell "Active" [ref=e214]:
                    - generic [ref=e216]: Active
                  - cell "Open menu" [ref=e217]:
                    - button "Open menu" [ref=e218]:
                      - generic [ref=e219]: Open menu
                      - img
                - row "CR CreateE2E 1784637602430 571 createe2e-1784637602430-571 - 2020 Inactive Open menu" [ref=e220]:
                  - cell "CR CreateE2E 1784637602430 571 createe2e-1784637602430-571" [ref=e221]:
                    - generic [ref=e222]:
                      - generic [ref=e224]: CR
                      - generic [ref=e225]:
                        - generic [ref=e226]: CreateE2E 1784637602430 571
                        - generic [ref=e227]: createe2e-1784637602430-571
                  - cell "-" [ref=e228]
                  - cell "2020" [ref=e229]
                  - cell "Inactive" [ref=e230]:
                    - generic [ref=e232]: Inactive
                  - cell "Open menu" [ref=e233]:
                    - button "Open menu" [ref=e234]:
                      - generic [ref=e235]: Open menu
                      - img
                - row "ST StatusToggleE2E 1784637588710 497 statustogglee2e-1784637588710-497 - 2020 Active Open menu" [ref=e236]:
                  - cell "ST StatusToggleE2E 1784637588710 497 statustogglee2e-1784637588710-497" [ref=e237]:
                    - generic [ref=e238]:
                      - generic [ref=e240]: ST
                      - generic [ref=e241]:
                        - generic [ref=e242]: StatusToggleE2E 1784637588710 497
                        - generic [ref=e243]: statustogglee2e-1784637588710-497
                  - cell "-" [ref=e244]
                  - cell "2020" [ref=e245]
                  - cell "Active" [ref=e246]:
                    - generic [ref=e248]: Active
                  - cell "Open menu" [ref=e249]:
                    - button "Open menu" [ref=e250]:
                      - generic [ref=e251]: Open menu
                      - img
                - row "SE Search1_Alpha 1784637588311 800 search1-alpha-1784637588311-800 - 2020 Active Open menu" [ref=e252]:
                  - cell "SE Search1_Alpha 1784637588311 800 search1-alpha-1784637588311-800" [ref=e253]:
                    - generic [ref=e254]:
                      - generic [ref=e256]: SE
                      - generic [ref=e257]:
                        - generic [ref=e258]: Search1_Alpha 1784637588311 800
                        - generic [ref=e259]: search1-alpha-1784637588311-800
                  - cell "-" [ref=e260]
                  - cell "2020" [ref=e261]
                  - cell "Active" [ref=e262]:
                    - generic [ref=e264]: Active
                  - cell "Open menu" [ref=e265]:
                    - button "Open menu" [ref=e266]:
                      - generic [ref=e267]: Open menu
                      - img
                - row "LogoE2E 1784637588799 994 LogoE2E 1784637588799 994 logoe2e-1784637588799-994 - 2020 Active Open menu" [ref=e268]:
                  - cell "LogoE2E 1784637588799 994 LogoE2E 1784637588799 994 logoe2e-1784637588799-994" [ref=e269]:
                    - generic [ref=e270]:
                      - img "LogoE2E 1784637588799 994" [ref=e272]
                      - generic [ref=e273]:
                        - generic [ref=e274]: LogoE2E 1784637588799 994
                        - generic [ref=e275]: logoe2e-1784637588799-994
                  - cell "-" [ref=e276]
                  - cell "2020" [ref=e277]
                  - cell "Active" [ref=e278]:
                    - generic [ref=e280]: Active
                  - cell "Open menu" [ref=e281]:
                    - button "Open menu" [ref=e282]:
                      - generic [ref=e283]: Open menu
                      - img
                - row "SE Search2_Beta 1784637055621 446 search2-beta-1784637055621-446 - 2020 Active Open menu" [ref=e284]:
                  - cell "SE Search2_Beta 1784637055621 446 search2-beta-1784637055621-446" [ref=e285]:
                    - generic [ref=e286]:
                      - generic [ref=e288]: SE
                      - generic [ref=e289]:
                        - generic [ref=e290]: Search2_Beta 1784637055621 446
                        - generic [ref=e291]: search2-beta-1784637055621-446
                  - cell "-" [ref=e292]
                  - cell "2020" [ref=e293]
                  - cell "Active" [ref=e294]:
                    - generic [ref=e296]: Active
                  - cell "Open menu" [ref=e297]:
                    - button "Open menu" [ref=e298]:
                      - generic [ref=e299]: Open menu
                      - img
                - row "SE Search1_Alpha 1784637055621 772 search1-alpha-1784637055621-772 - 2020 Active Open menu" [ref=e300]:
                  - cell "SE Search1_Alpha 1784637055621 772 search1-alpha-1784637055621-772" [ref=e301]:
                    - generic [ref=e302]:
                      - generic [ref=e304]: SE
                      - generic [ref=e305]:
                        - generic [ref=e306]: Search1_Alpha 1784637055621 772
                        - generic [ref=e307]: search1-alpha-1784637055621-772
                  - cell "-" [ref=e308]
                  - cell "2020" [ref=e309]
                  - cell "Active" [ref=e310]:
                    - generic [ref=e312]: Active
                  - cell "Open menu" [ref=e313]:
                    - button "Open menu" [ref=e314]:
                      - generic [ref=e315]: Open menu
                      - img
                - row "SE Search2_Beta 1784637036158 555 search2-beta-1784637036158-555 - 2020 Inactive Open menu" [ref=e316]:
                  - cell "SE Search2_Beta 1784637036158 555 search2-beta-1784637036158-555" [ref=e317]:
                    - generic [ref=e318]:
                      - generic [ref=e320]: SE
                      - generic [ref=e321]:
                        - generic [ref=e322]: Search2_Beta 1784637036158 555
                        - generic [ref=e323]: search2-beta-1784637036158-555
                  - cell "-" [ref=e324]
                  - cell "2020" [ref=e325]
                  - cell "Inactive" [ref=e326]:
                    - generic [ref=e328]: Inactive
                  - cell "Open menu" [ref=e329]:
                    - button "Open menu" [ref=e330]:
                      - generic [ref=e331]: Open menu
                      - img
            - generic [ref=e333]:
              - generic [ref=e334]:
                - text: Showing
                - generic [ref=e335]: "1"
                - text: to
                - generic [ref=e336]: "10"
                - text: of
                - generic [ref=e337]: "85"
                - text: items
              - generic [ref=e338]:
                - generic [ref=e339]:
                  - paragraph [ref=e340]: Rows per page
                  - combobox "Select rows per page" [ref=e341]:
                    - generic: "10"
                    - img
                - generic [ref=e342]: Page 1 of 9
                - generic [ref=e343]:
                  - button "Go to first page" [disabled]:
                    - img
                  - button "Go to previous page" [disabled]:
                    - img
                  - button "Go to next page" [ref=e344]:
                    - img
                  - button "Go to last page" [ref=e345]:
                    - img
    - button "Open contact menu" [ref=e347]:
      - img [ref=e348]
  - contentinfo [ref=e350]:
    - generic [ref=e351]:
      - generic [ref=e352]:
        - generic [ref=e353]:
          - link "Square AR Spaces Square AR Spaces" [ref=e354] [cursor=pointer]:
            - /url: /
            - generic [ref=e355]: Square AR Spaces
            - img "Square AR Spaces" [ref=e356]
          - paragraph [ref=e357]: Find your dream luxury home or investment property with Square AR Spaces.
        - generic [ref=e358]:
          - heading "Quick Links" [level=4] [ref=e359]
          - navigation "Footer Quick Links" [ref=e360]:
            - list [ref=e361]:
              - listitem [ref=e362]:
                - link "Home" [ref=e363] [cursor=pointer]:
                  - /url: /
              - listitem [ref=e364]:
                - link "Properties" [ref=e365] [cursor=pointer]:
                  - /url: /properties
              - listitem [ref=e366]:
                - link "About Us" [ref=e367] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e368]:
                - link "Contact" [ref=e369] [cursor=pointer]:
                  - /url: /contact
              - listitem [ref=e370]:
                - link "Privacy Policy" [ref=e371] [cursor=pointer]:
                  - /url: /privacy
        - generic [ref=e372]:
          - heading "Popular Locations" [level=4] [ref=e373]
          - navigation "Footer Locations" [ref=e374]:
            - list [ref=e375]:
              - listitem [ref=e376]:
                - link "Sector 150, Noida" [ref=e377] [cursor=pointer]:
                  - /url: /properties?location=sector-150
              - listitem [ref=e378]:
                - link "Sector 128, Noida" [ref=e379] [cursor=pointer]:
                  - /url: /properties?location=sector-128
              - listitem [ref=e380]:
                - link "Greater Noida West" [ref=e381] [cursor=pointer]:
                  - /url: /properties?location=greater-noida-west
              - listitem [ref=e382]:
                - link "Yamuna Expressway" [ref=e383] [cursor=pointer]:
                  - /url: /properties?location=yamuna-expressway
        - generic [ref=e384]:
          - heading "Connect With Us" [level=4] [ref=e385]
          - generic [ref=e386]:
            - generic [ref=e387]:
              - paragraph [ref=e388]: 123 Luxury Avenue, Sector 150
              - paragraph [ref=e389]: Noida, Uttar Pradesh 201310
              - paragraph [ref=e390]:
                - link "info@squarearspaces.com" [ref=e391] [cursor=pointer]:
                  - /url: mailto:info@squarearspaces.com
              - paragraph [ref=e392]:
                - link "+91 98765 43210" [ref=e393] [cursor=pointer]:
                  - /url: tel:+919876543210
            - navigation "Social Links" [ref=e394]:
              - list [ref=e395]:
                - listitem [ref=e396]:
                  - link "Facebook" [ref=e397] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e398]:
                  - link "Instagram" [ref=e399] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e400]:
                  - link "Twitter" [ref=e401] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e402]:
                  - link "LinkedIn" [ref=e403] [cursor=pointer]:
                    - /url: "#"
      - generic [ref=e404]:
        - paragraph [ref=e405]: © 2026 Square AR Spaces. All rights reserved.
        - paragraph [ref=e406]: Designed for Noida & Greater Noida
  - generic [ref=e411] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e412]:
      - img [ref=e413]
    - generic [ref=e417]:
      - button "Open issues overlay" [ref=e418]:
        - generic [ref=e419]:
          - generic [ref=e420]: "0"
          - generic [ref=e421]: "1"
        - generic [ref=e422]: Issue
      - button "Collapse issues badge" [ref=e423]:
        - img [ref=e424]
  - alert [ref=e426]
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
> 61 |   await page.goto('/admin/builders', { waitUntil: 'domcontentloaded' });
     |              ^ Error: page.goto: NS_BINDING_ABORTED
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