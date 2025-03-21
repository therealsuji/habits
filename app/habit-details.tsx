import { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  buttonStyles,
  containerStyles,
  globalStyles,
} from "@/styles/globalStyles";
import { use$ } from "@legendapp/state/react";
import { habitStore$ } from "@/store/habitStore";

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
      <SafeAreaView style={containerStyles.container}>
        <ThemedView style={containerStyles.content}>
          <ThemedText>Loading habit details...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyles.container}>
      <ThemedView style={containerStyles.content}>
        <View style={globalStyles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={buttonStyles.backButton}
          >
            <ThemedText>← Back</ThemedText>
          </TouchableOpacity>
        </View>
        <View>
          <ThemedText style={globalStyles.headerTitle}>{habit.name}</ThemedText>
        </View>

        <View style={styles.streakCard}>
          <ThemedText style={styles.streakText}>Current Streak</ThemedText>
          <ThemedText style={styles.streakCount}>
            {habit.streak} days
          </ThemedText>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "details" && styles.activeTab]}
            onPress={() => setActiveTab("details")}
          >
            <ThemedText
              style={[
                styles.tabText,
                activeTab === "details" && styles.activeTabText,
              ]}
            >
              Details
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <ThemedText style={styles.sectionTitle}>Description</ThemedText>
          <ThemedText style={styles.description}>
            {habit.description}
          </ThemedText>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={buttonStyles.actionButton}
              className={"disabled:opacity-50"}
              onPress={markHabitComplete}
              disabled={!!entryForDate}
            >
              <ThemedText style={buttonStyles.actionButtonText}>
                Mark Complete
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[buttonStyles.actionButton, buttonStyles.editButton]}
              onPress={() => router.push(`/edit-habit?id=${habitId}`)}
            >
              <ThemedText style={buttonStyles.actionButtonText}>
                Edit Habit
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.deleteButtonContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={confirmDelete}
            >
              <ThemedText style={styles.deleteButtonText}>
                Delete Habit
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  streakCard: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  streakText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    flexShrink: 1,
  },
  streakCount: {
    paddingTop: 10,
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#4CAF50",
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    fontWeight: "bold",
    color: "#4CAF50",
  },
  detailsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tipsList: {
    paddingBottom: 20,
  },
  tipCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  deleteButtonContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#ff5252",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
