import {
  TouchableOpacity,
  FlatList,
  View,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Suspense, useState, useCallback } from "react";
import { useSelector } from "@legendapp/state/react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Habit, habitStore$ } from "@/store/habitStore";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "light";
  const layout = useWindowDimensions();

  const upcomingHabits = useSelector(habitStore$.upcomingHabits, {
    suspense: true,
  });
  const habits = useSelector(habitStore$.allHabits, { suspense: true });

  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 32 - 12) / 2;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "upcoming", title: "Upcoming" },
    { key: "all", title: "All" },
  ]);

  const navigateToCreateHabit = () => {
    router.push("/create-habit");
  };

  const navigateToHabitDetails = (habitId: string) => {
    router.push({
      pathname: "/habit-details",
      params: { id: habitId },
    });
  };

  const HabitCard = ({ habit }: { habit: Habit }) => (
    <TouchableOpacity
      style={{ width: cardWidth }}
      className="bg-gray-100 dark:bg-gray-800 rounded-2xl mb-3 p-4 mx-1.5 shadow-md overflow-hidden"
      onPress={() => navigateToHabitDetails(habit.id)}
    >
      <View className="flex-row justify-between items-center mb-3">
        <View className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
          <ThemedText className="text-sm font-medium">at 2pm</ThemedText>
        </View>
        <View className="flex-row items-center bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded-full">
          <ThemedText className="mr-1 font-bold">{habit.streak}</ThemedText>
          <ThemedText>🔥</ThemedText>
        </View>
      </View>
      <ThemedText className="text-lg font-bold mb-2">{habit.name}</ThemedText>
      {habit.streak > 0 && (
        <View className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full self-start">
          <ThemedText className="text-sm font-medium text-green-700 dark:text-green-300">
            Great Job
          </ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderHabitList = useCallback(
    ({ data }: { data: Habit[] }) => (
      <FlatList
        ListEmptyComponent={
          <ThemedText
            type="defaultSemiBold"
            className="text-center text-gray-500"
          >
            No habits found
          </ThemedText>
        }
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        style={{ marginBottom: insets.bottom }}
        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10 }}
        renderItem={({ item }) => <HabitCard habit={item} />}
      />
    ),
    [insets.bottom]
  );

  const UpcomingTab = () => renderHabitList({ data: upcomingHabits });
  const AllTab = () => renderHabitList({ data: habits });

  const renderScene = SceneMap({
    upcoming: UpcomingTab,
    all: AllTab,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: Colors[colorScheme].tint }}
      style={{ backgroundColor: Colors[colorScheme].background }}
      activeColor={Colors[colorScheme].tint}
      inactiveColor={Colors[colorScheme].tabIconDefault}
      labelStyle={{ fontWeight: "bold" }}
    />
  );

  return (
    <ThemedView className="flex-1">
      <View className="px-4 pt-4">
        <ThemedText className="mb-4" type="title">
          Habits
        </ThemedText>
      </View>

      <Suspense fallback={<ThemedText className="p-4">Loading...</ThemedText>}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </Suspense>

      <TouchableOpacity
        className="bg-primary px-6 py-3 rounded-full absolute bottom-8 right-4 flex items-center justify-center shadow-lg"
        onPress={navigateToCreateHabit}
      >
        <ThemedText className="text-white font-bold text-lg">
          + New Habit
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
