import { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, TouchableOpacity, View, FlatList, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// Sample data - you would replace this with your actual data retrieval
const getHabitById = (id) => {
  const habits = [
    { id: '1', name: 'Daily Exercise', streak: 5, description: 'Exercise for at least 30 minutes every day' },
    { id: '2', name: 'Read 30 minutes', streak: 12, description: 'Read books or articles for personal growth' },
    { id: '3', name: 'Drink 8 glasses of water', streak: 3, description: 'Stay hydrated throughout the day' },
  ];
  return habits.find(habit => habit.id === id);
};

// Promotion tips
const promotionTips = [
  {
    id: '1',
    title: 'Set a specific time',
    description: 'Schedule your habit at the same time each day to build consistency.'
  },
  {
    id: '2',
    title: 'Start small',
    description: 'Begin with a small version of your habit that takes less than two minutes to complete.'
  },
  {
    id: '3',
    title: 'Stack habits',
    description: 'Attach your new habit to an existing habit you already do consistently.'
  },
  {
    id: '4',
    title: 'Environment design',
    description: 'Modify your environment to make good habits obvious and bad habits invisible.'
  },
  {
    id: '5',
    title: 'Track your progress',
    description: 'Use a habit tracker to visualize your progress and maintain motivation.'
  },
];

export default function HabitDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [habit, setHabit] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (id) {
      const habitData = getHabitById(id.toString());
      setHabit(habitData);
    }
  }, [id]);

  if (!habit) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText>Loading habit details...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ThemedText>← Back</ThemedText>
          </TouchableOpacity>
          
          <ThemedText style={styles.title}>{habit.name}</ThemedText>
        </View>
        
        <View style={styles.streakCard}>
          <ThemedText style={styles.streakText}>Current Streak</ThemedText>
          <ThemedText style={styles.streakCount}>{habit.streak} days</ThemedText>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'details' && styles.activeTab]} 
            onPress={() => setActiveTab('details')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>Details</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'promote' && styles.activeTab]} 
            onPress={() => setActiveTab('promote')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'promote' && styles.activeTabText]}>Promotion Tips</ThemedText>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'details' ? (
          <View style={styles.detailsContainer}>
            <ThemedText style={styles.sectionTitle}>Description</ThemedText>
            <ThemedText style={styles.description}>{habit.description}</ThemedText>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.actionButton}>
                <ThemedText style={styles.actionButtonText}>Mark Complete</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
                <ThemedText style={styles.actionButtonText}>Edit Habit</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <FlatList
            data={promotionTips}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.tipCard}>
                <ThemedText style={styles.tipTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.tipDescription}>{item.description}</ThemedText>
              </View>
            )}
            contentContainerStyle={styles.tipsList}
          />
        )}
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
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  streakCard: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  streakText: {
    color: "white",
    fontSize: 16,
  },
  streakCount: {
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
  actionButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
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
}); 