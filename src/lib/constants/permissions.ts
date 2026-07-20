import { Modules } from "./modules";

// Helper to generate CRUD permissions for a given module
const generateCrudPermissions = (moduleName: string) => ({
  VIEW: `${moduleName}.view`,
  CREATE: `${moduleName}.create`,
  UPDATE: `${moduleName}.update`,
  DELETE: `${moduleName}.delete`,
});

export const Permissions = {

  LOCATIONS: {
    ...generateCrudPermissions(Modules.LOCATIONS),
  },
  BUILDERS: {
    ...generateCrudPermissions(Modules.BUILDERS),
  },
  PROPERTY_CATEGORIES: {
    ...generateCrudPermissions('property_categories'),
  },
  PROPERTY_CONFIGURATIONS: {
    ...generateCrudPermissions('property_configurations'),
  },
  AMENITIES: {
    ...generateCrudPermissions(Modules.AMENITIES),
  },
  PROJECTS: {
    ...generateCrudPermissions(Modules.PROJECTS),
    PUBLISH: `${Modules.PROJECTS}.publish`,
  },
  PROJECT_TOWERS: {
    ...generateCrudPermissions(Modules.PROJECT_TOWERS),
  },
  PROJECT_AMENITIES: {
    ...generateCrudPermissions(Modules.PROJECT_AMENITIES),
  },
  PROJECT_MEDIA: {
    ...generateCrudPermissions(Modules.PROJECT_MEDIA),
    REORDER: `${Modules.PROJECT_MEDIA}.reorder`,
    UPLOAD: `${Modules.PROJECT_MEDIA}.upload`,
  },
  PROPERTY_FEATURES: {
    ...generateCrudPermissions('property_features'),
  },
  PROPERTIES: {
    ...generateCrudPermissions(Modules.PROPERTIES),
    PUBLISH: `${Modules.PROPERTIES}.publish`,
    UNPUBLISH: `${Modules.PROPERTIES}.unpublish`,
    APPROVE: `${Modules.PROPERTIES}.approve`,
    ARCHIVE: `${Modules.PROPERTIES}.archive`,
    SCHEDULE: `${Modules.PROPERTIES}.schedule`,
    PRICING: {
      VIEW: `${Modules.PROPERTIES}.pricing.view`,
      UPDATE: `${Modules.PROPERTIES}.pricing.update`,
      APPROVE: `${Modules.PROPERTIES}.pricing.approve`,
      REVISE: `${Modules.PROPERTIES}.pricing.revise`,
    },
    INVENTORY: {
      VIEW: `${Modules.PROPERTIES}.inventory.view`,
      RESERVE: `${Modules.PROPERTIES}.inventory.reserve`,
      BLOCK: `${Modules.PROPERTIES}.inventory.block`,
      BOOK: `${Modules.PROPERTIES}.inventory.book`,
      RELEASE: `${Modules.PROPERTIES}.inventory.release`,
      SELL: `${Modules.PROPERTIES}.inventory.sell`,
      UPDATE: `${Modules.PROPERTIES}.inventory.update`,
    },
    FEATURE: {
      VIEW: `${Modules.PROPERTIES}.feature.view`,
      MANAGE: `${Modules.PROPERTIES}.feature.manage`,
    },
    RECOMMEND: {
      MANAGE: `${Modules.PROPERTIES}.recommend.manage`,
    },
    COLLECTIONS: {
      MANAGE: `${Modules.PROPERTIES}.collections.manage`,
    },
    UPDATE_PRICE: `${Modules.PROPERTIES}.price.update`,
    UPDATE_INVENTORY: `${Modules.PROPERTIES}.inventory.update`,
    IMPORT: `${Modules.PROPERTIES}.import`,
    EXPORT: `${Modules.PROPERTIES}.export`,
    ROLLBACK: `${Modules.PROPERTIES}.rollback`,
    TEMPLATE: `${Modules.PROPERTIES}.template`,
  },
  COMPARISON: {
    VIEW: `comparison.view`,
    CREATE: `comparison.create`,
    SHARE: `comparison.share`,
  },
  FAVORITES: {
    VIEW: `favorites.view`,
    MANAGE: `favorites.manage`,
  },
  SHORTLISTS: {
    VIEW: `shortlists.view`,
    MANAGE: `shortlists.manage`,
    SHARE: `shortlists.share`,
  },
  CRM_SHORTLISTS: {
    MANAGE: `crm.shortlists.manage`,
  },
  LEADS: {
    ...generateCrudPermissions(Modules.LEADS),
    MERGE: `leads.merge`,
    EXPORT: `leads.export`,
    ASSIGN: `${Modules.LEADS}.assign`,
  },
  LEAD_PREFERENCES: {
    VIEW: `lead_preferences.view`,
    CREATE: `lead_preferences.create`,
    UPDATE: `lead_preferences.update`,
    DELETE: `lead_preferences.delete`,
  },
  LEAD_ASSIGNMENTS: {
    VIEW: `lead_assignments.view`,
    CREATE: `lead_assignments.create`,
    UPDATE: `lead_assignments.update`,
    BULK: `lead_assignments.bulk`,
    AUTO: `lead_assignments.auto`,
    OVERRIDE: `lead_assignments.override`,
  },
  FOLLOW_UPS: {
    VIEW: `follow_ups.view`,
    CREATE: `follow_ups.create`,
    UPDATE: `follow_ups.update`,
    DELETE: `follow_ups.delete`,
    COMPLETE: `follow_ups.complete`,
    ESCALATE: `follow_ups.escalate`,
  },
  LEAD_STATUS: {
    VIEW: `lead_status.view`,
    UPDATE: `lead_status.update`,
    BULK: `lead_status.bulk`,
    REOPEN: `lead_status.reopen`,
    PIPELINE: `lead_status.pipeline`,
  },
  LEAD_NOTES: {
    VIEW: `lead_notes.view`,
    CREATE: `lead_notes.create`,
    UPDATE: `lead_notes.update`,
    DELETE: `lead_notes.delete`,
    ARCHIVE: `lead_notes.archive`,
    PIN: `lead_notes.pin`,
  },
  LEAD_TIMELINE: {
    VIEW: `lead_timeline.view`,
    SEARCH: `lead_timeline.search`,
    STATISTICS: `lead_timeline.statistics`,
  },
  SITE_VISITS: {
    VIEW: `site_visits.view`,
    CREATE: `site_visits.create`,
    UPDATE: `site_visits.update`,
    DELETE: `site_visits.delete`,
    CONFIRM: `site_visits.confirm`,
    CHECK_IN: `site_visits.checkIn`,
    CHECK_OUT: `site_visits.checkOut`,
    FEEDBACK: `site_visits.feedback`,
  },
  CRM_DASHBOARD: {
    VIEW: `crm_dashboard.view`,
    ADMIN: `crm_dashboard.admin`,
    MANAGER: `crm_dashboard.manager`,
    EXECUTIVE: `crm_dashboard.executive`,
    SALES: `crm_dashboard.sales`,
  },
  PROPERTY_IMAGES: {
    ...generateCrudPermissions(Modules.PROPERTY_IMAGES),
    REORDER: `${Modules.PROPERTY_IMAGES}.reorder`,
    UPLOAD: `${Modules.PROPERTY_IMAGES}.upload`,
  },
  PROPERTY_FLOOR_PLANS: {
    ...generateCrudPermissions(Modules.PROPERTY_FLOOR_PLANS),
    REORDER: `${Modules.PROPERTY_FLOOR_PLANS}.reorder`,
    UPLOAD: `${Modules.PROPERTY_FLOOR_PLANS}.upload`,
  },
  PROPERTY_BROCHURES: {
    ...generateCrudPermissions(Modules.PROPERTY_BROCHURES),
    REORDER: `${Modules.PROPERTY_BROCHURES}.reorder`,
    UPLOAD: `${Modules.PROPERTY_BROCHURES}.upload`,
    DOWNLOAD: `${Modules.PROPERTY_BROCHURES}.download`,
  },
  PROPERTY_VIDEOS: {
    ...generateCrudPermissions(Modules.PROPERTY_VIDEOS),
    REORDER: `${Modules.PROPERTY_VIDEOS}.reorder`,
    UPLOAD: `${Modules.PROPERTY_VIDEOS}.upload`,
    STREAM: `${Modules.PROPERTY_VIDEOS}.stream`,
  },

  MEDIA: {
    UPLOAD: `${Modules.MEDIA}.upload`,
    DELETE: `${Modules.MEDIA}.delete`,
    DOWNLOAD: `${Modules.MEDIA}.download`,
  },
  // Add others as necessary
} as const;
