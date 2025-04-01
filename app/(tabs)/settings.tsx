import React from "react";
import { SafeAreaView, Alert, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { habitStore$ } from "@/store/habitStore";
 
const Settings = () => {
  const clearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all habits and entries? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            habitStore$.clearAllData();
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ThemedView className="flex-1 p-4">
        <ThemedText className="text-2xl font-bold mb-6">Settings</ThemedText>

        <ThemedText className="text-xl font-medium mt-4 mb-2">
          Storage Management
        </ThemedText>

        <TouchableOpacity
          className="bg-red-100 dark:bg-red-900 rounded-lg py-4 px-4 mb-3 border border-red-200 dark:border-red-700"
          onPress={clearAllData}
        >
          <ThemedText className="text-base font-medium">
            Reset All Data
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
};

export default Settings;
