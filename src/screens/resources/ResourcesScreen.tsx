import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { CategoryScroller } from "@/components/resources/CategoryScroller";
import { CompactResourceCard } from "@/components/resources/CompactResourceCard";
import { EmptyResourcesState } from "@/components/resources/EmptyResourcesState";
import { FeaturedResourceCard } from "@/components/resources/FeaturedResourceCard";
import { ResourceFilterChips } from "@/components/resources/ResourceFilterChips";
import { ResourceSearchBar } from "@/components/resources/ResourceSearchBar";
import { ResourcesHeader } from "@/components/resources/ResourcesHeader";
import { ResourceSkeletonLoader } from "@/components/resources/ResourceSkeletonLoader";
import {
  ResourceCategoryFilter,
  ResourceTypeFilter,
  buildResourceRecords,
  filterResourceRecords,
  getResourceCategories,
  getResourceEmptyCopy,
  pickFeaturedResource
} from "@/domain/services/resources";
import { useAppSelector } from "@/store/hooks";
import {
  useGetHomeBundleQuery,
  useGetResourceStateQuery,
  useGetResourcesQuery,
  useToggleResourceSaveMutation
} from "@/store/services/fblaApi";
import { DEMO_MODE } from "@/constants/config";
import { theme } from "@/theme";

export const ResourcesScreen = ({ navigation }: any) => {
  const user = useAppSelector((state) => state.session.user);
  const { data: resources = [], isLoading, isFetching, refetch } = useGetResourcesQuery();
  const { data: resourceState = [] } = useGetResourceStateQuery();
  const { data: home } = useGetHomeBundleQuery();
  const [toggleResourceSave] = useToggleResourceSaveMutation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ResourceCategoryFilter>("all");
  const [typeFilter, setTypeFilter] = useState<ResourceTypeFilter>("all");
  const [saveOverrides, setSaveOverrides] = useState<Record<string, boolean>>({});

  const records = useMemo(() => {
    const baseRecords = buildResourceRecords(resources, resourceState);

    return baseRecords.map((record) =>
      Object.prototype.hasOwnProperty.call(saveOverrides, record.resource.id)
        ? { ...record, isSaved: saveOverrides[record.resource.id] }
        : record
    );
  }, [resourceState, resources, saveOverrides]);
  const categories = useMemo(() => getResourceCategories(records), [records]);
  const featured = useMemo(() => pickFeaturedResource(records, home, user), [records, home, user]);
  const filtered = useMemo(
    () => filterResourceRecords(records, query, category, typeFilter),
    [records, query, category, typeFilter]
  );
  const emptyCopy = getResourceEmptyCopy(query);

  const openResource = (resourceId: string) => {
    navigation.navigate("ResourceDetail", { resourceId });
  };

  const toggleSave = async (resourceId: string, currentIsSaved: boolean) => {
    const nextIsSaved = !currentIsSaved;
    setSaveOverrides((current) => ({ ...current, [resourceId]: nextIsSaved }));

    try {
      await toggleResourceSave(resourceId).unwrap();
    } catch {
      if (!DEMO_MODE) {
        setSaveOverrides((current) => ({ ...current, [resourceId]: currentIsSaved }));
      }
    }
  };

  return (
    <AppScreen title="Resources" scroll={false} hideDefaultHeader>
      {isLoading ? (
        <ResourceSkeletonLoader />
      ) : (
        <View style={styles.screen}>
          <View style={styles.top}>
            <ResourcesHeader
              savedCount={records.filter((item) => item.isSaved).length}
              onPressSaved={() => setTypeFilter((current) => (current === "saved" ? "all" : "saved"))}
            />
            <ResourceSearchBar value={query} onChangeText={setQuery} onClear={() => setQuery("")} />
            <CategoryScroller categories={categories} value={category} onChange={setCategory} />
            <ResourceFilterChips value={typeFilter} onChange={setTypeFilter} />
          </View>

          <ScrollView
            style={styles.feed}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.feedContent}
            refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
          >
            {featured ? (
              <FeaturedResourceCard
                record={featured}
                onPress={() => openResource(featured.resource.id)}
                onToggleSave={() => void toggleSave(featured.resource.id, featured.isSaved)}
              />
            ) : null}

            {filtered.length ? (
              <View style={styles.list}>
                {filtered.map((record) => (
                  <CompactResourceCard
                    key={record.resource.id}
                    record={record}
                    onPress={() => openResource(record.resource.id)}
                    onToggleSave={() => void toggleSave(record.resource.id, record.isSaved)}
                  />
                ))}
              </View>
            ) : (
              <EmptyResourcesState title={emptyCopy.title} body={emptyCopy.body} />
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
    minHeight: 0,
    gap: theme.spacing.md
  },
  top: {
    gap: theme.spacing.sm
  },
  feed: {
    flex: 1,
    minHeight: 0
  },
  feedContent: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl
  },
  list: {
    gap: theme.spacing.sm
  }
});
