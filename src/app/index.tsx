import { Redirect } from 'expo-router';
import { useEffect, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as LocalAuthentication from 'expo-local-authentication';
import { View, Text, Pressable, ActivityIndicator, Platform, useColorScheme } from "react-native";
import { theme, ui } from "@/constants/theme";

// Registers a global handler telling the OS how to display notifications while the app is open
Notifications.setNotificationHandler({
  // Runs automatically when a scheduled notification fires in the foreground
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

// Helper: Request OS notification permissions & configure Android default channel
async function requestNotificationPermissionsAsync() {
  // Check if the device is a physical device (not a simulator/emulator)
  if (!Device.isDevice) {
    console.warn('Must use physical device for full notification support');
    return;
  }
  // Request permissions from the OS
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  // If permissions are not granted, log a warning and exit
  if (finalStatus !== 'granted') {
    console.warn('Notification permissions not granted');
    return;
  }
  // Configure Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

// Helper: Reconciles local SQLite reminders against OS-scheduled notifications on every boot
async function reconcileNotificationsAsync() {
  if (!Device.isDevice) return;

  // 1. Fetch all notifications the OS currently has queued
  const osScheduled = await Notifications.getAllScheduledNotificationsAsync();

  // 2. TODO (Next Card - SQLiteDAL): Replace this empty array with a query to ScheduledNotification table
  // Expected shape from ERD (Section 4.5.3): { notification_id, task_id, trigger_date, trigger_mileage }
  const dbNotifications: Array<{
    notification_id: number;
    task_id: number;
    trigger_date: string;
    title?: string;
    body?: string;
  }> = [];

  // Track valid IDs so we can cancel any orphaned/completed reminders still sitting in the OS
  const validDbIds = new Set(dbNotifications.map((n) => n.notification_id));

  // 3. Cancel orphaned OS notifications (e.g. tasks already completed or deleted)
  for (const osNotif of osScheduled) {
    const notifId = osNotif.content?.data?.notification_id as number | undefined;
    if (notifId !== undefined && !validDbIds.has(notifId)) {
      await Notifications.cancelScheduledNotificationAsync(osNotif.identifier);
    }
  }

  // 4. Verify every active DB reminder exists in the OS (and reprompt if overdue)
  const now = new Date();
  for (const item of dbNotifications) {
    const matches = osScheduled.filter(
      (n) => n.content?.data?.notification_id === item.notification_id
    );

    // If duplicates exist in the OS, cancel the extras
    if (matches.length > 1) {
      for (let i = 1; i < matches.length; i++) {
        await Notifications.cancelScheduledNotificationAsync(matches[i].identifier);
      }
    }

    // If the OS already has this reminder scheduled, skip re-scheduling
    if (matches.length >= 1) continue;

    // Determine trigger time: if the original trigger_date already passed, reprompt in 24 hours
    let triggerDate = new Date(item.trigger_date);
    if (triggerDate <= now) {
      triggerDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }

    // Re-register the missing or reprompted notification with the OS
    await Notifications.scheduleNotificationAsync({
      content: {
        title: item.title ?? 'Vehicle Maintenance Reminder',
        body: item.body ?? 'A scheduled maintenance task requires your attention.',
        data: { notification_id: item.notification_id, task_id: item.task_id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId: 'default',
      },
    });
  }
}

export default function Index() {
  const colorScheme = useColorScheme();
  const currentTheme = colorScheme === "dark" ? theme.dark : theme.light;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isBootReady, setIsBootReady] = useState(false);
  const authenticateUser = async () => {
    setIsAuthenticated(null);

    try {
      const securityLevel = await LocalAuthentication.getEnrolledLevelAsync();
      if (securityLevel === LocalAuthentication.SecurityLevel.NONE) {
        setIsAuthenticated(true);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Vehicle Management App',
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      setIsAuthenticated(result.success);
    } catch (error) {
      console.error('Error occurred while authenticating user:', error);
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const initializeApp = async () => {
      try {
        await requestNotificationPermissionsAsync();
        // await SQLiteDAL.initDatabase();
        // await MaintenanceEngine.syncAllVehiclesHealthScores();
        await reconcileNotificationsAsync();
      } catch (error) {
        console.error('Error during app initialization:', error);
      } finally {
        // Marks boot complete so the component can safely redirect to the dashboard
        setIsBootReady(true);
      }
    };

    initializeApp();
  }, [isAuthenticated]);

  // If the user cancelled or failed OS authentication, render a themed lock screen with a retry button
  if (isAuthenticated === false) {
    return (
      <View style={[ui.layout.screenCenter, { backgroundColor: currentTheme.background }]}>
        <Text style={[ui.typography.title, { color: currentTheme.text }]}>App Locked</Text>
        <Text style={[ui.typography.subtitle, { color: currentTheme.text }]}>
          Verify with your device PIN or biometrics to continue
        </Text>
        {/* Calls authenticateUser() again on press; uses primaryButton to guarantee 48x48dp NFR-05 compliance */}
        <Pressable
          onPress={authenticateUser}
          style={[ui.controls.primaryButton, { backgroundColor: currentTheme.btnBackground }]}
          accessibilityRole="button"
          accessibilityLabel="Unlock application"
        >
          <Text style={[ui.typography.headerTitle, { color: currentTheme.text }]}>Tap to Unlock</Text>
        </Pressable>
      </View>
    );
  }

// While waiting for OS auth or DB initialization, render a themed loading spinner
  if (isAuthenticated === null || !isBootReady) {
    return (
      <View style={[ui.layout.screenCenter, { backgroundColor: currentTheme.background }]}>
        <ActivityIndicator size="large" color={currentTheme.tabActive} />
      </View>
    );
  }

  // Once authenticated and initialized, replace the index route with the main dashboard tab
  return <Redirect href="/(tabs)/dashboard" />;
}