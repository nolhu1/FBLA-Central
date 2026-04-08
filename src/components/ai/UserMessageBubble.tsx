import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

export const UserMessageBubble = ({ content }: { content: string }) => (
  <View style={styles.wrap}>
    <View style={styles.bubble}>
      <Text style={styles.label}>You</Text>
      <Text style={styles.body}>{content}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    alignItems: "flex-end"
  },
  bubble: {
    maxWidth: "82%",
    borderRadius: 18,
    borderBottomRightRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: palette.gold
  },
  label: {
    ...theme.typography.label,
    color: "rgba(8,17,30,0.62)",
    marginBottom: 4
  },
  body: {
    ...theme.typography.body,
    color: palette.ink,
    lineHeight: 20
  }
});
