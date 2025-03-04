import React from "react";
import { SafeAreaView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const Settings = () => {
  return (
    <SafeAreaView>
      <ThemedView>
        <ThemedText>Settings</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
};

export default Settings;
