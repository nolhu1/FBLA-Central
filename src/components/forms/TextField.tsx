import { StyleSheet, Text, TextInput, View } from "react-native";

import { palette, theme } from "@/theme";

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  error?: string;
}

export const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  multiline,
  error
}: TextFieldProps) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={palette.slate}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      style={[styles.input, multiline && styles.multiline, error && styles.errorInput]}
    />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: 8
  },
  label: {
    ...theme.typography.label,
    color: palette.mist
  },
  input: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: palette.cream,
    backgroundColor: "rgba(255,255,255,0.05)"
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: "top"
  },
  errorInput: {
    borderColor: palette.danger
  },
  error: {
    ...theme.typography.label,
    color: palette.danger
  }
});
