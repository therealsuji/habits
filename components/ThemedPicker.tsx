import { Picker, type PickerProps } from '@react-native-picker/picker';
import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedPickerProps = PickerProps & {
  lightColor?: string;
  darkColor?: string;
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
};

export const ThemedPicker = Object.assign(
  function ThemedPicker({
    style,
    lightColor,
    darkColor,
    lightBackgroundColor,
    darkBackgroundColor,
    ...rest
  }: ThemedPickerProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const backgroundColor = useThemeColor(
      { light: lightBackgroundColor, dark: darkBackgroundColor },
      'background'
    );

    return (
      <Picker
        style={[
          styles.picker,
          { color, backgroundColor },
          style,
        ]}
        {...rest}
      />
    );
  },
  {
    Item: Picker.Item,
  }
);

const styles = StyleSheet.create({
  picker: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
}); 