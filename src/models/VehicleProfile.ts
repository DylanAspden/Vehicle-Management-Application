export interface VehicleProfile {
  vehicle_id: number;
  make: string;
  model: string;
  year: number;
  current_mileage: number;
  registration: string;
}

export type NewVehicleProfile = Omit<VehicleProfile, "vehicle_id">;