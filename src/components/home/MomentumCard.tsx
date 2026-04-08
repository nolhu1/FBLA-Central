import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

interface MomentumCardProps {
  title: string;
  body: string;
  actionLabel: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

export const MomentumCard = ({
  title,
  body,
  actionLabel,
  style,
  onPress
}: MomentumCardProps) => (
  <Pressable style={[styles.card, style]} onPress={onPress}>
    <View style={styles.copy}>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.body} numberOfLines={2}>
        {body}
      </Text>
      <Text style={styles.action} numberOfLines={1}>
        {actionLabel}
      </Text>
    </View>
    <View style={styles.trailing}>
      <View style={styles.iconWrap}>
        <Ionicons name="trending-up-outline" size={18} color={palette.ink} />
      </View>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: 12,
    minHeight: 98,
    padding: 14,
    borderRadius: 20,
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
    minWidth: 0,
    justifyContent: "space-between",
    gap: 6
  },
  trailing: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 28
  },
  title: {
    ...theme.typography.title,
    fontSize: 16,
    color: palette.ink
  },
  body: {
    ...theme.typography.body,
    fontSize: 14,
    color: palette.ink,
    lineHeight: 18
  },
  action: {
    ...theme.typography.label,
    color: palette.navy
  }
});
