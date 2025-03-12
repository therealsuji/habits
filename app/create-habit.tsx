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
import {
  containerStyles,
  buttonStyles,
  globalStyles,
  formStyles,
} from "@/styles/globalStyles";
import { habitStore$ } from "@/store/habitStore";
export default function CreateHabitScreen() {
  const router = useRouter();

  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");

  const [frequency, setFrequency] = useState("daily");
  const frequencyOptions = ["daily", "weekly", "monthly"];

  const handleCreate = () => {
    habitStore$.addHabit({
      name: habitName,
      description: habitDescription,
    });

     router.back();
  };

  return (
    <SafeAreaView style={containerStyles.container}>
      <ThemedView style={containerStyles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={buttonStyles.backButton}
          >
            <ThemedText>← Back</ThemedText>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <ThemedText style={globalStyles.headerTitle}>
            Create New Habit
          </ThemedText>

          <View style={formStyles.formGroup}>
            <ThemedText style={formStyles.label}>Habit Name</ThemedText>
            <TextInput
              style={formStyles.input}
              value={habitName}
              onChangeText={setHabitName}
              placeholder="e.g., Morning Meditation"
            />
          </View>

          <View style={formStyles.formGroup}>
            <ThemedText style={formStyles.label}>Description</ThemedText>
            <TextInput
              style={[formStyles.input, formStyles.textArea]}
              value={habitDescription}
              onChangeText={setHabitDescription}
              placeholder="Describe your habit and its goals"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={formStyles.formGroup}>
            <ThemedText style={formStyles.label}>Frequency</ThemedText>
            <View style={formStyles.optionsContainer}>
              {frequencyOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    formStyles.option,
                    frequency === option && formStyles.selectedOption,
                  ]}
                  onPress={() => setFrequency(option)}
                >
                  <ThemedText
                    style={[
                      formStyles.optionText,
                      frequency === option && formStyles.selectedOptionText,
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
              style={buttonStyles.cancelButton}
              onPress={() => router.back()}
            >
              <ThemedText style={buttonStyles.cancelButtonText}>
                Cancel
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                buttonStyles.createButton,
                !habitName.trim() && buttonStyles.disabledButton,
              ]}
              onPress={handleCreate}
              disabled={!habitName.trim()}
            >
              <ThemedText style={buttonStyles.createButtonText}>
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
});
