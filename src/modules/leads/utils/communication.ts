export function isValidPhone(phone: string | null | undefined): boolean {
  if (!phone) return false;
  // Simple regex to allow digits, +, -, spaces, and parentheses
  return /^[\d\+\-\s\(\)]+$/.test(phone) && phone.replace(/[^\d]/g, '').length >= 10;
}

export function isValidEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function generateWhatsAppLink(phone: string, propertyName?: string): string {
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  const text = propertyName 
    ? `Hello,\n\nThank you for your interest in "${propertyName}".\n\nWe received your enquiry and would be happy to assist you.\n\nPlease let us know a convenient time to discuss your requirements or schedule a site visit.\n\nThank you.`
    : `Hello,\n\nThank you for your enquiry.\n\nWe would be happy to assist you. Please let us know a convenient time to discuss your requirements.\n\nThank you.`;
    
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function generateEmailLink(email: string, propertyName?: string): string {
  const subject = propertyName ? `Property Enquiry - ${propertyName}` : `Property Enquiry`;
  const body = propertyName
    ? `Hello,\n\nThank you for your enquiry regarding "${propertyName}".\n\nWe appreciate your interest and will be happy to provide additional information.\n\nRegards,\nSales Team`
    : `Hello,\n\nThank you for your enquiry.\n\nWe appreciate your interest and will be happy to provide additional information.\n\nRegards,\nSales Team`;

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function generateCallLink(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
