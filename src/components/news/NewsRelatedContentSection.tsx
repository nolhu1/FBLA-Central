import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ListItemCard } from "@/components/cards/ListItemCard";
import { palette, theme } from "@/theme";

interface NewsRelatedContentSectionProps {
  eventCard?: ReactNode;
  resourceCard?: ReactNode;
  threadCard?: ReactNode;
}

export const NewsRelatedContentSection = ({
  eventCard,
  resourceCard,
  threadCard
}: NewsRelatedContentSectionProps) => {
  const hasContent = Boolean(eventCard || resourceCard || threadCard);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Related actions</Text>
      {hasContent ? (
        <View style={styles.cards}>
          {eventCard}
          {resourceCard}
          {threadCard}
        </View>
      ) : (
        <ListItemCard
          title="No linked actions for this update"
          summary="Official announcements can still be saved and shared, even when there is no direct linked event or resource."
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.sm
  },
  title: {
    ...theme.typography.title,
    color: palette.cream
  },
  cards: {
    gap: theme.spacing.sm
  }
});
