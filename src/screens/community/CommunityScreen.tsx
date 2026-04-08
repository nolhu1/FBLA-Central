import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { AskQuestionCard } from "@/components/community/AskQuestionCard";
import { CategoryPillScroller } from "@/components/community/CategoryPillScroller";
import { CategoryTile } from "@/components/community/CategoryTile";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { CommunitySearchBar } from "@/components/community/CommunitySearchBar";
import { CompactThreadCard } from "@/components/community/CompactThreadCard";
import { EmptyCommunityState } from "@/components/community/EmptyCommunityState";
import { FeaturedThreadCard } from "@/components/community/FeaturedThreadCard";
import { ThreadSkeletonLoader } from "@/components/community/ThreadSkeletonLoader";
import {
  buildCommunityCategories,
  buildCommunityThreadRecords,
  filterCommunityThreads,
  getFeaturedCommunityThreads,
  getRecommendedCommunityThreads,
  getThreadEmptyCopy
} from "@/domain/services/community";
import { useAppSelector } from "@/store/hooks";
import {
  useGetForumCategoriesQuery,
  useGetForumThreadsQuery,
  useGetResourcesQuery,
  useGetStudyTracksQuery
} from "@/store/services/fblaApi";
import { theme } from "@/theme";

export const CommunityScreen = ({ navigation }: any) => {
  const user = useAppSelector((state) => state.session.user);
  const { data: categories = [], isLoading: categoriesLoading } = useGetForumCategoriesQuery();
  const { data: threads = [], isLoading: threadsLoading } = useGetForumThreadsQuery();
  const { data: resources = [] } = useGetResourcesQuery();
  const { data: studyTracks = [] } = useGetStudyTracksQuery();
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const categoryRecords = useMemo(() => buildCommunityCategories(categories, threads), [categories, threads]);
  const records = useMemo(() => buildCommunityThreadRecords(threads, categories), [threads, categories]);
  const featured = useMemo(() => getFeaturedCommunityThreads(records), [records]);
  const recommended = useMemo(
    () => getRecommendedCommunityThreads(records, user, resources, studyTracks),
    [records, user, resources, studyTracks]
  );
  const quickCategoryTiles = useMemo(
    () => [
      ...categoryRecords.slice(0, 2),
      {
        label: "Browse all",
        icon: "apps-outline",
        meta: `${categoryRecords.length} topics`
      }
    ],
    [categoryRecords]
  );
  const filtered = useMemo(() => filterCommunityThreads(records, query, activeCategoryId), [records, query, activeCategoryId]);
  const emptyCopy = getThreadEmptyCopy(query);

  return (
    <AppScreen
      title="Community"
      scroll={false}
      includeTopSafeArea={false}
      showBackButton={false}
      hideDefaultHeader
    >
      {categoriesLoading || threadsLoading ? (
        <ThreadSkeletonLoader />
      ) : (
        <View style={styles.screen}>
          <CommunityHeader onPressCreate={() => navigation.navigate("CreateThread")} />
          <CommunitySearchBar value={query} onChangeText={setQuery} onClear={() => setQuery("")} />
          <AskQuestionCard onPress={() => navigation.navigate("CreateThread")} />
          <CategoryPillScroller
            categories={categoryRecords}
            activeCategoryId={activeCategoryId}
            onChange={(nextCategoryId) => setActiveCategoryId(nextCategoryId ?? null)}
          />

          <ScrollView style={styles.feed} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.categoryRail}>
              {quickCategoryTiles.slice(0, 3).map((item, index) => (
                <CategoryTile
                  key={"category" in item ? item.category.id : `quick-${index}`}
                  style={styles.categoryTile}
                  record={"category" in item ? item : undefined}
                  label={"category" in item ? undefined : item.label}
                  icon={"category" in item ? undefined : item.icon}
                  meta={"category" in item ? undefined : item.meta}
                  onPress={() =>
                    "category" in item
                      ? navigation.navigate("CommunityThreadList", { categoryId: item.category.id, title: item.label })
                      : navigation.navigate("CommunityThreadList", { title: "All discussions" })
                  }
                />
              ))}
            </View>

            {featured.length ? (
              <View style={styles.featuredRail}>
                {featured.map((record) => (
                  <FeaturedThreadCard
                    key={record.thread.id}
                    record={record}
                    onPress={() => navigation.navigate("ThreadDetail", { threadId: record.thread.id })}
                  />
                ))}
              </View>
            ) : null}

            <View style={styles.list}>
              {(recommended.length ? recommended : filtered.slice(0, 4)).map((record) => (
                <CompactThreadCard
                  key={record.thread.id}
                  record={record}
                  onPress={() => navigation.navigate("ThreadDetail", { threadId: record.thread.id })}
                />
              ))}
              {!filtered.length ? <EmptyCommunityState title={emptyCopy.title} body={emptyCopy.body} /> : null}
            </View>
          </ScrollView>
        </View>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
    gap: theme.spacing.sm
  },
  feed: {
    flex: 1,
    minHeight: 0
  },
  content: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.lg
  },
  categoryRail: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  categoryTile: {
    flex: 1
  },
  featuredRail: {
    gap: theme.spacing.sm
  },
  list: {
    gap: theme.spacing.sm
  }
});
