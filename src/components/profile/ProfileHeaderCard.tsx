import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

export const ProfileHeaderCard = ({
  name,
  roleLabel,
  chapterLabel,
  stateLabel,
  graduationLabel,
  onEdit
}: {
  name: string;
  roleLabel: string;
  chapterLabel: string;
  stateLabel: string;
  graduationLabel: string;
  onEdit: () => void;
}) => (
  <View style={styles.card}>
    <View style={styles.topRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarLabel}>{name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</Text>
      </View>
      <Pressable style={styles.editButton} onPress={onEdit}>
        <Ionicons name="create-outline" size={16} color={palette.cream} />
      </Pressable>
    </View>
    <Text style={styles.name}>{name}</Text>
    <View style={styles.badgeRow}>
      <View style={styles.badge}><Text style={styles.badgeLabel}>{roleLabel}</Text></View>
      <View style={styles.badge}><Text style={styles.badgeLabel}>{graduationLabel}</Text></View>
    </View>
    <Text style={styles.meta}>{chapterLabel}</Text>
    <Text style={styles.metaSecondary}>{stateLabel}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 3
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.gold
  },
  avatarLabel: {
    ...theme.typography.title,
    color: palette.ink
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border
  },
  name: {
    ...theme.typography.display,
    fontSize: 19,
    color: palette.cream
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  },
  badge: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
    backgroundColor: "rgba(117,184,255,0.12)"
  },
  badgeLabel: {
    ...theme.typography.label,
    color: palette.sky
  },
  meta: {
    ...theme.typography.title,
    fontSize: 15,
    color: palette.cream
  },
  metaSecondary: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 16
  }
});
