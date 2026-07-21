# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: search-builder.spec.ts >> Search Builders >> should search and filter builders correctly
- Location: tests\e2e\search-builder.spec.ts:37:7

# Error details

```
"beforeAll" hook timeout of 60000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
        - link "Admin" [ref=e13] [cursor=pointer]:
          - /url: /login
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
              - link "Add Builder" [ref=e149] [cursor=pointer]:
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
                  - img
                - combobox [ref=e159]
                - combobox "Filter by featured" [ref=e160]:
                  - img
                - combobox [ref=e161]
            - table [ref=e165]:
              - rowgroup [ref=e166]:
                - row "Builder Headquarters Est. Year Status Actions" [ref=e167]:
                  - columnheader "Builder" [ref=e168]
                  - columnheader "Headquarters" [ref=e169]
                  - columnheader "Est. Year" [ref=e170]
                  - columnheader "Status" [ref=e171]
                  - columnheader "Actions" [ref=e172]
              - rowgroup [ref=e173]:
                - row "SE Search2_Beta 1784637588311 966 search2-beta-1784637588311-966 - 2020 Active Open menu" [ref=e174]:
                  - cell "SE Search2_Beta 1784637588311 966 search2-beta-1784637588311-966" [ref=e175]:
                    - generic [ref=e176]:
                      - generic [ref=e178]: SE
                      - generic [ref=e179]:
                        - generic [ref=e180]: Search2_Beta 1784637588311 966
                        - generic [ref=e181]: search2-beta-1784637588311-966
                  - cell "-" [ref=e182]
                  - cell "2020" [ref=e183]
                  - cell "Active" [ref=e184]:
                    - generic [ref=e186]: Active
                  - cell "Open menu" [ref=e187]:
                    - button "Open menu" [ref=e188]:
                      - generic [ref=e189]: Open menu
                      - img
                - row "CR CreateE2E 1784637603423 79 createe2e-1784637603423-79 - 2020 Inactive Open menu" [ref=e190]:
                  - cell "CR CreateE2E 1784637603423 79 createe2e-1784637603423-79" [ref=e191]:
                    - generic [ref=e192]:
                      - generic [ref=e194]: CR
                      - generic [ref=e195]:
                        - generic [ref=e196]: CreateE2E 1784637603423 79
                        - generic [ref=e197]: createe2e-1784637603423-79
                  - cell "-" [ref=e198]
                  - cell "2020" [ref=e199]
                  - cell "Inactive" [ref=e200]:
                    - generic [ref=e202]: Inactive
                  - cell "Open menu" [ref=e203]:
                    - button "Open menu" [ref=e204]:
                      - generic [ref=e205]: Open menu
                      - img
                - row "ED EditE2E 1784637588862 866 Updated edite2e-1784637588862-866 - 2020 Active Open menu" [ref=e206]:
                  - cell "ED EditE2E 1784637588862 866 Updated edite2e-1784637588862-866" [ref=e207]:
                    - generic [ref=e208]:
                      - generic [ref=e210]: ED
                      - generic [ref=e211]:
                        - generic [ref=e212]: EditE2E 1784637588862 866 Updated
                        - generic [ref=e213]: edite2e-1784637588862-866
                  - cell "-" [ref=e214]
                  - cell "2020" [ref=e215]
                  - cell "Active" [ref=e216]:
                    - generic [ref=e218]: Active
                  - cell "Open menu" [ref=e219]:
                    - button "Open menu" [ref=e220]:
                      - generic [ref=e221]: Open menu
                      - img
                - row "CR CreateE2E 1784637602430 571 createe2e-1784637602430-571 - 2020 Inactive Open menu" [ref=e222]:
                  - cell "CR CreateE2E 1784637602430 571 createe2e-1784637602430-571" [ref=e223]:
                    - generic [ref=e224]:
                      - generic [ref=e226]: CR
                      - generic [ref=e227]:
                        - generic [ref=e228]: CreateE2E 1784637602430 571
                        - generic [ref=e229]: createe2e-1784637602430-571
                  - cell "-" [ref=e230]
                  - cell "2020" [ref=e231]
                  - cell "Inactive" [ref=e232]:
                    - generic [ref=e234]: Inactive
                  - cell "Open menu" [ref=e235]:
                    - button "Open menu" [ref=e236]:
                      - generic [ref=e237]: Open menu
                      - img
                - row "ST StatusToggleE2E 1784637588710 497 statustogglee2e-1784637588710-497 - 2020 Active Open menu" [ref=e238]:
                  - cell "ST StatusToggleE2E 1784637588710 497 statustogglee2e-1784637588710-497" [ref=e239]:
                    - generic [ref=e240]:
                      - generic [ref=e242]: ST
                      - generic [ref=e243]:
                        - generic [ref=e244]: StatusToggleE2E 1784637588710 497
                        - generic [ref=e245]: statustogglee2e-1784637588710-497
                  - cell "-" [ref=e246]
                  - cell "2020" [ref=e247]
                  - cell "Active" [ref=e248]:
                    - generic [ref=e250]: Active
                  - cell "Open menu" [ref=e251]:
                    - button "Open menu" [ref=e252]:
                      - generic [ref=e253]: Open menu
                      - img
                - row "SE Search1_Alpha 1784637588311 800 search1-alpha-1784637588311-800 - 2020 Active Open menu" [ref=e254]:
                  - cell "SE Search1_Alpha 1784637588311 800 search1-alpha-1784637588311-800" [ref=e255]:
                    - generic [ref=e256]:
                      - generic [ref=e258]: SE
                      - generic [ref=e259]:
                        - generic [ref=e260]: Search1_Alpha 1784637588311 800
                        - generic [ref=e261]: search1-alpha-1784637588311-800
                  - cell "-" [ref=e262]
                  - cell "2020" [ref=e263]
                  - cell "Active" [ref=e264]:
                    - generic [ref=e266]: Active
                  - cell "Open menu" [ref=e267]:
                    - button "Open menu" [ref=e268]:
                      - generic [ref=e269]: Open menu
                      - img
                - row "LO LogoE2E 1784637588799 994 logoe2e-1784637588799-994 - 2020 Active Open menu" [ref=e270]:
                  - cell "LO LogoE2E 1784637588799 994 logoe2e-1784637588799-994" [ref=e271]:
                    - generic [ref=e272]:
                      - generic [ref=e274]: LO
                      - generic [ref=e275]:
                        - generic [ref=e276]: LogoE2E 1784637588799 994
                        - generic [ref=e277]: logoe2e-1784637588799-994
                  - cell "-" [ref=e278]
                  - cell "2020" [ref=e279]
                  - cell "Active" [ref=e280]:
                    - generic [ref=e282]: Active
                  - cell "Open menu" [ref=e283]:
                    - button "Open menu" [ref=e284]:
                      - generic [ref=e285]: Open menu
                      - img
                - row "SE Search2_Beta 1784637055621 446 search2-beta-1784637055621-446 - 2020 Active Open menu" [ref=e286]:
                  - cell "SE Search2_Beta 1784637055621 446 search2-beta-1784637055621-446" [ref=e287]:
                    - generic [ref=e288]:
                      - generic [ref=e290]: SE
                      - generic [ref=e291]:
                        - generic [ref=e292]: Search2_Beta 1784637055621 446
                        - generic [ref=e293]: search2-beta-1784637055621-446
                  - cell "-" [ref=e294]
                  - cell "2020" [ref=e295]
                  - cell "Active" [ref=e296]:
                    - generic [ref=e298]: Active
                  - cell "Open menu" [ref=e299]:
                    - button "Open menu" [ref=e300]:
                      - generic [ref=e301]: Open menu
                      - img
                - row "SE Search1_Alpha 1784637055621 772 search1-alpha-1784637055621-772 - 2020 Active Open menu" [ref=e302]:
                  - cell "SE Search1_Alpha 1784637055621 772 search1-alpha-1784637055621-772" [ref=e303]:
                    - generic [ref=e304]:
                      - generic [ref=e306]: SE
                      - generic [ref=e307]:
                        - generic [ref=e308]: Search1_Alpha 1784637055621 772
                        - generic [ref=e309]: search1-alpha-1784637055621-772
                  - cell "-" [ref=e310]
                  - cell "2020" [ref=e311]
                  - cell "Active" [ref=e312]:
                    - generic [ref=e314]: Active
                  - cell "Open menu" [ref=e315]:
                    - button "Open menu" [ref=e316]:
                      - generic [ref=e317]: Open menu
                      - img
                - row "SE Search2_Beta 1784637036158 555 search2-beta-1784637036158-555 - 2020 Inactive Open menu" [ref=e318]:
                  - cell "SE Search2_Beta 1784637036158 555 search2-beta-1784637036158-555" [ref=e319]:
                    - generic [ref=e320]:
                      - generic [ref=e322]: SE
                      - generic [ref=e323]:
                        - generic [ref=e324]: Search2_Beta 1784637036158 555
                        - generic [ref=e325]: search2-beta-1784637036158-555
                  - cell "-" [ref=e326]
                  - cell "2020" [ref=e327]
                  - cell "Inactive" [ref=e328]:
                    - generic [ref=e330]: Inactive
                  - cell "Open menu" [ref=e331]:
                    - button "Open menu" [ref=e332]:
                      - generic [ref=e333]: Open menu
                      - img
            - generic [ref=e335]:
              - generic [ref=e336]:
                - text: Showing
                - generic [ref=e337]: "1"
                - text: to
                - generic [ref=e338]: "10"
                - text: of
                - generic [ref=e339]: "85"
                - text: items
              - generic [ref=e340]:
                - generic [ref=e341]:
                  - paragraph [ref=e342]: Rows per page
                  - combobox "Select rows per page" [ref=e343]:
                    - img
                  - combobox [ref=e344]
                - generic [ref=e345]: Page 1 of 9
                - generic [ref=e346]:
                  - button "Go to first page" [disabled]:
                    - img
                  - button "Go to previous page" [disabled]:
                    - img
                  - button "Go to next page" [ref=e347]:
                    - img
                  - button "Go to last page" [ref=e348]:
                    - img
    - button "Open contact menu" [ref=e350]:
      - img [ref=e351]
  - contentinfo [ref=e353]:
    - generic [ref=e354]:
      - generic [ref=e355]:
        - generic [ref=e356]:
          - link "Square AR Spaces Square AR Spaces" [ref=e357] [cursor=pointer]:
            - /url: /
            - generic [ref=e358]: Square AR Spaces
            - img "Square AR Spaces" [ref=e359]
          - paragraph [ref=e360]: Find your dream luxury home or investment property with Square AR Spaces.
        - generic [ref=e361]:
          - heading "Quick Links" [level=4] [ref=e362]
          - navigation "Footer Quick Links" [ref=e363]:
            - list [ref=e364]:
              - listitem [ref=e365]:
                - link "Home" [ref=e366] [cursor=pointer]:
                  - /url: /
              - listitem [ref=e367]:
                - link "Properties" [ref=e368] [cursor=pointer]:
                  - /url: /properties
              - listitem [ref=e369]:
                - link "About Us" [ref=e370] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e371]:
                - link "Contact" [ref=e372] [cursor=pointer]:
                  - /url: /contact
              - listitem [ref=e373]:
                - link "Privacy Policy" [ref=e374] [cursor=pointer]:
                  - /url: /privacy
        - generic [ref=e375]:
          - heading "Popular Locations" [level=4] [ref=e376]
          - navigation "Footer Locations" [ref=e377]:
            - list [ref=e378]:
              - listitem [ref=e379]:
                - link "Sector 150, Noida" [ref=e380] [cursor=pointer]:
                  - /url: /properties?location=sector-150
              - listitem [ref=e381]:
                - link "Sector 128, Noida" [ref=e382] [cursor=pointer]:
                  - /url: /properties?location=sector-128
              - listitem [ref=e383]:
                - link "Greater Noida West" [ref=e384] [cursor=pointer]:
                  - /url: /properties?location=greater-noida-west
              - listitem [ref=e385]:
                - link "Yamuna Expressway" [ref=e386] [cursor=pointer]:
                  - /url: /properties?location=yamuna-expressway
        - generic [ref=e387]:
          - heading "Connect With Us" [level=4] [ref=e388]
          - generic [ref=e389]:
            - generic [ref=e390]:
              - paragraph [ref=e391]: 123 Luxury Avenue, Sector 150
              - paragraph [ref=e392]: Noida, Uttar Pradesh 201310
              - paragraph [ref=e393]:
                - link "info@squarearspaces.com" [ref=e394] [cursor=pointer]:
                  - /url: mailto:info@squarearspaces.com
              - paragraph [ref=e395]:
                - link "+91 98765 43210" [ref=e396] [cursor=pointer]:
                  - /url: tel:+919876543210
            - navigation "Social Links" [ref=e397]:
              - list [ref=e398]:
                - listitem [ref=e399]:
                  - link "Facebook" [ref=e400] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e401]:
                  - link "Instagram" [ref=e402] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e403]:
                  - link "Twitter" [ref=e404] [cursor=pointer]:
                    - /url: "#"
                - listitem [ref=e405]:
                  - link "LinkedIn" [ref=e406] [cursor=pointer]:
                    - /url: "#"
      - generic [ref=e407]:
        - paragraph [ref=e408]: © 2026 Square AR Spaces. All rights reserved.
        - paragraph [ref=e409]: Designed for Noida & Greater Noida
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
> 14 |   test.beforeAll(async ({ browser }) => {
     |        ^ "beforeAll" hook timeout of 60000ms exceeded.
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
  28 |   test.afterAll(async ({ browser }) => {
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