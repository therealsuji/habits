import { Observable, observable } from "@legendapp/state";
import { observablePersistSqlite } from "@legendapp/state/persist-plugins/expo-sqlite";
import { configureSynced, syncObservable } from "@legendapp/state/sync";
import Storage from "expo-sqlite/kv-store";
import uuid from "react-native-uuid"; // Importing uuid for unique ID generation

interface Habit {
  id: string;
  name: string;
  streak: number;
  description: string;
  entries: HabitEntry[];
}

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
}

export const habitStore$: Observable<HabitStore> = observable<HabitStore>({
  habits: [],
  addHabitEntry: (habitEntry) => {
    const id = uuid.v4() as string; // Generate unique ID
    const newHabitEntry = {
      ...habitEntry,
      id,

    };
    habitStore$.getHabit(habitEntry.habitId)?.entries.push(newHabitEntry);
  },
  addHabit: (habit) => {
    const id = uuid.v4() as string; // Generate unique ID
    const newHabit = {
      ...habit,
      id,
      streak: 0, // Initialize streak to 0
      entries: [],
    };

    habitStore$.habits.push(newHabit);
  },
  updateHabit: (habit: Habit) => {
    const index = habitStore$.habits.get().findIndex((h) => h.id === habit.id);
    habitStore$.habits[index].set(habit);
  },
  deleteHabit: (id: string) => {
    const index = habitStore$.habits.get().findIndex((habit) => habit.id === id);
    habitStore$.habits[index].delete();
  },
  getHabit: (id) => {
    return habitStore$.habits.find((habit) => habit.id.get() === id);
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
