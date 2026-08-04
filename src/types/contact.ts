export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  googleMapsUrl?: string | null;
}

export interface BusinessHours {
  days: string;
  hours: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface LeadEnquiry {
  name: string;
  phone: string;
  email: string;
  message: string;
  project?: string;
  configuration?: string;
  preferredDate?: string;
  preferredTime?: string;
  type: "General" | "Property" | "SiteVisit" | "Callback";
}
