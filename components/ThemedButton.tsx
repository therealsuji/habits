import { TouchableOpacity, type TouchableOpacityProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  lightBackgroundColor,
  darkBackgroundColor,
  title,
  variant = 'primary',
  ...rest
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(
    { light: lightBackgroundColor, dark: darkBackgroundColor },
    variant === 'primary' ? 'tint' : 'background'
  );
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    variant === 'primary' ? 'background' : 'text'
  );

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'outline' && styles.outline,
        { backgroundColor },
        style,
      ]}
      {...rest}
    >
      <ThemedText
        style={[
          styles.text,
          { color: textColor },
        ]}
        type="defaultSemiBold"
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  text: {
    fontSize: 16,
  },
}); 