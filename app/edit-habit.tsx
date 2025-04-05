import { useEffect, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedPicker } from "@/components/ThemedPicker";
import { ThemedButton } from "@/components/ThemedButton";
import { useObservable } from "@legendapp/state/react";
import { habitStore$, Repetition } from "@/store/habitStore";

export default function EditHabitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const habitId = id as string;
  const habit = useObservable(() => habitStore$.getHabit(habitId)).get();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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

  const formatTimeFor12Hour = (time24: string | undefined) => {
    if (!time24) return "";

    const [hours24, minutes] = time24.split(":");
    const hours = parseInt(hours24);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;

    return `${hours12}:${minutes} ${period}`;
  };

  // Create date object from time string
  const getTimePickerDate = () => {
    if (!time) return new Date();

    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
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
      <SafeAreaView className="flex-1">
        <ThemedView className="flex-1 px-4">
          <ThemedText>Loading habit...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1 px-4">
        <View className="flex-row justify-between items-center mb-5">
          <ThemedButton
            title="← Back"
            variant="outline"
            onPress={() => router.back()}
          />
        </View>

        <ThemedText className="text-2xl font-bold mb-6">Edit Habit</ThemedText>

        <ScrollView className="flex-1">
          <View className="w-full mt-4">
            <ThemedText className="text-base font-medium mb-2">
              Habit Name
            </ThemedText>
            <ThemedTextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter habit name"
            />
          </View>

          <View className="mb-5">
            <ThemedText className="text-base font-medium mb-2">
              Description
            </ThemedText>
            <ThemedTextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter habit description"
              multiline
              textAlignVertical="top"
              numberOfLines={2}
            />
          </View>

          <View className="mb-5">
            <ThemedText className="text-base font-medium mb-2">
              Repetition Type
            </ThemedText>
            <ThemedPicker
              selectedValue={repetitionType}
              onValueChange={(itemValue) =>
                setRepetitionType(itemValue as "daily" | "weekly" | "interval")
              }
            >
              <ThemedPicker.Item label="Daily" value="daily" />
              <ThemedPicker.Item label="Weekly" value="weekly" />
              <ThemedPicker.Item label="Custom Interval" value="interval" />
            </ThemedPicker>
          </View>

          {repetitionType === "weekly" && (
            <View className="mb-5">
              <ThemedText className="text-base font-medium mb-2">
                Select Days
              </ThemedText>
              <View className="flex-row flex-wrap">
                {days.map((day) => (
                  <Pressable
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
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {repetitionType === "interval" && (
            <View className="mb-5">
              <ThemedText className="text-base font-medium mb-2">
                Repeat every X days
              </ThemedText>
              <ThemedTextInput
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
                <ThemedButton
                  title={time ? formatTimeFor12Hour(time) : "Select time"}
                  variant="outline"
                  onPress={() => setShowTimePicker(true)}
                  style={{ flex: 1 }}
                />

                {time && (
                  <Pressable
                    onPress={() => setTime(undefined)}
                    className="ml-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
                  >
                    <MaterialIcons name="close" size={20} color="#666" />
                  </Pressable>
                )}
              </View>
            ) : (
              <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                <View className="flex-row justify-end items-center mb-2">
                  <Pressable
                    onPress={() => setShowTimePicker(false)}
                    className="p-1"
                  >
                    <MaterialIcons name="close" size={30} color="#666" />
                  </Pressable>
                </View>

                <DateTimePicker
                  value={getTimePickerDate()}
                  mode="time"
                  is24Hour={false}
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
            <ThemedButton
              title="Cancel"
              variant="outline"
              onPress={() => router.back()}
            />

            <ThemedButton
              title="Save Changes"
              onPress={handleUpdate}
              disabled={!name.trim() || !time}
              style={!name.trim() || !time ? { opacity: 0.5 } : undefined}
            />
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
