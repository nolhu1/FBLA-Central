import { StyleSheet, Text, View } from "react-native";

import { AIQuickAction } from "@/domain/services/ai";
import { palette, theme } from "@/theme";

import { AiQuickActionChipRow } from "./AiQuickActionChipRow";

export const AiEmptyState = ({
  title,
  body,
  actions,
  onPressAction
}: {
  title: string;
  body: string;
  actions: AIQuickAction[];
  onPressAction: (action: AIQuickAction) => void;
}) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.body}>{body}</Text>
    <View style={styles.actions}>
      <Text style={styles.label}>Try one of these</Text>
      <AiQuickActionChipRow actions={actions} onPress={onPressAction} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    gap: 12,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: palette.border
  },
  title: {
    ...theme.typography.title,
    color: palette.cream
  },
  body: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 19
  },
  actions: {
    gap: 8
  },
  label: {
    ...theme.typography.label,
    color: palette.sky
  }
});
