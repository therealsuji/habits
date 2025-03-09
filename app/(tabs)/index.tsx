import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  globalStyles,
  buttonStyles,
  containerStyles,
} from "@/styles/globalStyles";

// Sample data - you would replace this with your actual data storage
const sampleHabits = [
  { id: "1", name: "Daily Exercise", streak: 5 },
  { id: "2", name: "Read 30 minutes", streak: 12 },
  { id: "3", name: "Drink 8 glasses of water", streak: 3 },
];

export default function HomeScreen() {
  const router = useRouter();
  const [habits, setHabits] = useState(sampleHabits);

  const navigateToCreateHabit = () => {
    router.push("/create-habit");
  };

  const navigateToHabitDetails = (habitId) => {
    router.push({
      pathname: "/habit-details",
      params: { id: habitId },
    });
  };

  return (
    <SafeAreaView style={containerStyles.container}>
      <ThemedView style={containerStyles.content}>
        <View style={globalStyles.header}>
          <ThemedText style={globalStyles.headerTitle}>My Habits</ThemedText>
          <TouchableOpacity
            style={buttonStyles.createButton}
            onPress={navigateToCreateHabit}
          >
            <ThemedText style={buttonStyles.createButtonText}>
              + New Habit
            </ThemedText>
          </TouchableOpacity>
        </View>

        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.habitItem}
              onPress={() => navigateToHabitDetails(item.id)}
            >
              <ThemedText style={styles.habitName}>{item.name}</ThemedText>
              <ThemedText style={styles.habitStreak}>
                {item.streak} day streak
              </ThemedText>
            </TouchableOpacity>
          )}
          style={styles.habitsList}
          contentContainerStyle={styles.habitsListContent}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  habitsList: {
    flex: 1,
  },
  habitsListContent: {
    paddingBottom: 20,
  },
  habitItem: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 12,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 4,
  },
  habitStreak: {
    fontSize: 14,
    color: "#666",
  },
});
