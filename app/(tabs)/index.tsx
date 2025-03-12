import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Suspense, useState } from "react";
import { useObservable, useSelector } from "@legendapp/state/react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  globalStyles,
  buttonStyles,
  containerStyles,
} from "@/styles/globalStyles";
import { habitStore$ } from "@/store/habitStore";

export default function HomeScreen() {
  const router = useRouter();
  const state$ = useObservable(habitStore$);
  const habits = useSelector(state$.habits, { suspense: true });

  console.log("Kumak da", habits);

  const navigateToCreateHabit = () => {
    router.push("/create-habit");
  };

  const navigateToHabitDetails = (habitId: string) => {
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
        <Suspense fallback={<div>Loading...</div>}>
          <FlatList
            ListEmptyComponent={<ThemedText>No habits yet.</ThemedText>}
            data={Array.from(habits.values())}
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
        </Suspense>
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
