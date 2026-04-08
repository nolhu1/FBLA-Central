import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { CommunityCategoryRecord } from "@/domain/services/community";
import { palette, theme } from "@/theme";

export const CategoryTile = ({
  record,
  label,
  icon,
  meta,
  style,
  onPress
}: {
  record?: CommunityCategoryRecord;
  label?: string;
  icon?: string;
  meta?: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}) => (
  <Pressable style={({ pressed }) => [styles.card, style, pressed ? styles.pressed : null]} onPress={onPress}>
    <View style={styles.iconWrap}>
      <Ionicons name={(icon ?? record?.icon ?? "chatbubble-ellipses-outline") as never} size={18} color={palette.ink} />
    </View>
    <Text style={styles.title} numberOfLines={2}>{label ?? record?.label ?? "Community"}</Text>
    <Text style={styles.meta}>{meta ?? `${record?.threadCount ?? 0} threads`}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    minHeight: 98,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 6
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.gold
  },
  title: {
    ...theme.typography.title,
    fontSize: 15,
    color: palette.cream
  },
  meta: {
    ...theme.typography.label,
    color: palette.mist
  },
  pressed: {
    opacity: 0.94
  }
});
