import { NewVehicleProfile, VehicleProfile } from "@/models";
import {
  getAllVehicleProfiles,
  initDatabase,
  insertVehicleProfile,
} from "@/database/SQLiteDAL";

export type ControllerResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// Sanitize and validate raw vehicle profile inputs before hitting SQLiteDAL
function validateAndSanitizeVehicleInput(
  input: NewVehicleProfile,
): ControllerResult<NewVehicleProfile> {
  const make = input.make.trim();
  const model = input.model.trim();
  const registration = input.registration.trim().toUpperCase();
  const year = Number(input.year);
  const current_mileage = Number(input.current_mileage);

  if (!make || !model || !registration) {
    return {
      ok: false,
      error: "Make, model, and registration are required.",
    };
  }

  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return {
      ok: false,
      error: "Enter a valid vehicle year.",
    };
  }

  if (!Number.isFinite(current_mileage) || current_mileage < 0) {
    return {
      ok: false,
      error: "Current mileage must be 0 or greater.",
    };
  }

  return {
    ok: true,
    data: {
      make,
      model,
      year,
      current_mileage: Math.round(current_mileage),
      registration,
    },
  };
}

// Action: Ensure the SQLite database is initialized from the controller layer
export async function ensureVehicleStoreReadyAsync(): Promise<
  ControllerResult<true>
> {
  try {
    await initDatabase();
    return { ok: true, data: true };
  } catch (err) {
    console.error("Failed to initialize database:", err);
    return { ok: false, error: "Could not initialize local database." };
  }
}

// Action: Validate input and insert a new vehicle profile via SQLiteDAL
export async function createVehicleProfileAsync(
  input: NewVehicleProfile,
): Promise<ControllerResult<VehicleProfile>> {
  const checked = validateAndSanitizeVehicleInput(input);
  if (!checked.ok) {
    return checked;
  }

  try {
    const created = await insertVehicleProfile(checked.data);
    return { ok: true, data: created };
  } catch (err) {
    console.error("Failed to create vehicle profile:", err);
    return { ok: false, error: "Failed to save vehicle profile to database." };
  }
}

// Action: Fetch all stored vehicle profiles via SQLiteDAL
export async function listVehicleProfilesAsync(): Promise<
  ControllerResult<VehicleProfile[]>
> {
  try {
    const profiles = await getAllVehicleProfiles();
    return { ok: true, data: profiles };
  } catch (err) {
    console.error("Failed to load vehicle profiles:", err);
    return { ok: false, error: "Failed to load vehicles from database." };
  }
}

// Tester function
export async function inspectDatabaseStateAsync(): Promise<
  ControllerResult<{
    foreignKeysEnabled: boolean;
    tables: string[];
    vehicleCount: number;
  }>
> {
  try {
    const db = await initDatabase();

    // Check if foreign key enforcement is active on this connection
    const fkRow = await db.getFirstAsync<{ foreign_keys: number }>(
      "PRAGMA foreign_keys;",
    );

    // Query sqlite_master for all user tables created in the database
    const tableRows = await db.getAllAsync<{ name: string }>(
      `SELECT name FROM sqlite_master
       WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
       ORDER BY name ASC;`,
    );

    const vehicles = await getAllVehicleProfiles();

    return {
      ok: true,
      data: {
        foreignKeysEnabled: fkRow?.foreign_keys === 1,
        tables: tableRows.map((t) => t.name),
        vehicleCount: vehicles.length,
      },
    };
  } catch (err) {
    console.error("Failed to inspect SQLite state:", err);
    return { ok: false, error: "Could not read SQLite diagnostic info." };
  }
}
