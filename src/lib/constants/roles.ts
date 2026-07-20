export const Roles = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  SALES_MANAGER: "SALES_MANAGER",
  SALES_EXECUTIVE: "SALES_EXECUTIVE",
  HR: "HR",
  CONTENT_MANAGER: "CONTENT_MANAGER",
  MARKETING: "MARKETING",
  VIEWER: "VIEWER",
} as const;

export type Role = typeof Roles[keyof typeof Roles];
