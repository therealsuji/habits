import { SafeAreaView, TouchableOpacity, FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { Suspense } from "react";
import { useSelector } from "@legendapp/state/react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  const habits = useSelector(habitStore$.habits, { suspense: true });
  
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
            className="bg-primary px-4 py-2 rounded-full flex items-center justify-center"
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
            style={{ marginBottom: insets.bottom }}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3"
                onPress={() => navigateToHabitDetails(item.id)}
              >
                <ThemedText className="text-lg font-medium mb-1">
                  {item.name}
                </ThemedText>
                <ThemedText className="text-sm text-gray-500 dark:text-gray-400">
                  {item.streak} day streak
                </ThemedText>
              </TouchableOpacity>
            )}
            className="flex-1 pb-5"
          />
        </Suspense>
      </ThemedView>
    </SafeAreaView>
  );
}
