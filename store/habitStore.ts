import { observable } from "@legendapp/state";
import { observablePersistSqlite } from "@legendapp/state/persist-plugins/expo-sqlite";
import { configureSynced, syncObservable } from "@legendapp/state/sync";
import Storage from "expo-sqlite/kv-store";
import uuid from "react-native-uuid"; // Importing uuid for unique ID generation

const persistOptions = configureSynced({
  persist: {
    plugin: observablePersistSqlite(Storage),
    transform: {
      load: (value) => {
         console.log("Loading Value", value)
        return value;
      },
      save: (value) => {
         
        return value;
      },
    },
  },
});

interface Habit {
  id: string;
  name: string;
  streak: number;
  description: string;
}
interface HabitStore {
  habits: Map<string, Habit>;
  addHabit: (habit: Omit<Habit, "id" | "streak">) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
}

export const habitStore$ = observable<HabitStore>({
  habits: new Map(),
  addHabit: (habit) => {
    const id = uuid.v4() as string; // Generate unique ID
    const newHabit = {
      ...habit,
      id,
      streak: 0, // Initialize streak to 0
    };

    habitStore$.set((state) => {
      console.log("setting habit", state.habits);
      state.habits.set(id, newHabit);
      return state;
    });
  },
  updateHabit: (habit: Habit) => {
    habitStore$.set((state) => {
      state.habits.set(habit.id, habit);
      return state;
    });
  },
  deleteHabit: (id: string) => {
    habitStore$.set((state) => {
      state.habits.delete(id);
      return state;
    });
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
