import { StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

export const globalStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export const formStyles = StyleSheet.create({
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
});

export const buttonStyles = StyleSheet.create({
  // createButton: {
  //   backgroundColor: "#4CAF50",
  //   paddingHorizontal: 16,
  //   paddingVertical: 8,
  //   borderRadius: 20,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelButtonText: {
    fontWeight: "500",
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  backButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  actionButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
});

export const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

// Typography constants
export const Typography = {
  fontSizes: {
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 24,
  },
  fontWeights: {
    normal: "normal",
    medium: "500",
    bold: "bold",
  },
};

// Spacing constants
export const Spacing = {
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

// Layout helpers
export const Layout = {
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
};
