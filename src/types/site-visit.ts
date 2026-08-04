export type SiteVisitStatus = 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';

export interface SiteVisit {
  id: string;
  leadId: string;
  propertyId: string | null;
  builderId: string | null;
  preferredDate: string;
  preferredTime: string;
  visitorsCount: number;
  notes: string | null;
  status: SiteVisitStatus;
  assignedToEmail: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Joins
  lead?: {
    fullName: string;
    phone: string;
    email: string | null;
  };
  property?: {
    title: string;
    slug: string;
  };
  builder?: {
    name: string;
  };
}
