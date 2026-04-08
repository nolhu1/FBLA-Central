import { StyleSheet, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HeroPriorityCard } from "@/components/home/HeroPriorityCard";
import { HomePreviewCard } from "@/components/home/HomePreviewCard";
import { MomentumCard } from "@/components/home/MomentumCard";
import { QuickActionButton } from "@/components/home/QuickActionButton";
import { useAppSelector } from "@/store/hooks";
import {
  useGetForumThreadsQuery,
  useGetHomeBundleQuery,
  useGetOrganizationsQuery,
  useGetSocialHubQuery
} from "@/store/services/fblaApi";
import {
  buildHomeContextLine,
  buildHomeHero,
  buildMomentumMessage
} from "@/domain/services/home";

export const HomeScreen = ({ navigation }: any) => {
  const user = useAppSelector((state) => state.session.user);
  const { data: bundle } = useGetHomeBundleQuery();
  const { data: organizations = [] } = useGetOrganizationsQuery();
  const { data: threads = [] } = useGetForumThreadsQuery();
  const { data: socialHub } = useGetSocialHubQuery();

  const hero = buildHomeHero(bundle);
  const contextLine = buildHomeContextLine({ user, organizations, bundle });
  const socialHighlight = (bundle?.socialHighlights ?? socialHub?.highlights ?? [])[0];
  const activeThread = (bundle?.communityActivity ?? threads)[0];
  const secondOpinion = activeThread
    ? {
        title: "Need a second opinion?",
        body: `"${activeThread.title}" is active right now.`,
        actionLabel: "Open discussion",
        route: { name: "ThreadDetail", params: { threadId: activeThread.id } }
      }
    : buildMomentumMessage({
        hero,
        studyFocus: bundle?.studyFocus ?? null,
        resources: bundle?.recommendedResources ?? [],
        threads: bundle?.communityActivity ?? [],
        highlights: bundle?.socialHighlights ?? socialHub?.highlights ?? []
      });
  const socialMeta = socialHighlight
    ? `${socialHighlight.summary ? "Latest highlight" : "Fresh from the community"}`
    : undefined;
  const momentumBody = activeThread
    ? `"${activeThread.title}" is active now.${activeThread.replyCount > 0 ? ` ${activeThread.replyCount} repl${activeThread.replyCount === 1 ? "y" : "ies"}.` : ""}`
    : secondOpinion.body;

  const openRoute = (route?: { name: string; params?: Record<string, string | undefined> }) => {
    if (!route) return;
    navigation.navigate(route.name, route.params);
  };

  return (
    <AppScreen
      title=""
      scroll={false}
      includeTopSafeArea={false}
      showBackButton={false}
      hideDefaultHeader
    >
      <View style={styles.screen}>
        <HomeHeader
          greeting={`Hi${user?.firstName ? `, ${user.firstName}` : ""}`}
          contextLine={contextLine}
          onPressProfile={() => navigation.navigate("Profile")}
          onPressNotifications={() => navigation.navigate("News")}
          onPressAI={() => navigation.navigate("AI")}
        />

        <HeroPriorityCard
          hero={hero}
          style={styles.heroCard}
          onPressPrimary={() => openRoute(hero.primaryRoute)}
          onPressSecondary={hero.secondaryRoute ? () => openRoute(hero.secondaryRoute) : undefined}
        />

        <View style={styles.quickGrid}>
          <View style={styles.quickItem}>
            <QuickActionButton icon="calendar-outline" label="Schedule" onPress={() => navigation.navigate("Events")} />
          </View>
          <View style={styles.quickItem}>
            <QuickActionButton icon="newspaper-outline" label="News" onPress={() => navigation.navigate("News")} />
          </View>
          <View style={styles.quickItem}>
            <QuickActionButton icon="document-text-outline" label="Resources" onPress={() => navigation.navigate("Resources")} />
          </View>
          <View style={styles.quickItem}>
            <QuickActionButton icon="sparkles-outline" label="Ask AI" onPress={() => navigation.navigate("AI")} />
          </View>
        </View>

        <View style={styles.bottomRow}>
          {socialHighlight ? (
            <View style={[styles.bottomCard, styles.socialCardWrap]}>
              <HomePreviewCard
                eyebrow="FBLA Social"
                title={socialHighlight.title}
                summary={socialHighlight.summary}
                meta={socialMeta ?? "Open Social Hub"}
                compact
                style={styles.fillCard}
                onPress={() => navigation.navigate("SocialHub")}
              />
            </View>
          ) : null}
          <View style={[styles.bottomCard, styles.momentumCardWrap]}>
            <MomentumCard
              title={secondOpinion.title}
              body={momentumBody}
              actionLabel={secondOpinion.actionLabel}
              style={styles.fillCard}
              onPress={() => openRoute(secondOpinion.route)}
            />
          </View>
        </View>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 10,
    paddingBottom: 4
  },
  heroCard: {
    minHeight: 166
  },
  quickGrid: {
    flexDirection: "row",
    gap: 8
  },
  quickItem: {
    flex: 1
  },
  bottomRow: {
    flex: 1,
    minHeight: 0,
    flexDirection: "column",
    gap: 10
  },
  bottomCard: {
    flex: 1,
    minHeight: 0,
    width: "100%"
  },
  socialCardWrap: {
    flex: 0.82
  },
  momentumCardWrap: {
    flex: 1
  },
  fillCard: {
    flex: 1,
    minHeight: 0
  }
});
