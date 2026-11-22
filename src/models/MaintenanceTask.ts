// Priority ranges from 1 (low) to 5 (critical) per FR-03
export type MaintenancePriority = 1 | 2 | 3 | 4 | 5;

export interface MaintenanceTask {
  task_id: number;
  vehicle_id: number;
  task_name: string;
  distance_interval: number;
  time_interval: number;
  priority: MaintenancePriority | number;
}

export type NewMaintenanceTask = Omit<MaintenanceTask, "task_id">;