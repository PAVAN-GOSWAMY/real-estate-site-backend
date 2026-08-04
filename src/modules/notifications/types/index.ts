/**
 * Notifications Architecture Foundation
 * Future-ready types for multi-channel notifications.
 */

export type NotificationChannel = "Browser" | "Email" | "WhatsApp" | "Push" | "SMS";

export interface NotificationPayload {
  id: string;
  leadId: string;
  title: string;
  message: string;
  channels: NotificationChannel[];
  priority: "Low" | "Medium" | "High" | "Urgent";
  scheduledFor?: string; // ISO date
  metadata?: Record<string, any>;
}

export interface NotificationProvider {
  channel: NotificationChannel;
  send(payload: NotificationPayload): Promise<boolean>;
}

export interface WebhookConfig {
  url: string;
  secret: string;
  enabledEvents: string[];
}
