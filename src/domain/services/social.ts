import { Ionicons } from "@expo/vector-icons";

import { Organization, SocialChannel, SocialHighlight, User } from "@/domain/models/types";

export type SocialScope = "chapter" | "state" | "national";

export interface SocialChannelRecord {
  channel: SocialChannel;
  organization?: Organization;
  scope: SocialScope;
  scopeLabel: string;
  platformLabel: string;
  platformIcon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  description: string;
}

export interface SocialHighlightRecord {
  highlight: SocialHighlight;
  channel?: SocialChannel;
  organization?: Organization;
  scope: SocialScope;
  scopeLabel: string;
  platformLabel: string;
  platformIcon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
}

export interface SocialScopeBundle {
  scope: SocialScope;
  title: string;
  subtitle: string;
  channels: SocialChannelRecord[];
  highlights: SocialHighlightRecord[];
  spotlight?: SocialHighlightRecord | null;
}

const platformMeta: Record<
  SocialChannel["platform"],
  { label: string; icon: keyof typeof Ionicons.glyphMap; accentColor: string; descriptor: string }
> = {
  Instagram: {
    label: "Instagram",
    icon: "logo-instagram",
    accentColor: "#F56040",
    descriptor: "Fast visual updates"
  },
  TikTok: {
    label: "TikTok",
    icon: "musical-notes-outline",
    accentColor: "#24F4EE",
    descriptor: "Short-form member moments"
  },
  YouTube: {
    label: "YouTube",
    icon: "logo-youtube",
    accentColor: "#FF4D4D",
    descriptor: "Video recaps and promos"
  },
  X: {
    label: "X",
    icon: "chatbubble-ellipses-outline",
    accentColor: "#C7D2E3",
    descriptor: "Quick official updates"
  },
  Facebook: {
    label: "Facebook",
    icon: "logo-facebook",
    accentColor: "#5B8CFF",
    descriptor: "Community announcements"
  },
  Website: {
    label: "Website",
    icon: "globe-outline",
    accentColor: "#75B8FF",
    descriptor: "Official site and forms"
  }
};

const scopeTitles: Record<SocialScope, string> = {
  chapter: "My Chapter",
  state: "My State",
  national: "National"
};

const cleanHandle = (handle: string) => handle.replace(/^@/, "").trim();

const getScopeOrganization = (
  scope: SocialScope,
  organizations: Organization[],
  user?: User | null
) => {
  if (!user) return undefined;
  if (scope === "chapter") return organizations.find((item) => item.id === user.localChapterId);
  if (scope === "state") return organizations.find((item) => item.id === user.stateChapterId);
  return organizations.find((item) => item.type === "national");
};

const getScopeForOrganization = (
  organizationId: string,
  organizationsById: Record<string, Organization>,
  user?: User | null
): SocialScope => {
  const organization = organizationsById[organizationId];
  if (!organization) return "national";
  if (user?.localChapterId === organizationId || organization.type === "local_chapter") return "chapter";
  if (user?.stateChapterId === organizationId || organization.type === "state_chapter") return "state";
  return "national";
};

const buildChannelDescription = (channel: SocialChannel, organization?: Organization) => {
  const meta = platformMeta[channel.platform];
  const orgLabel = organization?.shortName ?? organization?.name ?? "Official FBLA";
  return `${orgLabel} • ${meta.descriptor}`;
};

export const buildSocialHubBundles = ({
  channels,
  highlights,
  organizations,
  user
}: {
  channels: SocialChannel[];
  highlights: SocialHighlight[];
  organizations: Organization[];
  user?: User | null;
}): SocialScopeBundle[] => {
  const organizationsById = Object.fromEntries(organizations.map((item) => [item.id, item]));
  const channelsById = Object.fromEntries(channels.map((item) => [item.id, item]));

  const channelRecords = channels
    .filter((channel) => channel.isActive)
    .map((channel) => {
      const organization = organizationsById[channel.organizationId];
      const scope = getScopeForOrganization(channel.organizationId, organizationsById, user);
      const meta = platformMeta[channel.platform];
      return {
        channel,
        organization,
        scope,
        scopeLabel: scopeTitles[scope],
        platformLabel: meta.label,
        platformIcon: meta.icon,
        accentColor: meta.accentColor,
        description: buildChannelDescription(channel, organization)
      } satisfies SocialChannelRecord;
    })
    .sort((left, right) => Number(right.channel.isPrimary) - Number(left.channel.isPrimary));

  const highlightRecords = [...highlights]
    .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime())
    .map((highlight) => {
      const channel = channelsById[highlight.socialChannelId];
      const organization = channel ? organizationsById[channel.organizationId] : undefined;
      const scope = channel ? getScopeForOrganization(channel.organizationId, organizationsById, user) : "national";
      const meta = channel ? platformMeta[channel.platform] : platformMeta.Website;
      return {
        highlight,
        channel,
        organization,
        scope,
        scopeLabel: scopeTitles[scope],
        platformLabel: meta.label,
        platformIcon: meta.icon,
        accentColor: meta.accentColor
      } satisfies SocialHighlightRecord;
    });

  return (["chapter", "state", "national"] as SocialScope[]).map((scope) => {
    const organization = getScopeOrganization(scope, organizations, user);
    const scopedChannels = channelRecords.filter((item) => item.scope === scope);
    const scopedHighlights = highlightRecords.filter((item) => item.scope === scope);
    return {
      scope,
      title: scopeTitles[scope],
      subtitle:
        scope === "chapter"
          ? organization?.shortName ?? "Your local chapter presence"
          : scope === "state"
            ? organization?.shortName ?? "State chapter channels"
            : organization?.shortName ?? "FBLA National channels",
      channels: scopedChannels,
      highlights: scopedHighlights,
      spotlight: scopedHighlights[0] ?? null
    };
  });
};

export const getNativeChannelUrl = (record: SocialChannelRecord) => {
  const handle = cleanHandle(record.channel.handle);

  switch (record.channel.platform) {
    case "Instagram":
      return `instagram://user?username=${handle}`;
    case "TikTok":
      return `tiktok://user?screen_name=${handle}`;
    case "X":
      return `twitter://user?screen_name=${handle}`;
    case "Facebook":
      return `fb://facewebmodal/f?href=${encodeURIComponent(record.channel.profileUrl)}`;
    default:
      return null;
  }
};

export const getScopeEmptyCopy = (scope: SocialScope) => {
  if (scope === "chapter") {
    return {
      title: "No chapter channels yet",
      body: "Your local chapter has not connected social accounts here yet. State and national channels are still ready to browse."
    };
  }

  if (scope === "state") {
    return {
      title: "State presence is still growing",
      body: "Check national channels for the broadest official updates while state accounts come online."
    };
  }

  return {
    title: "No national channels available",
    body: "Official national links will appear here when they are connected."
  };
};
