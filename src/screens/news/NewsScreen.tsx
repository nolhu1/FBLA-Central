import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import { DEMO_MODE } from "@/constants/config";
import { AppScreen } from "@/components/common/AppScreen";
import { CompactNewsCard } from "@/components/news/CompactNewsCard";
import { EmptyNewsState } from "@/components/news/EmptyNewsState";
import { NewsFilterChips } from "@/components/news/NewsFilterChips";
import { NewsHeader } from "@/components/news/NewsHeader";
import { NewsScopeSwitcher } from "@/components/news/NewsScopeSwitcher";
import { NewsSkeletonLoader } from "@/components/news/NewsSkeletonLoader";
import { PinnedAnnouncementCard } from "@/components/news/PinnedAnnouncementCard";
import {
  NewsScopeFilter,
  NewsTypeFilter,
  buildNewsFeedRecords,
  filterNewsRecords,
  getNewsEmptyCopy,
  getNewsScopeSubtitle
} from "@/domain/services/news";
import { useAppSelector } from "@/store/hooks";
import {
  useGetEventSavesQuery,
  useGetNewsQuery,
  useGetNewsStateQuery,
  useGetOrganizationsQuery,
  useUpdateNewsStateMutation
} from "@/store/services/fblaApi";
import { palette, theme } from "@/theme";

export const NewsScreen = ({ navigation }: any) => {
  const user = useAppSelector((state) => state.session.user);
  const { data: posts = [], isLoading, isFetching, refetch } = useGetNewsQuery();
  const { data: newsState = [] } = useGetNewsStateQuery();
  const { data: organizations = [] } = useGetOrganizationsQuery();
  const { data: eventSaves = [] } = useGetEventSavesQuery();
  const [updateNewsState] = useUpdateNewsStateMutation();
  const [saveOverrides, setSaveOverrides] = useState<Record<string, boolean>>({});

  const records = useMemo(() => {
    const baseRecords = buildNewsFeedRecords({
      posts,
      newsState,
      organizations,
      user,
      eventSaves
    });

    return baseRecords.map((record) =>
      Object.prototype.hasOwnProperty.call(saveOverrides, record.post.id)
        ? { ...record, isSaved: saveOverrides[record.post.id] }
        : record
    );
  }, [eventSaves, newsState, organizations, posts, saveOverrides, user]);

  const [scope, setScope] = useState<NewsScopeFilter>("chapter");
  const [typeFilter, setTypeFilter] = useState<NewsTypeFilter>("all");

  const filtered = useMemo(
    () => filterNewsRecords(records, scope, typeFilter, user),
    [records, scope, typeFilter, user]
  );

  const spotlight = filtered.find((item) => item.isPinned || item.isUrgent) ?? filtered[0] ?? null;
  const rest = filtered.filter((item) => item.post.id !== spotlight?.post.id);
  const unreadCount = records.filter((item) => item.isUnread).length;
  const emptyCopy = getNewsEmptyCopy(scope, typeFilter);

  const openDetail = async (newsPostId: string) => {
    await updateNewsState({ newsPostId, isRead: true });
    navigation.navigate("NewsDetail", { newsPostId });
  };

  const toggleSave = async (newsPostId: string, isSaved: boolean) => {
    const nextIsSaved = !isSaved;
    setSaveOverrides((current) => ({ ...current, [newsPostId]: nextIsSaved }));

    try {
      await updateNewsState({ newsPostId, isSaved: nextIsSaved }).unwrap();
    } catch {
      if (!DEMO_MODE) {
        setSaveOverrides((current) => ({ ...current, [newsPostId]: isSaved }));
      }
    }
  };

  return (
    <AppScreen title="News" scroll={false} hideDefaultHeader>
      <View style={styles.screen}>
        <NewsHeader
          title="News"
          subtitle={getNewsScopeSubtitle(user, scope)}
          savedOnly={typeFilter === "saved"}
          unreadCount={unreadCount}
          onToggleSaved={() => setTypeFilter((current) => (current === "saved" ? "all" : "saved"))}
        />

        <NewsScopeSwitcher value={scope} onChange={setScope} />
        <NewsFilterChips value={typeFilter} onChange={setTypeFilter} />

        {isLoading ? (
          <NewsSkeletonLoader />
        ) : (
          <ScrollView
            style={styles.feed}
            contentContainerStyle={styles.feedContent}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={palette.gold} />}
          >
            {spotlight ? (
              <PinnedAnnouncementCard
                record={spotlight}
                onPress={() => void openDetail(spotlight.post.id)}
                onToggleSave={() => void toggleSave(spotlight.post.id, spotlight.isSaved)}
              />
            ) : null}

            {filtered.length ? (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{spotlight?.isPinned || spotlight?.isUrgent ? "More updates" : "Latest updates"}</Text>
                  <Text style={styles.sectionMeta}>{filtered.length} shown</Text>
                </View>
                <View style={styles.cards}>
                  {rest.map((record) => (
                    <CompactNewsCard
                      key={record.post.id}
                      record={record}
                      onPress={() => void openDetail(record.post.id)}
                      onToggleSave={() => void toggleSave(record.post.id, record.isSaved)}
                    />
                  ))}
                  {!rest.length && spotlight ? (
                    <Text style={styles.singleItemHint}>This is the only update matching your current filters.</Text>
                  ) : null}
                </View>
              </View>
            ) : (
              <EmptyNewsState title={emptyCopy.title} body={emptyCopy.body} />
            )}
          </ScrollView>
        )}
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: theme.spacing.md,
    minHeight: 0,
    paddingBottom: 4
  },
  feed: {
    flex: 1,
    minHeight: 0
  },
  feedContent: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl
  },
  section: {
    gap: theme.spacing.sm
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  },
  sectionTitle: {
    ...theme.typography.title,
    color: palette.cream
  },
  sectionMeta: {
    ...theme.typography.label,
    color: palette.slate
  },
  cards: {
    gap: theme.spacing.sm
  },
  singleItemHint: {
    ...theme.typography.label,
    color: palette.slate,
    paddingHorizontal: 4
  }
});
