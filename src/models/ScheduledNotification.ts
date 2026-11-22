export interface ScheduledNotification {
  notification_id: number;
  task_id: number;
  trigger_date: string;
  trigger_mileage: number;
}

export type NewScheduledNotification = Omit<ScheduledNotification, "notification_id">;