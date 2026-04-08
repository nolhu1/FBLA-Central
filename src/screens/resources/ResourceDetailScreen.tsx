import { Share, StyleSheet, Text, View, Pressable } from "react-native";
import * as WebBrowser from "expo-web-browser";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { ListItemCard } from "@/components/cards/ListItemCard";
import { RelatedResourcesSection } from "@/components/resources/RelatedResourcesSection";
import { ResourceDetailHeader } from "@/components/resources/ResourceDetailHeader";
import { buildResourceRecords } from "@/domain/services/resources";
import {
  useGetEventsQuery,
  useGetNewsQuery,
  useGetResourceStateQuery,
  useGetResourcesQuery,
  useGetStudyTracksQuery,
  useToggleResourceSaveMutation
} from "@/store/services/fblaApi";
import { formatDateTime } from "@/utils/time";
import { palette, theme } from "@/theme";

export const ResourceDetailScreen = ({ route, navigation }: any) => {
  const { resourceId } = route.params;
  const { data: resources = [] } = useGetResourcesQuery();
  const { data: resourceState = [] } = useGetResourceStateQuery();
  const { data: events = [] } = useGetEventsQuery();
  const { data: news = [] } = useGetNewsQuery();
  const { data: studyTracks = [] } = useGetStudyTracksQuery();
  const [toggleResourceSave] = useToggleResourceSaveMutation();

  const records = buildResourceRecords(resources, resourceState);
  const record = records.find((item) => item.resource.id === resourceId);
  if (!record) return null;

  const resource = record.resource;
  const linkedNews = news.filter((item) => item.relatedResourceId === resource.id).slice(0, 2);
  const linkedStudy = studyTracks.filter((item) => item.relatedResourceIds.includes(resource.id)).slice(0, 2);
  const linkedEvents = events
    .filter((item) => resource.tags.some((tag) => item.title.toLowerCase().includes(tag.split(" ")[0])))
    .slice(0, 2);
  const relatedResources = records
    .filter((item) => item.resource.id !== resource.id)
    .filter(
      (item) =>
        item.resource.category === resource.category ||
        item.resource.tags.some((tag) => resource.tags.includes(tag))
    )
    .slice(0, 2);
  const opensInPdfViewer =
    resource.resourceType === "pdf" ||
    resource.contentFormat === "document" ||
    Boolean(resource.storagePath) ||
    resource.contentFormat === "url";

  const openResource = async () => {
    if (opensInPdfViewer) {
      navigation.navigate("PdfViewer", { resourceId: resource.id });
      return;
    }
    if (resource.url) {
      await WebBrowser.openBrowserAsync(resource.url);
    }
  };

  return (
    <AppScreen title="Resource" eyebrow="Library detail" subtitle={record.categoryLabel}>
      <GlassCard>
        <ResourceDetailHeader
          record={record}
          onToggleSave={() => void toggleResourceSave(resource.id)}
          onShare={() =>
            void Share.share({
              title: resource.title,
              message: `${resource.title}\n${resource.sourceUrl ?? resource.url ?? ""}`
            })
          }
        />
      </GlassCard>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => void openResource()}>
          <Text style={styles.primaryLabel}>
            {opensInPdfViewer ? "Open PDF" : resource.url ? "Open resource" : "Saved in library"}
          </Text>
        </Pressable>
        {resource.sourceUrl ? (
          <Pressable style={styles.secondaryButton} onPress={() => void WebBrowser.openBrowserAsync(resource.sourceUrl!)}>
            <Text style={styles.secondaryLabel}>Source</Text>
          </Pressable>
        ) : null}
      </View>

      <GlassCard title="Overview" subtitle={resource.summary}>
        <Text style={styles.meta}>Source: {resource.sourceName}</Text>
        <Text style={styles.meta}>Updated {formatDateTime(resource.updatedAt)}</Text>
        <Text style={styles.tags}>{resource.tags.join(" • ")}</Text>
      </GlassCard>

      <RelatedResourcesSection title="Related resources">
        {relatedResources.length ? (
          relatedResources.map((item) => (
            <ListItemCard
              key={item.resource.id}
              eyebrow={item.typeLabel}
              title={item.resource.title}
              summary={item.resource.summary}
              meta={item.meta}
              onPress={() => navigation.push("ResourceDetail", { resourceId: item.resource.id })}
            />
          ))
        ) : (
          <ListItemCard title="No related resources yet" summary="As the library grows, similar guides and templates will appear here." />
        )}
      </RelatedResourcesSection>

      {linkedStudy.length ? (
        <RelatedResourcesSection title="Use in study">
          {linkedStudy.map((track) => (
            <ListItemCard
              key={track.id}
              eyebrow={track.difficultyLevel}
              title={track.title}
              summary={track.description}
              meta={`${track.estimatedTotalMinutes} min`}
              onPress={() => navigation.navigate("StudyTrackDetail", { studyTrackId: track.id })}
            />
          ))}
        </RelatedResourcesSection>
      ) : null}

      {linkedNews.length ? (
        <RelatedResourcesSection title="Related updates">
          {linkedNews.map((item) => (
            <ListItemCard
              key={item.id}
              eyebrow={item.priorityLevel}
              title={item.title}
              summary={item.summary}
              meta={formatDateTime(item.publishedAt)}
              onPress={() => navigation.navigate("NewsDetail", { newsPostId: item.id })}
            />
          ))}
        </RelatedResourcesSection>
      ) : null}

      {linkedEvents.length ? (
        <RelatedResourcesSection title="Useful for">
          {linkedEvents.map((event) => (
            <ListItemCard
              key={event.id}
              eyebrow={event.scopeType}
              title={event.title}
              summary={event.locationName}
              meta={formatDateTime(event.startTime)}
              onPress={() => navigation.navigate("EventDetail", { eventId: event.id })}
            />
          ))}
        </RelatedResourcesSection>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  primaryButton: {
    flexGrow: 1,
    minWidth: 180,
    backgroundColor: palette.gold,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryLabel: {
    ...theme.typography.label,
    color: palette.ink
  },
  secondaryButton: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.05)"
  },
  secondaryLabel: {
    ...theme.typography.label,
    color: palette.cream
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
