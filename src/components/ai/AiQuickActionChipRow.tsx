import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AIQuickAction } from "@/domain/services/ai";
import { palette, theme } from "@/theme";

export const AiQuickActionChipRow = ({
  actions,
  onPress
}: {
  actions: AIQuickAction[];
  onPress: (action: AIQuickAction) => void;
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.scroller}
    contentContainerStyle={styles.row}
  >
    {actions.map((action) => (
      <Pressable key={action.id} style={styles.chip} onPress={() => onPress(action)}>
        <Ionicons name={action.icon as never} size={14} color={palette.sky} />
        <Text style={styles.label}>{action.label}</Text>
      </Pressable>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  scroller: {
    flexGrow: 0,
    minHeight: 34,
    maxHeight: 38
  },
  row: {
    gap: 8,
    paddingRight: 2,
    alignItems: "center"
  },
  chip: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border
  },
  label: {
    ...theme.typography.label,
    color: palette.mist
  }
});
