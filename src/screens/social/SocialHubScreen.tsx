import { useEffect, useMemo, useState } from "react";
import { LayoutAnimation, Linking, Platform, ScrollView, Share, StyleSheet, UIManager, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { WebView } from "react-native-webview";

import { AppScreen } from "@/components/common/AppScreen";
import { EmptySocialState } from "@/components/social/EmptySocialState";
import { FeaturedSocialCard } from "@/components/social/FeaturedSocialCard";
import { OpenExternalActionSheet } from "@/components/social/OpenExternalActionSheet";
import { ScopeSwitcher } from "@/components/social/ScopeSwitcher";
import { SocialChannelCard } from "@/components/social/SocialChannelCard";
import { SocialHighlightCard } from "@/components/social/SocialHighlightCard";
import { SocialHubHeader } from "@/components/social/SocialHubHeader";
import { SocialSectionHeader } from "@/components/social/SocialSectionHeader";
import {
  SocialChannelRecord,
  SocialScope,
  buildSocialHubBundles,
  getNativeChannelUrl,
  getScopeEmptyCopy
} from "@/domain/services/social";
import { useAppSelector } from "@/store/hooks";
import { useGetOrganizationsQuery, useGetSocialHubQuery } from "@/store/services/fblaApi";
import { palette, theme } from "@/theme";

export const SocialHubScreen = ({ navigation }: any) => {
  const user = useAppSelector((state) => state.session.user);
  const { data: socialHub } = useGetSocialHubQuery();
  const { data: organizations = [] } = useGetOrganizationsQuery();

  const bundles = useMemo(
    () =>
      buildSocialHubBundles({
        channels: socialHub?.channels ?? [],
        highlights: socialHub?.highlights ?? [],
        organizations,
        user
      }),
    [organizations, socialHub?.channels, socialHub?.highlights, user]
  );

  const [activeScope, setActiveScope] = useState<SocialScope>("chapter");
  const [selectedChannel, setSelectedChannel] = useState<SocialChannelRecord | null>(null);
  const [expandedHighlightUrl, setExpandedHighlightUrl] = useState<string | null>("https://www.instagram.com/gawhsfbla/");

  const animateSpotlightTransition = () => {
    LayoutAnimation.configureNext({
      duration: 320,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.82
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      }
    });
  };

  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    if (bundles.find((item) => item.scope === activeScope)?.channels.length) return;
    const fallback = bundles.find((item) => item.channels.length)?.scope ?? "national";
    setActiveScope(fallback);
  }, [activeScope, bundles]);

  useEffect(() => {
    setExpandedHighlightUrl(null);
  }, [activeScope]);

  const activeBundle = bundles.find((item) => item.scope === activeScope) ?? bundles[0];
  const emptyCopy = getScopeEmptyCopy(activeScope);
  const contextLine = `${bundles
    .map((item) => item.subtitle)
    .filter(Boolean)
    .slice(0, 3)
    .join(" • ")}`;

  const openChannel = async (record: SocialChannelRecord) => {
    const nativeUrl = getNativeChannelUrl(record);
    if (nativeUrl) {
      const supported = await Linking.canOpenURL(nativeUrl);
      if (supported) {
        await Linking.openURL(nativeUrl);
        return;
      }
    }

    await WebBrowser.openBrowserAsync(record.channel.profileUrl);
  };

  const openChannelInBrowser = async (record: SocialChannelRecord) => {
    await WebBrowser.openBrowserAsync(record.channel.profileUrl);
  };

  const shareUrl = async (title: string, url: string) => {
    await Share.share({
      title,
      message: `${title}\n${url}`,
      url
    });
  };

  const openHighlight = async (url: string) => {
    animateSpotlightTransition();
    setExpandedHighlightUrl((current) => (current === url ? null : url));
  };

  const openLinkedContext = () => {
    if (!activeBundle?.spotlight) return;
    if (activeBundle.spotlight.highlight.relatedEventId) {
      navigation.navigate("EventDetail", { eventId: activeBundle.spotlight.highlight.relatedEventId });
      return;
    }
    if (activeBundle.spotlight.highlight.relatedNewsPostId) {
      navigation.navigate("NewsDetail", { newsPostId: activeBundle.spotlight.highlight.relatedNewsPostId });
    }
  };

  return (
    <AppScreen title="" hideDefaultHeader scroll={false}>
      <View style={styles.screen}>
        <SocialHubHeader
          title="Social Hub"
          subtitle="Official FBLA channels, curated highlights, and the fastest path to your chapter, state, and national presence."
          context={contextLine}
        />

        <ScopeSwitcher value={activeScope} onChange={setActiveScope} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {activeBundle?.spotlight ? (
            <FeaturedSocialCard
              highlight={activeBundle.spotlight}
              expanded={expandedHighlightUrl === activeBundle.spotlight.highlight.externalPostUrl}
              previewUrl={expandedHighlightUrl ?? undefined}
              onPressPrimary={() => openHighlight(activeBundle.spotlight!.highlight.externalPostUrl)}
              onPressSecondary={
                activeBundle.spotlight.highlight.relatedEventId || activeBundle.spotlight.highlight.relatedNewsPostId
                  ? openLinkedContext
                  : undefined
              }
              onPressOpenExternal={
                expandedHighlightUrl === activeBundle.spotlight.highlight.externalPostUrl
                  ? () => WebBrowser.openBrowserAsync(expandedHighlightUrl)
                  : undefined
              }
              onPressCollapse={
                expandedHighlightUrl === activeBundle.spotlight.highlight.externalPostUrl
                  ? () => {
                      animateSpotlightTransition();
                      setExpandedHighlightUrl(null);
                    }
                  : undefined
              }
              expandedContent={
                expandedHighlightUrl === activeBundle.spotlight.highlight.externalPostUrl ? (
                  <WebView
                    source={{ uri: "https://www.instagram.com/p/DUo7aaBiSfw/?img_index=1" }}
                    style={styles.webview}
                    startInLoadingState
                    setSupportMultipleWindows={false}
                  />
                ) : null
              }
            />
          ) : (
            <View style={styles.spotlightFallback}>
              <SocialSectionHeader title="Stay connected" caption="Follow the official accounts that matter most to your FBLA season." />
            </View>
          )}

          <View style={styles.section}>
            <SocialSectionHeader
              title="Official channels"
              caption={`${activeBundle?.title ?? "Selected scope"} channels`}
            />
            {activeBundle?.channels.length ? (
              <View style={styles.channelGrid}>
                {activeBundle.channels.map((record) => (
                  <SocialChannelCard
                    key={record.channel.id}
                    record={record}
                    onOpen={() => openChannel(record)}
                    onShare={() => shareUrl(record.channel.displayName, record.channel.profileUrl)}
                    onMore={() => setSelectedChannel(record)}
                  />
                ))}
              </View>
            ) : (
              <EmptySocialState title={emptyCopy.title} body={emptyCopy.body} />
            )}
          </View>

          <View style={styles.section}>
            <SocialSectionHeader
              title="Recent highlights"
              caption="A small pulse of official activity, not a full feed."
            />
            {activeBundle?.highlights.length ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.highlightRail}
              >
                {activeBundle.highlights.slice(0, 4).map((record) => (
                  <SocialHighlightCard
                    key={record.highlight.id}
                    record={record}
                    onPress={() => openHighlight(record.highlight.externalPostUrl)}
                  />
                ))}
              </ScrollView>
            ) : (
              <EmptySocialState
                title="No highlights yet"
                body="Official spotlights will appear here when this scope posts recent featured content."
              />
            )}
          </View>

          <View style={styles.footerCard}>
            <SocialSectionHeader
              title="Open gracefully"
              caption="FBLA Central will try the native app first where supported, then fall back to an in-app browser."
            />
          </View>
        </ScrollView>

        <OpenExternalActionSheet
          visible={Boolean(selectedChannel)}
          title={selectedChannel?.channel.displayName ?? ""}
          subtitle="You’re opening an official FBLA destination outside the core app experience."
          onOpenInApp={
            selectedChannel
              ? async () => {
                  await openChannel(selectedChannel);
                  setSelectedChannel(null);
                }
              : undefined
          }
          onOpenInBrowser={
            selectedChannel
              ? async () => {
                  await openChannelInBrowser(selectedChannel);
                  setSelectedChannel(null);
                }
              : async () => undefined
          }
          onShare={
            selectedChannel
              ? async () => {
                  await shareUrl(selectedChannel.channel.displayName, selectedChannel.channel.profileUrl);
                  setSelectedChannel(null);
                }
              : async () => undefined
          }
          onClose={() => setSelectedChannel(null)}
        />
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
  content: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl
  },
  spotlightFallback: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    backgroundColor: "rgba(117,184,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(117,184,255,0.18)"
  },
  webview: {
    flex: 1,
    minHeight: 420
  },
  section: {
    gap: theme.spacing.sm
  },
  channelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  },
  highlightRail: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.lg
  },
  footerCard: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border
  }
});
