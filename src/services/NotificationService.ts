import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";


Notifications.setNotificationHandler({
  // Runs automatically when a scheduled notification fires in the foreground
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissionsAsync() {
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

export async function reconcileNotificationsAsync() {
  if (!Device.isDevice) return;

  // 1. Fetch all notifications the OS currently has queued
  const osScheduled = await Notifications.getAllScheduledNotificationsAsync();

  // 2. Fetch all reminders from the local SQLite database
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
    if (Number.isNaN(triggerDate.getTime()) || triggerDate <= now) {
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
