export interface ServiceRecord {
  service_id: number;
  vehicle_id: number;
  task_id: number;
  completion_date: string;
  service_mileage: number;
  service_notes: string;
}

export type NewServiceRecord = Omit<ServiceRecord, "service_id">;
