import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

export const ThreadStatsRow = ({
  replies,
  helpful,
  recency,
  linkedLabel
}: {
  replies: number;
  helpful: number;
  recency: string;
  linkedLabel?: string;
}) => (
  <View style={styles.row}>
    <View style={styles.stat}>
      <Ionicons name="chatbubble-ellipses-outline" size={14} color={palette.sky} />
      <Text style={styles.label}>{replies}</Text>
    </View>
    <View style={styles.stat}>
      <Ionicons name="sparkles-outline" size={14} color={palette.gold} />
      <Text style={styles.label}>{helpful}</Text>
    </View>
    {linkedLabel ? (
      <View style={styles.stat}>
        <Ionicons name="link-outline" size={14} color={palette.teal} />
        <Text style={styles.label}>{linkedLabel}</Text>
      </View>
    ) : null}
    <Text style={styles.time}>{recency}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    columnGap: 10,
    rowGap: 4
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  label: {
    ...theme.typography.label,
    color: palette.mist
  },
  time: {
    ...theme.typography.label,
    color: palette.slate,
    marginLeft: "auto"
  }
});
