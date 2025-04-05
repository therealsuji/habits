import { useState } from "react";
import { TouchableOpacity, View, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { use$ } from "@legendapp/state/react";
import { habitStore$ } from "@/store/habitStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HabitDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const habitId = id as string;
  const habit = use$(habitStore$.getHabit(habitId));
  const entryForDate = use$(habitStore$.getEntryForDate(habitId, new Date()));
  const [activeTab, setActiveTab] = useState("details");

  const deleteHabit = () => {
    habitStore$.deleteHabit(habitId);
    router.back();
  };

  const markHabitComplete = () => {
    habitStore$.addHabitEntry({
      habitId,
      date: new Date(),
      completed: true,
    });
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Habit",
      "Are you sure you want to delete this habit? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: deleteHabit, style: "destructive" },
      ]
    );
  };

  if (!habit) {
    return (
      <ThemedView className="flex-1 p-4">
        <ThemedText>Loading habit details...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1 p-4">
        <View className="flex-row items-center justify-between mb-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
          >
            <ThemedText>← Back</ThemedText>
          </TouchableOpacity>
        </View>
        <View>
          <ThemedText className="text-2xl font-bold">{habit.name}</ThemedText>
        </View>

        <View className="bg-primary rounded-lg p-5 items-center mb-5 w-full">
          <ThemedText className="text-white text-base text-center flex-shrink">
            Current Streak
          </ThemedText>
          <ThemedText className="pt-2.5 text-white text-3xl font-bold">
            {habit.streak} days
          </ThemedText>
        </View>

        <View className="flex-row mb-5 border-b border-gray-200 dark:border-gray-700">
          <TouchableOpacity
            className={`flex-1 py-3 items-center ${
              activeTab === "details" ? "border-b-3 border-primary" : ""
            }`}
            onPress={() => setActiveTab("details")}
          >
            <ThemedText
              className={`text-base ${
                activeTab === "details" ? "font-bold text-primary" : ""
              }`}
            >
              Details
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View className="flex-1">
          <ThemedText className="text-lg font-medium mb-2.5">
            Description
          </ThemedText>
          <ThemedText className="text-base mb-5 leading-6">
            {habit.description}
          </ThemedText>

          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-primary py-3.5 px-5 rounded-lg flex-1 mr-2.5 disabled:opacity-50"
              onPress={markHabitComplete}
              disabled={!!entryForDate}
            >
              <ThemedText className="text-white font-medium text-base">
                Mark Complete
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-blue-500 py-3.5 px-5 rounded-lg flex-1 ml-2.5"
              onPress={() => router.push(`/edit-habit?id=${habitId}`)}
            >
              <ThemedText className="text-white font-medium text-base">
                Edit Habit
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View className="mt-8 items-center">
            <TouchableOpacity
              className="bg-red-500 py-3 px-6 rounded-lg"
              onPress={confirmDelete}
            >
              <ThemedText className="text-white font-semibold text-base">
                Delete Habit
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
