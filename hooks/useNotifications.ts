import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { type Habit } from "../store/habitStore";

// Configure how notifications are presented when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface NotificationData {
  habitId: string;
  habitName: string;
}

async function requestNotificationPermissions() {
  if (Platform.OS === "android") {
    // Set notification channel for Android
    await Notifications.setNotificationChannelAsync("habits-reminders", {
      name: "Habits Reminders",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("User has not granted permission for notifications");
    return;
  }
}

// Schedule a notification based on a habit's repetition pattern
export async function scheduleNotification(habit: Habit) {
  try {
    // Cancel any existing notifications for this habit first
    await cancelNotification(habit);

    const triggers = getTriggersHabit(habit);
    console.log("triggers", triggers);
    if (!triggers) {
      console.log("Invalid repetition pattern");
      return null;
    }

    // Create notification content
    const content: Notifications.NotificationContentInput = {
      title: "Habit Reminder",
      body: `Time to complete your habit: ${habit.name}`,
      data: { habitId: habit.id, habitName: habit.name } as NotificationData,
    };

    // Schedule the notification
    for (const trigger of triggers) {
      await Notifications.scheduleNotificationAsync({
        content,
        trigger,
        identifier: trigger.identifier,
      });
    }
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return null;
  }
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function cancelNotification(habit: Habit) {
  try {
    const triggers = await Notifications.getAllScheduledNotificationsAsync();
    for (const trigger of triggers) {
      if (trigger.identifier.startsWith(habit.id)) {
        await Notifications.cancelScheduledNotificationAsync(
          trigger.identifier
        );
      }
    }
    console.log("cancelled notification", habit.id);
  } catch (error) {
    console.error("Error canceling notification:", error);
  }
}

// Convert repetition pattern to a notification trigger
function getTriggersHabit(
  habit: Habit
): Array<
  Notifications.SchedulableNotificationTriggerInput & { identifier: string }
> {
  try {
    const timeStr = habit.repetition.time || "09:00";
    const [hours, minutes] = timeStr.split(":").map(Number);

    switch (habit.repetition.type) {
      case "daily":
        // Daily trigger at specific time
        return [
          {
            hour: hours,
            minute: minutes,
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            identifier: `${habit.id}-daily`,
          },
        ];

      case "weekly":
        if (!habit.repetition.days || habit.repetition.days.length === 0)
          return [];

        // Convert day abbreviations to day numbers (0-6, where 0 is Sunday)
        const dayToNumber: Record<string, number> = {
          Su: 0,
          M: 1,
          T: 2,
          W: 3,
          Th: 4,
          F: 5,
          Sa: 6,
        };

        return habit.repetition.days.map((day) => ({
          weekday: dayToNumber[day],
          hour: hours,
          minute: minutes,
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          identifier: `${habit.id}-weekly-${day}`,
        }));

      case "interval":
        const secondsInDay = 3600 * 24;
        return [
          {
            seconds: habit.repetition.interval * secondsInDay,
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            identifier: `${habit.id}-interval`,
            repeats: true,
          },
        ];

      default:
        return [];
    }
  } catch (error) {
    console.error("Error creating trigger:", error);
    return [];
  }
}

// Hook to use notifications in components
export function useNotifications() {
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Request permissions
    requestNotificationPermissions();

    // Set up notification listeners
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content
          .data as NotificationData;

        // Handle notification taps here
        console.log("Notification tapped:", data);

        // You can navigate to habit details or mark habit as completed here
      });

    // Clean up the listeners on unmount
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return {
    notification,
    scheduleNotification,
    cancelNotification,
  };
}
