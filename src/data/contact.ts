import { siteConfig } from "@/config/site";
import { ContactInfo, BusinessHours, FAQItem } from "@/types/contact";

export const contactInfo: ContactInfo = {
  address: siteConfig.contact.officeAddress,
  phone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  whatsapp: siteConfig.contact.whatsapp,
  googleMapsUrl: siteConfig.contact.officeMapsUrl
};

export const getWhatsAppLink = (propertyName?: string) => {
  const number = siteConfig.contact.whatsapp.replace(/[^0-9]/g, "");
  const text = propertyName 
    ? `Hi, I am interested in ${propertyName}. Can you provide more details?`
    : `Hi, I would like to know more about your services.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};

export const getMailtoLink = (subject?: string) => {
  const email = siteConfig.contact.email;
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
};

export const businessHours: BusinessHours[] = [
  { days: "Monday - Saturday", hours: "10:00 AM - 7:00 PM" },
  { days: "Sunday", hours: "10:00 AM - 4:00 PM (By Appointment)" }
];

export const contactFaq: FAQItem[] = [
  {
    question: "How quickly will someone respond to my enquiry?",
    answer: "Our dedicated property advisors aim to respond to all enquiries within 30 minutes during our standard business hours. For after-hours queries, we will reach out first thing the next morning."
  },
  {
    question: "Can I schedule a site visit on weekends?",
    answer: "Yes, we encourage weekend site visits! We offer dedicated pickup and drop services for scheduled site visits on Saturdays and Sundays."
  },
  {
    question: "Do you provide assistance with home loans?",
    answer: "Absolutely. We have tied up with leading banks including HDFC, SBI, and ICICI to ensure a seamless and fast-tracked loan approval process for our clients."
  },
  {
    question: "Is there any fee for your consultancy services?",
    answer: "Our advisory and consultancy services are completely free for homebuyers. We do not charge any hidden fees or brokerage from our clients for primary market purchases."
  }
];
