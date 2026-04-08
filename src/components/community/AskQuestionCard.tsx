import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

export const AskQuestionCard = ({ onPress }: { onPress: () => void }) => (
  <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]} onPress={onPress}>
    <View style={styles.iconWrap}>
      <Ionicons name="help-buoy-outline" size={18} color={palette.ink} />
    </View>
    <View style={styles.copy}>
      <Text style={styles.title}>Ask a question</Text>
      <Text style={styles.body}>Start a focused thread for study help, competition strategy, or event logistics.</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: palette.gold
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(8,17,30,0.12)"
  },
  copy: {
    flex: 1,
    gap: 4
  },
  title: {
    ...theme.typography.title,
    fontSize: 16,
    color: palette.ink
  },
  body: {
    ...theme.typography.body,
    color: palette.ink,
    lineHeight: 17
  },
  pressed: {
    opacity: 0.96
  }
});
