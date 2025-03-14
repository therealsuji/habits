import { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  TextInput,
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
import { useObservable } from "@legendapp/state/react";
import { habitStore$ } from "@/store/habitStore";

export default function EditHabitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const habitId = id as string;
  const habit = useObservable(() => habitStore$.getHabit(habitId)).get();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Initialize form with habit data when it loads
  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description);
    }
  }, [habit]);

  const saveChanges = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Habit name cannot be empty");
      return;
    }

    habitStore$.updateHabit({
      id: habitId,
      name,
      description,
      streak: habit?.streak || 0,
      entries: habit?.entries || [],
    });

    router.back();
  };

  if (!habit) {
    return (
      <SafeAreaView style={containerStyles.container}>
        <ThemedView style={containerStyles.content}>
          <ThemedText>Loading habit...</ThemedText>
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

        <ThemedText style={globalStyles.headerTitle}>Edit Habit</ThemedText>

        <View style={styles.formContainer}>
          <ThemedText style={styles.label}>Habit Name</ThemedText>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter habit name"
            placeholderTextColor="#999"
          />

          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter habit description"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
            <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
