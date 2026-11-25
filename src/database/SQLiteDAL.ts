import * as SQLite from "expo-sqlite";
import {
  Attachment,
  MaintenanceTask,
  NewAttachment,
  NewMaintenanceTask,
  NewScheduledNotification,
  NewServiceRecord,
  NewVehicleHealth,
  NewVehicleProfile,
  ScheduledNotification,
  ServiceRecord,
  VehicleHealth,
  VehicleProfile,
} from "@/models";

const DB_NAME = "vehicle_management.db";
let dbInstance: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Initialise the database
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  if (!initPromise) {
    initPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await db.execAsync("PRAGMA foreign_keys = ON;");
      await createTables(db);
      dbInstance = db;
      return db;
    })().catch((err) => {
      initPromise = null;
      throw err;
    });
  }

  return initPromise;
}

// Create database tables
async function createTables(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.withTransactionAsync(async () => {
    // VehicleProfile table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS VehicleProfile (
        vehicle_id INTEGER PRIMARY KEY AUTOINCREMENT,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        current_mileage INTEGER NOT NULL DEFAULT 0,
        registration TEXT NOT NULL
      );
    `);

    // MaintenanceTask table linked to VehicleProfile
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS MaintenanceTask (
        task_id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL,
        task_name TEXT NOT NULL,
        distance_interval INTEGER NOT NULL,
        time_interval INTEGER NOT NULL,
        priority INTEGER NOT NULL,
        FOREIGN KEY (vehicle_id) REFERENCES VehicleProfile (vehicle_id) ON DELETE CASCADE
      );
    `);

    // ServiceRecord table linked to VehicleProfile and MaintenanceTask
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ServiceRecord (
        service_id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL,
        task_id INTEGER NOT NULL,
        completion_date TEXT NOT NULL,
        service_mileage INTEGER NOT NULL,
        service_notes TEXT NOT NULL DEFAULT '',
        FOREIGN KEY (vehicle_id) REFERENCES VehicleProfile (vehicle_id) ON DELETE CASCADE,
        FOREIGN KEY (task_id) REFERENCES MaintenanceTask (task_id) ON DELETE RESTRICT
      );
    `);

    // Attachment table for local file URI location linked to ServiceRecord
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Attachment (
        document_id INTEGER PRIMARY KEY AUTOINCREMENT,
        service_id INTEGER NOT NULL,
        format TEXT NOT NULL,
        file_location TEXT NOT NULL,
        FOREIGN KEY (service_id) REFERENCES ServiceRecord (service_id) ON DELETE CASCADE
      );
    `);

    // ScheduledNotification table linked to MaintenanceTask
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ScheduledNotification (
        notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        trigger_date TEXT NOT NULL,
        trigger_mileage INTEGER NOT NULL,
        FOREIGN KEY (task_id) REFERENCES MaintenanceTask (task_id) ON DELETE CASCADE
      );
    `);

    // VehicleHealth table linked to VehicleProfile
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS VehicleHealth (
        health_id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL,
        current_score INTEGER NOT NULL,
        condition_label TEXT NOT NULL,
        last_calculated TEXT NOT NULL,
        FOREIGN KEY (vehicle_id) REFERENCES VehicleProfile (vehicle_id) ON DELETE CASCADE
      );
    `);
  });
}

// VehicleProfile queries
// Insert a new VehicleProfile and return with its generated vehicle_id
export async function insertVehicleProfile(
  profile: NewVehicleProfile,
): Promise<VehicleProfile> {
  const db = await initDatabase();
  const result = await db.runAsync(
    `INSERT INTO VehicleProfile (make, model, year, current_mileage, registration)
     VALUES (?, ?, ?, ?, ?);`,
    [
      profile.make,
      profile.model,
      profile.year,
      profile.current_mileage,
      profile.registration,
    ],
  );

  return {
    vehicle_id: Number(result.lastInsertRowId),
    ...profile,
  };
}

// Fetch all VehicleProfile records
export async function getAllVehicleProfiles(): Promise<VehicleProfile[]> {
  const db = await initDatabase();
  return db.getAllAsync<VehicleProfile>(
    `SELECT vehicle_id, make, model, year, current_mileage, registration
     FROM VehicleProfile
     ORDER BY vehicle_id DESC;`,
  );
}
