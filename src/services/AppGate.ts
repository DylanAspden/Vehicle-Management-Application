import * as LocalAuthentication from "expo-local-authentication";
import {
  requestNotificationPermissionsAsync,
  reconcileNotificationsAsync,
} from "@/services/NotificationService";

export type AuthResult = "unlocked" | "locked" | "error";

export async function authenticateDeviceAsync(): Promise<AuthResult> {
  try {
    const securityLevel = await LocalAuthentication.getEnrolledLevelAsync();
    if (securityLevel === LocalAuthentication.SecurityLevel.NONE) {
      return "unlocked";
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Unlock Vehicle Management App",
      fallbackLabel: "Use Passcode",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });

    return result.success ? "unlocked" : "locked";
  } catch (error) {
    console.error("Error occurred while authenticating user:", error);
    return "error";
  }
}

export async function initializeAppServicesAsync(): Promise<void> {
  await requestNotificationPermissionsAsync();
  // await SQLiteDAL.initDatabase();
  // await MaintenanceEngine.syncAllVehiclesHealthScores();
  await reconcileNotificationsAsync();
}
