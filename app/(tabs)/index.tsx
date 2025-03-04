import { StyleSheet, SafeAreaView, TouchableOpacity, FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// Sample data - you would replace this with your actual data storage
const sampleHabits = [
  { id: '1', name: 'Daily Exercise', streak: 5 },
  { id: '2', name: 'Read 30 minutes', streak: 12 },
  { id: '3', name: 'Drink 8 glasses of water', streak: 3 },
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
      params: { id: habitId }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>My Habits</ThemedText>
          <TouchableOpacity 
            style={styles.createButton} 
            onPress={navigateToCreateHabit}
          >
            <ThemedText style={styles.buttonText}>+ New Habit</ThemedText>
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
              <ThemedText style={styles.habitStreak}>{item.streak} day streak</ThemedText>
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
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
