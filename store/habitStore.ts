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
}
interface HabitStore {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "streak">) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  getHabit: (id: string) => Habit | undefined;
}

export const habitStore$: Observable<HabitStore> = observable<HabitStore>({
  habits: [],
  addHabit: (habit) => {
    const id = uuid.v4() as string; // Generate unique ID
    const newHabit = {
      ...habit,
      id,
      streak: 0, // Initialize streak to 0
    };

    habitStore$.habits.push(newHabit);
  },
  updateHabit: (habit: Habit) => {
    const index = habitStore$.habits.get().findIndex((h) => h.id === habit.id);
    //TODO: CHECK IF THIS WORKS 
    habitStore$.habits.get()[index] = habit;
  },
  deleteHabit: (id: string) => {
    habitStore$.set((state) => {
      state.habits = state.habits.filter((habit) => habit.id !== id);
      return state;
    });
  },
  getHabit: (id) => {
    return habitStore$.habits.get().find((habit) => habit.id === id);
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
