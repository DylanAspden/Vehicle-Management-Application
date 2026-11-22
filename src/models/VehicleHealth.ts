export interface VehicleHealth {
  health_id: number;
  vehicle_id: number;
  current_score: number;
  condition_label: string;
  last_calculated: string;
}

export type NewVehicleHealth = Omit<VehicleHealth, "health_id">;