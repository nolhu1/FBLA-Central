import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { TextField } from "@/components/forms/TextField";
import { palette, theme } from "@/theme";

export const ReplyComposer = ({
  value,
  onChangeText,
  onSubmit,
  isLoading,
  disabled,
  placeholder,
  buttonLabel,
  statusContent
}: {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder: string;
  buttonLabel?: string;
  statusContent?: ReactNode;
}) => (
  <View style={styles.card}>
    <Text style={styles.title}>Reply</Text>
    <TextField
      label="Your reply"
      value={value}
      onChangeText={onChangeText}
      editable={!disabled && !isLoading}
      multiline
      placeholder={placeholder}
    />
    <Pressable style={[styles.button, (disabled || isLoading) && styles.disabled]} onPress={onSubmit} disabled={disabled || isLoading}>
      <Text style={styles.buttonText}>{buttonLabel ?? (isLoading ? "Posting..." : "Post reply")}</Text>
    </Pressable>
    {statusContent ? <View style={styles.statusArea}>{statusContent}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: theme.spacing.sm
  },
  title: {
    ...theme.typography.title,
    color: palette.cream
  },
  button: {
    backgroundColor: palette.gold,
    minHeight: 42,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center"
  },
  buttonText: {
    ...theme.typography.label,
    color: palette.ink
  },
  statusArea: {
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center"
  },
  disabled: {
    opacity: 0.6
  }
});
