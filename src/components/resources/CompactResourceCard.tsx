import { Pressable, StyleSheet, Text, View } from "react-native";

import { ResourceRecord } from "@/domain/services/resources";
import { palette, theme } from "@/theme";

import { ResourceTypeBadge } from "./ResourceTypeBadge";
import { SavedResourceButton } from "./SavedResourceButton";

export const CompactResourceCard = ({
  record,
  onPress,
  onToggleSave
}: {
  record: ResourceRecord;
  onPress: () => void;
  onToggleSave: () => void;
}) => (
  <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]} onPress={onPress}>
    <View style={styles.topRow}>
      <View style={styles.left}>
        <ResourceTypeBadge label={record.typeLabel} />
        {record.isSaved ? <Text style={styles.savedText}>Saved</Text> : null}
      </View>
      <SavedResourceButton isSaved={record.isSaved} onPress={onToggleSave} />
    </View>
    <Text style={styles.title} numberOfLines={2}>{record.resource.title}</Text>
    <Text style={styles.summary} numberOfLines={2}>{record.resource.summary}</Text>
    <Text style={styles.meta} numberOfLines={1}>{record.categoryLabel} • {record.meta}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.045)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    flex: 1
  },
  savedText: {
    ...theme.typography.label,
    color: palette.gold
  },
  title: {
    ...theme.typography.title,
    fontSize: 17,
    color: palette.cream
  },
  summary: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 19
  },
  meta: {
    ...theme.typography.label,
    color: palette.slate
  },
  pressed: {
    opacity: 0.94
  }
});
