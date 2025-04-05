import { TextInput, type TextInputProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { cn } from "@/lib/utils";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
  className?: string;
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  lightBackgroundColor,
  darkBackgroundColor,
  className,
  ...rest
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const backgroundColor = useThemeColor(
    { light: lightBackgroundColor, dark: darkBackgroundColor },
    "background"
  );

  return (
    <TextInput
      className={cn(
        "rounded-lg px-4 py-3 text-base border border-gray-200 dark:border-gray-700 focus focus:border-primary focus:ring-1 focus:ring-primary",
        className
      )}
      style={[
        {
          color,
          backgroundColor,
          textAlignVertical: "center",
          paddingVertical: 12,
          paddingHorizontal: 16,
        },
        style,
      ]}
      placeholderTextColor={useThemeColor({}, "icon")}
      {...rest}
    />
  );
}
