import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { ResourceRecord } from "@/domain/services/resources";
import { palette, theme } from "@/theme";

import { ResourceCategoryBadge } from "./ResourceCategoryBadge";
import { ResourceTypeBadge } from "./ResourceTypeBadge";
import { SavedResourceButton } from "./SavedResourceButton";

export const FeaturedResourceCard = ({
  record,
  onPress,
  onToggleSave
}: {
  record: ResourceRecord;
  onPress: () => void;
  onToggleSave: () => void;
}) => (
  <Pressable onPress={onPress}>
    <LinearGradient colors={["#173B63", "#102845", "#0A1627"]} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.badges}>
          <ResourceTypeBadge label={record.typeLabel} />
          <ResourceCategoryBadge label={record.categoryLabel} />
        </View>
        <SavedResourceButton isSaved={record.isSaved} onPress={onToggleSave} />
      </View>
      <Text style={styles.eyebrow}>Featured for you</Text>
      <Text style={styles.title} numberOfLines={2}>{record.resource.title}</Text>
      <Text style={styles.summary} numberOfLines={2}>{record.resource.summary}</Text>
      <Text style={styles.meta}>{record.meta}</Text>
    </LinearGradient>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: theme.spacing.md,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)"
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    flex: 1
  },
  eyebrow: {
    ...theme.typography.label,
    color: palette.gold
  },
  title: {
    ...theme.typography.title,
    fontSize: 19,
    color: palette.cream
  },
  summary: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 19
  },
  meta: {
    ...theme.typography.label,
    color: palette.sky
  }
});
