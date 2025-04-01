import { Observable, observable } from "@legendapp/state";
import { observablePersistSqlite } from "@legendapp/state/persist-plugins/expo-sqlite";
import { configureSynced, syncObservable } from "@legendapp/state/sync";
import Storage from "expo-sqlite/kv-store";
import uuid from "react-native-uuid"; // Importing uuid for unique ID generation
import { isSameDay } from "date-fns";
import {
  cancelAllNotifications,
  cancelNotification,
  scheduleNotification,
} from "../hooks/useNotifications";

export interface Habit {
  id: string;
  name: string;
  streak: number;
  description: string;
  entries: HabitEntry[];
  repetition: Repetition;
}

export type Repetition =
  | { type: "daily"; time: string }
  | {
      type: "weekly";
      days: Array<"M" | "T" | "W" | "Th" | "F" | "Sa" | "Su">;
      time: string;
    }
  | { type: "interval"; interval: number; time: string };

interface HabitEntry {
  id: string;
  habitId: string;
  date: Date;
  completed: boolean;
  note?: string;
}

interface HabitStore {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "streak" | "entries">) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  getHabit: (id: string) => Observable<Habit> | undefined;
  addHabitEntry: (habitEntry: Omit<HabitEntry, "id">) => void;
  getEntryForDate: (
    habitId: string,
    date: Date
  ) => Observable<HabitEntry> | undefined;
  clearAllData: () => void;
}

export const habitStore$: Observable<HabitStore> = observable<HabitStore>({
  habits: [],
  addHabitEntry: (habitEntry) => {
    const id = uuid.v4() as string; // Generate unique ID
    const newHabitEntry = {
      ...habitEntry,
      id,
    };
    const isEntryForDate = habitStore$.getEntryForDate(
      habitEntry.habitId,
      habitEntry.date
    );
    if (!isEntryForDate) {
      const habit = habitStore$.getHabit(habitEntry.habitId);
      if (habit) {
        habit.entries.push(newHabitEntry);
        habit.streak.set(habit.streak.get() + 1);
      }
    }
  },
  addHabit: (habit) => {
    const id = uuid.v4() as string; // Generate unique ID

    // Set default repetition if not provided
    const defaultRepetition = {
      type: "daily",
    };

    const newHabit = {
      ...habit,
      id,
      streak: 0, // Initialize streak to 0
      entries: [],
      repetition: habit.repetition || defaultRepetition,
    };

    habitStore$.habits.push(newHabit);

    // Schedule notification for the new habit
    scheduleNotification(newHabit);
  },
  updateHabit: (habit: Habit) => {
    const index = habitStore$.habits.get().findIndex((h) => h.id === habit.id);
    habitStore$.habits[index].set(habit);

    // Update notification for the habit
    scheduleNotification(habit);
  },
  deleteHabit: (id: string) => {
    const index = habitStore$.habits
      .get()
      .findIndex((habit) => habit.id === id);
    const habit = habitStore$.habits[index].get();
    habitStore$.habits[index].delete();
    // Cancel notification for deleted habit
    cancelNotification(habit);
  },
  getHabit: (id) => {
    return habitStore$.habits.find((habit) => habit.id.get() === id);
  },
  getEntryForDate: (habitId: string, date: Date) => {
    const habit = habitStore$.getHabit(habitId);
    if (habit) {
      return habit.entries.find((entry) => isSameDay(entry.date.get(), date));
    }
    return undefined;
  },
  clearAllData: () => {
    habitStore$.habits.set([]);
    cancelAllNotifications();
  },
});

const persistOptions = configureSynced({
  persist: {
    plugin: observablePersistSqlite(Storage),
  },
});

syncObservable(
  habitStore$,
  persistOptions({
    persist: {
      name: "store",
    },
  })
);
