import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ResourceRecord } from "@/domain/services/resources";
import { palette, theme } from "@/theme";

import { ResourceCategoryBadge } from "./ResourceCategoryBadge";
import { ResourceTypeBadge } from "./ResourceTypeBadge";
import { SavedResourceButton } from "./SavedResourceButton";

export const ResourceDetailHeader = ({
  record,
  onToggleSave,
  onShare
}: {
  record: ResourceRecord;
  onToggleSave: () => void;
  onShare: () => void;
}) => (
  <View style={styles.wrapper}>
    <View style={styles.topRow}>
      <View style={styles.badges}>
        <ResourceTypeBadge label={record.typeLabel} />
        <ResourceCategoryBadge label={record.categoryLabel} />
      </View>
      <View style={styles.actions}>
        <SavedResourceButton isSaved={record.isSaved} onPress={onToggleSave} />
        <Pressable style={styles.iconButton} onPress={onShare}>
          <Ionicons name="share-social-outline" size={17} color={palette.cream} />
        </Pressable>
      </View>
    </View>
    <Text style={styles.title}>{record.resource.title}</Text>
    <Text style={styles.summary}>{record.resource.summary}</Text>
    <Text style={styles.meta}>{record.meta}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: { gap: 8 },
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
  actions: {
    flexDirection: "row",
    gap: 8
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border
  },
  title: {
    ...theme.typography.display,
    fontSize: 25,
    color: palette.cream
  },
  summary: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 21
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold
  }
});
