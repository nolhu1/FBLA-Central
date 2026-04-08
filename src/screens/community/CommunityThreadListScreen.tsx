import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { CompactThreadCard } from "@/components/community/CompactThreadCard";
import { CommunitySearchBar } from "@/components/community/CommunitySearchBar";
import { EmptyCommunityState } from "@/components/community/EmptyCommunityState";
import { ThreadSkeletonLoader } from "@/components/community/ThreadSkeletonLoader";
import {
  buildCommunityCategories,
  buildCommunityThreadRecords,
  filterCommunityThreads,
  getThreadEmptyCopy
} from "@/domain/services/community";
import { useAppSelector } from "@/store/hooks";
import { useGetForumCategoriesQuery, useGetForumThreadsQuery } from "@/store/services/fblaApi";
import { palette, theme } from "@/theme";

export const CommunityThreadListScreen = ({ route, navigation }: any) => {
  const { categoryId, title, initialQuery } = route.params ?? {};
  const user = useAppSelector((state) => state.session.user);
  const { data: categories = [], isLoading: categoriesLoading } = useGetForumCategoriesQuery();
  const { data: threads = [], isLoading: threadsLoading } = useGetForumThreadsQuery();
  const [query, setQuery] = useState(initialQuery ?? "");

  const categoryRecords = useMemo(() => buildCommunityCategories(categories, threads), [categories, threads]);
  const selectedCategory = categoryRecords.find((item) => item.category.id === categoryId);
  const records = useMemo(() => buildCommunityThreadRecords(threads, categories), [threads, categories]);
  const filtered = useMemo(() => filterCommunityThreads(records, query, categoryId), [records, query, categoryId]);
  const emptyCopy = getThreadEmptyCopy(query);

  return (
    <AppScreen
      title={title ?? selectedCategory?.label ?? "Threads"}
      eyebrow="Community"
      subtitle={selectedCategory ? `${selectedCategory.threadCount} conversations` : "Browse focused discussion threads"}
      scroll={false}
    >
      {categoriesLoading || threadsLoading ? (
        <ThreadSkeletonLoader />
      ) : (
        <View style={styles.screen}>
          <CommunitySearchBar value={query} onChangeText={setQuery} onClear={() => setQuery("")} />
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{filtered.length} results</Text>
            <Text style={styles.meta}>{user?.schoolName ?? "FBLA Central"}</Text>
          </View>
          <ScrollView style={styles.list} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {filtered.length ? (
              filtered.map((record) => (
                <CompactThreadCard
                  key={record.thread.id}
                  record={record}
                  onPress={() => navigation.navigate("ThreadDetail", { threadId: record.thread.id })}
                />
              ))
            ) : (
              <EmptyCommunityState title={emptyCopy.title} body={emptyCopy.body} />
            )}
          </ScrollView>
        </View>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: theme.spacing.sm
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10
  },
  meta: {
    ...theme.typography.label,
    color: palette.slate,
    flexShrink: 1
  },
  list: {
    flex: 1
  },
  content: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.xl
  }
});
