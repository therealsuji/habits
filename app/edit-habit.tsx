import { useEffect, useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from '@expo/vector-icons';

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useObservable } from "@legendapp/state/react";
import { habitStore$, Repetition } from "@/store/habitStore";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function EditHabitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const habitId = id as string;
  const habit = useObservable(() => habitStore$.getHabit(habitId)).get();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Add state for repetition settings
  const [repetitionType, setRepetitionType] = useState<
    "daily" | "weekly" | "interval"
  >("daily");
  const [selectedDays, setSelectedDays] = useState<
    Array<"M" | "T" | "W" | "Th" | "F" | "Sa" | "Su">
  >([]);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [interval, setInterval] = useState<number>(1);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const days: Array<"M" | "T" | "W" | "Th" | "F" | "Sa" | "Su"> = [
    "M", "T", "W", "Th", "F", "Sa", "Su",
  ];

  // Initialize form with habit data when it loads
  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description);

      // Set repetition settings based on the habit's current repetition
      const repetition = habit.repetition;
      setRepetitionType(repetition.type);
      
      if (repetition.type === "weekly" && "days" in repetition) {
        setSelectedDays(repetition.days);
      }
      
      if (repetition.type === "interval" && "interval" in repetition) {
        setInterval(repetition.interval);
      }
      
      if (repetition.time) {
        setTime(repetition.time);
      }
    }
  }, [habit]);

  const toggleDay = (day: "M" | "T" | "W" | "Th" | "F" | "Sa" | "Su") => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, "0");
      const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    }
  };

  const handleUpdate = () => {
    if (!id) return;
    if (!time) return;
    
    // Create the repetition object based on type
    let repetition: Repetition;
    
    if (repetitionType === "weekly") {
      repetition = {
        type: "weekly",
        days: selectedDays,
        time: time,
      };
    } else if (repetitionType === "interval") {
      repetition = {
        type: "interval",
        interval,
        time: time,
      };
    } else {
      repetition = {
        type: "daily",
        time: time,
      };
    }
    
    const habit = habitStore$.getHabit(id)?.get();
    if (habit) {
      habitStore$.updateHabit({
        ...habit,
        name,
        description,
        repetition,
      });
      router.back();
    }
  };

  if (!habit) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <ThemedView className="flex-1 px-4">
          <ThemedText>Loading habit...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ThemedView className="flex-1 px-4">
        <View className="flex-row justify-between items-center mb-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="py-2"
          >
            <ThemedText>← Back</ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedText className="text-2xl font-bold mb-6">Edit Habit</ThemedText>

        <ScrollView className="flex-1">
          <View className="w-full mt-4">
            <ThemedText className="text-base font-medium mb-2">Habit Name</ThemedText>
            <TextInput
              className="bg-gray-100 dark:bg-gray-800 rounded-lg py-3 px-4 text-base mb-5 border border-gray-200 dark:border-gray-700"
              value={name}
              onChangeText={setName}
              placeholder="Enter habit name"
              placeholderTextColor="#999"
            />

            <ThemedText className="text-base font-medium mb-2">Description</ThemedText>
            <TextInput
              className="bg-gray-100 dark:bg-gray-800 rounded-lg py-3 px-4 text-base mb-5 border border-gray-200 dark:border-gray-700 min-h-[120px]"
              value={description}
              onChangeText={setDescription}
              placeholder="Enter habit description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />

            <View className="mb-5">
              <ThemedText className="text-base font-medium mb-2">Repetition Type</ThemedText>
              <Picker
                selectedValue={repetitionType}
                onValueChange={(itemValue: "daily" | "weekly" | "interval") =>
                  setRepetitionType(itemValue)
                }
                className="bg-gray-100 dark:bg-gray-800 rounded-lg"
              >
                <Picker.Item label="Daily" value="daily" />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Custom Interval" value="interval" />
              </Picker>
            </View>

            {repetitionType === "weekly" && (
              <View className="mb-5">
                <ThemedText className="text-base font-medium mb-2">Select Days</ThemedText>
                <View className="flex-row flex-wrap">
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      className={`p-3 m-1 rounded-md ${
                        selectedDays.includes(day) 
                          ? "bg-blue-500" 
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                      onPress={() => toggleDay(day)}
                    >
                      <ThemedText 
                        className={selectedDays.includes(day) ? "text-white" : ""}
                      >
                        {day}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {repetitionType === "interval" && (
              <View className="mb-5">
                <ThemedText className="text-base font-medium mb-2">
                  Repeat every X days
                </ThemedText>
                <TextInput
                  className="bg-gray-100 dark:bg-gray-800 rounded-lg py-3 px-4 text-base mb-2 border border-gray-200 dark:border-gray-700"
                  value={interval.toString()}
                  onChangeText={(text) => setInterval(parseInt(text) || 1)}
                  keyboardType="number-pad"
                />
              </View>
            )}

            <View className="mb-5">
              <ThemedText className="text-base font-medium mb-2">
                Reminder Time <ThemedText className="text-red-500">*</ThemedText>
              </ThemedText>
              
              {!showTimePicker ? (
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="bg-gray-100 dark:bg-gray-800 rounded-lg py-3 px-4 border border-gray-200 dark:border-gray-700 flex-1"
                    onPress={() => setShowTimePicker(true)}
                  >
                    <ThemedText>{time || "Select time"}</ThemedText>
                  </TouchableOpacity>
                  
                  {time && (
                    <TouchableOpacity 
                      onPress={() => setTime(undefined)}
                      className="ml-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
                    >
                      <MaterialIcons name="close" size={20} color="#666" />
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                  <View className="flex-row justify-end items-center mb-2">
                    <TouchableOpacity 
                      onPress={() => setShowTimePicker(false)}
                      className="p-1"
                    >
                      <MaterialIcons name="close" size={30} color="#666" />
                    </TouchableOpacity>
                  </View>
                  
                  <DateTimePicker
                    value={time ? new Date(`2000-01-01T${time}`) : new Date()}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={handleTimeChange}
                    style={{ height: 120 }}
                  />
                </View>
              )}
              {!time && (
                <ThemedText className="text-red-500 text-sm mt-1">
                  Time is required
                </ThemedText>
              )}
            </View>

            <View className="flex-row justify-between items-center mt-6 mb-10">
              <TouchableOpacity
                className="px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-md"
                onPress={() => router.back()}
              >
                <ThemedText>
                  Cancel
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                className={`px-5 py-3 rounded-md ${
                  !name.trim() || !time ? "bg-gray-400" : "bg-green-500"
                }`}
                onPress={handleUpdate}
                disabled={!name.trim() || !time}
              >
                <ThemedText lightColor="white" darkColor="white">
                  Save Changes
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
