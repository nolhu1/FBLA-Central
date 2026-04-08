import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

export const AiErrorState = ({
  title,
  body,
  onRetry
}: {
  title: string;
  body: string;
  onRetry?: () => void;
}) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.body}>{body}</Text>
    {onRetry ? (
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Retry</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    gap: 8,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255,138,122,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,138,122,0.18)"
  },
  title: {
    ...theme.typography.title,
    fontSize: 16,
    color: palette.cream
  },
  body: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 18
  },
  button: {
    alignSelf: "flex-start",
    minHeight: 34,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: palette.gold,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    ...theme.typography.label,
    color: palette.ink
  }
});
