import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { useObservable } from "@legendapp/state/react";

import { ThemedText } from "@/components/ThemedText";
import { habitStore$ } from "@/store/habitStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DebugScreen() {
  const habits = useObservable(habitStore$.habits);
  const insets = useSafeAreaInsets();

  const [scheduledNotifications, setScheduledNotifications] = useState<
    Notifications.NotificationRequest[]
  >([]);

  useEffect(() => {
    // Load all scheduled notifications
    async function loadNotifications() {
      try {
        const notifications =
          await Notifications.getAllScheduledNotificationsAsync();
        setScheduledNotifications(notifications);
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    }

    loadNotifications();

    // Refresh every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to get the next trigger date from a notification
  function getNextTriggerDate(trigger: any): string {
    if (!trigger) return "Unknown";

    try {
      if (trigger.date) {
        return new Date(trigger.date).toLocaleString();
      }

      if (trigger.seconds) {
        // For interval triggers, it's harder to calculate exactly
        return `Every ${trigger.seconds / 3600} hours`;
      }

      if (trigger.hour !== undefined && trigger.minute !== undefined) {
        const now = new Date();
        let nextDate = new Date();
        nextDate.setHours(trigger.hour, trigger.minute, 0, 0);

        // If the time already passed today, move to tomorrow
        if (nextDate <= now) {
          nextDate.setDate(nextDate.getDate() + 1);
        }

        // If it's a weekly notification, adjust to the correct day
        if (trigger.weekday !== undefined) {
          const currentDay = nextDate.getDay();
          const daysUntilTarget = (trigger.weekday - currentDay + 7) % 7;

          if (
            daysUntilTarget > 0 ||
            (daysUntilTarget === 0 && nextDate <= now)
          ) {
            nextDate.setDate(nextDate.getDate() + daysUntilTarget);
          }
        }

        return nextDate.toLocaleString();
      }

      return JSON.stringify(trigger);
    } catch (e) {
      return "Invalid trigger";
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, }}>
      <StatusBar style="auto" />
      <ScrollView className="p-4" style={{ marginBottom: insets.bottom }}>
        <ThemedText className="text-2xl font-bold mb-6">
          Debug - Upcoming Reminders
        </ThemedText>

        {scheduledNotifications.length === 0 ? (
          <ThemedText className="text-lg">
            No scheduled reminders found
          </ThemedText>
        ) : (
          scheduledNotifications.map((notification) => {
            // Find the corresponding habit if available
            const habit = habits.find(
              (h) => h.id.get() === notification.identifier
            );
            const habitName = habit ? habit.name.get() : "Unknown habit";

            const nextTrigger = getNextTriggerDate(notification.trigger);

            return (
              <View
                key={notification.identifier}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4"
              >
                <ThemedText className="text-lg font-semibold">
                  {habitName}
                </ThemedText>
                <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
                  ID: {notification.identifier}
                </ThemedText>
                <ThemedText className="mt-2">
                  Next scheduled: {nextTrigger}
                </ThemedText>
                <ThemedText className="mt-1">
                  Content: {notification.content.body}
                </ThemedText>

                {habit && (
                  <View className="mt-2">
                    <ThemedText className="font-medium">
                      Repetition pattern:
                    </ThemedText>
                    <ThemedText>
                      {habit.repetition.type.get() === "daily"
                        ? `Daily at ${habit.repetition.time?.get() || "09:00"}`
                        : habit.repetition.type.get() === "weekly"
                        ? `Weekly on ${
                            (habit.repetition as any).days?.get()?.join(", ") ||
                            ""
                          } at ${habit.repetition.time?.get() || "09:00"}`
                        : habit.repetition.type.get() === "interval"
                        ? `Every ${
                            (habit.repetition as any).interval?.get() || 24
                          } hours at ${habit.repetition.time?.get() || "09:00"}`
                        : "Unknown pattern"}
                    </ThemedText>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
