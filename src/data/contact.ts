import { siteConfig } from "@/config/site";
import { ContactInfo, BusinessHours, FAQItem } from "@/types/contact";

export const contactInfo: ContactInfo = {
  address: siteConfig.contact.address,
  phone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  whatsapp: siteConfig.contact.phone, // [Placeholder awaiting official client data]
  googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.419409051052!2d77.40026211508006!3d28.527123982459955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce7b1b36b5c77%3A0x6b8bc215038f99!2sAdvant%20Navis%20Business%20Park!5e0!3m2!1sen!2sin!4v1689000000000!5m2!1sen!2sin" // [Placeholder awaiting official client data]
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
