import { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function CreateHabitScreen() {
  const router = useRouter();
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");

  const [frequency, setFrequency] = useState("daily");
  const frequencyOptions = ["daily", "weekly", "monthly"];

  const handleCreate = () => {
    // Here you would save the new habit to your storage
    console.log("Creating habit:", { habitName, habitDescription, frequency });

    // Navigate back to home screen
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ThemedText>← Back</ThemedText>
          </TouchableOpacity>
         </View>
        <ScrollView>
          <ThemedText style={styles.title}>Create New Habit</ThemedText>

          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Habit Name</ThemedText>
            <TextInput
              style={styles.input}
              value={habitName}
              onChangeText={setHabitName}
              placeholder="e.g., Morning Meditation"
            />
          </View>

          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Description</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={habitDescription}
              onChangeText={setHabitDescription}
              placeholder="Describe your habit and its goals"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Frequency</ThemedText>
            <View style={styles.optionsContainer}>
              {frequencyOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    frequency === option && styles.selectedOption,
                  ]}
                  onPress={() => setFrequency(option)}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      frequency === option && styles.selectedOptionText,
                    ]}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.createButton,
                !habitName.trim() && styles.disabledButton,
              ]}
              onPress={handleCreate}
              disabled={!habitName.trim()}
            >
              <ThemedText style={styles.createButtonText}>
                Create Habit
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  option: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 4,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: "#4CAF50",
  },
  optionText: {
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontWeight: "500",
  },
  createButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  createButtonText: {
    color: "white",
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
});
