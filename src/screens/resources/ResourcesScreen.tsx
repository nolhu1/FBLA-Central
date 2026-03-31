import { StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { useGetResourcesQuery, useToggleResourceSaveMutation } from "@/store/services/fblaApi";
import { palette, theme } from "@/theme";

export const ResourcesScreen = () => {
  const { data = [] } = useGetResourcesQuery();
  const [toggleResourceSave] = useToggleResourceSaveMutation();

  return (
    <AppScreen
      title="Resources"
      eyebrow="Official documents, guides, forms, and references"
      subtitle="Search, bookmark, and keep the right material close to the event, study, or question that triggered it."
    >
      <View style={styles.column}>
        {data.map((resource) => (
          <GlassCard
            key={resource.id}
            title={resource.title}
            subtitle={resource.summary}
            footer={<Text style={styles.meta}>{resource.category} • {resource.estimatedReadMinutes} min</Text>}
            onPress={() => toggleResourceSave(resource.id)}
          >
            <Text style={styles.tags}>{resource.tags.join(" • ")}</Text>
          </GlassCard>
        ))}
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  column: {
    gap: theme.spacing.md
  },
  meta: {
    ...theme.typography.label,
    color: palette.gold
  },
  tags: {
    ...theme.typography.label,
    color: palette.sky
  }
});
