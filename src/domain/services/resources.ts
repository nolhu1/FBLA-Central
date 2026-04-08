import { HomeBundle, ResourceItem, ResourceState, User } from "@/domain/models/types";

export type ResourceCategoryFilter =
  | "all"
  | "competitive events"
  | "conferences"
  | "leadership development"
  | "training materials"
  | "official documents"
  | "guides / templates";

export type ResourceTypeFilter = "all" | "pdf" | "guide" | "template" | "saved" | "official";

export interface ResourceRecord {
  resource: ResourceItem;
  state?: ResourceState;
  isSaved: boolean;
  isRecent: boolean;
  categoryKey: ResourceCategoryFilter;
  categoryLabel: string;
  typeLabel: string;
  meta: string;
}

const normalizeCategory = (category: string): ResourceCategoryFilter => {
  const value = category.toLowerCase();
  if (value.includes("competitive")) return "competitive events";
  if (value.includes("conference")) return "conferences";
  if (value.includes("leadership")) return "leadership development";
  if (value.includes("training")) return "training materials";
  if (value.includes("guide") || value.includes("template")) return "guides / templates";
  if (value.includes("official")) return "official documents";
  return "all";
};

const getTypeLabel = (resource: ResourceItem) => {
  if (resource.resourceType === "pdf") return "PDF";
  if (resource.resourceType === "guide") return "Guide";
  if (resource.resourceType === "template") return "Template";
  if (resource.resourceType === "checklist") return "Checklist";
  if (resource.resourceType === "article") return "Article";
  return resource.resourceType.replace("_", " ");
};

export const buildResourceRecords = (resources: ResourceItem[], resourceState: ResourceState[]): ResourceRecord[] => {
  const stateMap = new Map(resourceState.map((item) => [item.resourceId, item]));

  return resources
    .map((resource) => {
      const state = stateMap.get(resource.id);
      return {
        resource,
        state,
        isSaved: state?.isSaved ?? false,
        isRecent: Boolean(state?.lastOpenedAt),
        categoryKey: normalizeCategory(resource.category),
        categoryLabel: resource.category,
        typeLabel: getTypeLabel(resource),
        meta: `${resource.estimatedReadMinutes} min • ${resource.isOfficial ? "Official" : "Curated"}`
      };
    })
    .sort((left, right) => {
      const leftScore =
        (left.isSaved ? 4 : 0) +
        (left.resource.isOfficial ? 3 : 0) +
        new Date(left.resource.updatedAt).getTime() / 1_000_000_000;
      const rightScore =
        (right.isSaved ? 4 : 0) +
        (right.resource.isOfficial ? 3 : 0) +
        new Date(right.resource.updatedAt).getTime() / 1_000_000_000;
      return rightScore - leftScore;
    });
};

export const filterResourceRecords = (
  records: ResourceRecord[],
  query: string,
  category: ResourceCategoryFilter,
  type: ResourceTypeFilter
) => {
  const needle = query.trim().toLowerCase();

  return records.filter((record) => {
    const matchesQuery =
      !needle ||
      record.resource.title.toLowerCase().includes(needle) ||
      record.resource.summary.toLowerCase().includes(needle) ||
      record.resource.tags.some((tag) => tag.toLowerCase().includes(needle));
    const matchesCategory = category === "all" ? true : record.categoryKey === category;
    const matchesType =
      type === "all"
        ? true
        : type === "saved"
          ? record.isSaved
          : type === "official"
            ? record.resource.isOfficial
            : record.resource.resourceType === type;

    return matchesQuery && matchesCategory && matchesType;
  });
};

export const pickFeaturedResource = (
  records: ResourceRecord[],
  home: HomeBundle | undefined,
  user: User | null
) => {
  const recommendedId = home?.recommendedResources[0]?.id;
  const byRecommendation = records.find((item) => item.resource.id === recommendedId);
  if (byRecommendation) return byRecommendation;

  const byInterest = records.find((item) =>
    item.resource.tags.some((tag) =>
      [...(user?.generalInterests ?? []), ...(user?.competitionInterests ?? [])].some((interest) =>
        tag.toLowerCase().includes(interest.split(" ")[0].toLowerCase())
      )
    )
  );

  return byInterest ?? records[0] ?? null;
};

export const getResourceCategories = (records: ResourceRecord[]) => {
  const ordered: ResourceCategoryFilter[] = [
    "all",
    "competitive events",
    "conferences",
    "leadership development",
    "training materials",
    "guides / templates",
    "official documents"
  ];

  return ordered.filter(
    (category) => category === "all" || records.some((item) => item.categoryKey === category)
  );
};

export const getResourceEmptyCopy = (query: string) =>
  query.trim()
    ? {
        title: "No resources match this search",
        body: "Try a broader keyword or clear a filter to reopen the library."
      }
    : {
        title: "Nothing in this view yet",
        body: "Switch categories or filters to explore more official resources and prep materials."
      };
