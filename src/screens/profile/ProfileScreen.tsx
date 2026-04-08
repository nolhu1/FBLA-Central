import { ReactNode, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { ProfileHeaderCard } from "@/components/profile/ProfileHeaderCard";
import { ProfileMetricTileRow } from "@/components/profile/ProfileMetricTileRow";
import { APP_MODE_LABEL, DEMO_MODE } from "@/constants/config";
import {
  buildProfileIdentity,
  buildProfileMetrics,
  buildSavedQuickLinks
} from "@/domain/services/memberProfile";
import { getRepository } from "@/data/repositories";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useGetEventSavesQuery,
  useGetHomeBundleQuery,
  useGetNewsStateQuery,
  useGetOrganizationsQuery,
  useGetResourceStateQuery,
  useGetStudyProgressQuery
} from "@/store/services/fblaApi";
import { setUser } from "@/store/slices/sessionSlice";
import { palette, theme } from "@/theme";

type ProfilePane = "identity" | "activity" | "settings";

export const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.session.user);
  const { data: organizations = [] } = useGetOrganizationsQuery();
  const { data: home } = useGetHomeBundleQuery();
  const { data: eventSaves = [] } = useGetEventSavesQuery();
  const { data: resourceState = [] } = useGetResourceStateQuery();
  const { data: newsState = [] } = useGetNewsStateQuery();
  const { data: studyProgress = [] } = useGetStudyProgressQuery();
  const [activePane, setActivePane] = useState<ProfilePane>("identity");
  const paneOptions = useMemo(
    () => [
      { value: "identity" as const, label: "Identity" },
      { value: "activity" as const, label: "Activity" },
      { value: "settings" as const, label: "Settings" }
    ],
    []
  );

  if (!user) return null;

  const identity = buildProfileIdentity(user, organizations);
  const metrics = buildProfileMetrics({ home, eventSaves, resourceState, newsState, studyProgress });
  const quickLinks = buildSavedQuickLinks({ eventSaves, resourceState, newsState });
  const identityRows = [
    { label: "School", value: identity.schoolName },
    { label: "State", value: identity.stateChapterLabel },
    { label: "Chapter", value: identity.localChapterLabel },
    { label: "Class", value: identity.graduationLabel }
  ];
  const personalizationRows = [
    { label: "Goals", value: user.goals.slice(0, 2).join(" • ") || "Not set" },
    { label: "Focus", value: user.competitionInterests.slice(0, 2).join(" • ") || "Not set" }
  ];

  const renderPaneCard = (title: string, subtitle: string, children: ReactNode) => (
    <View style={styles.paneCard}>
      <View style={styles.paneCardHeader}>
        <Text style={styles.paneCardTitle}>{title}</Text>
        <Text style={styles.paneCardSubtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      {children}
    </View>
  );

  const renderPane = () => {
    if (activePane === "identity") {
      return renderPaneCard(
        `${APP_MODE_LABEL} member identity`,
        "Shapes the feed, study, and alerts you see first.",
        <>
          <View style={styles.identityStack}>
            {identityRows.map((item) => (
              <View key={item.label} style={styles.identityRow}>
                <Text style={styles.identityLabel}>{item.label}</Text>
                <Text style={styles.identityValue} numberOfLines={1}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.personalizationStack}>
            {personalizationRows.map((item) => (
              <View key={item.label} style={styles.personalizationRow}>
                <Text style={styles.personalizationLabel}>{item.label}</Text>
                <Text style={styles.personalizationText} numberOfLines={1}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </>
      );
    }

    if (activePane === "activity") {
      return renderPaneCard(
        "Quick access",
        "Jump back into the things you are actively tracking.",
        <>
          <View style={styles.linkGrid}>
            {quickLinks.map((link) => (
              <Pressable key={link.key} style={styles.linkCard} onPress={() => navigation.navigate(link.routeName)}>
                <Text style={styles.linkTitle}>{link.title}</Text>
                <Text style={styles.linkMeta} numberOfLines={1}>{link.subtitle}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.snapshotRow}>
            <View style={styles.snapshotTile}>
              <Text style={styles.snapshotLabel}>Study</Text>
              <Text style={styles.snapshotValue}>{home?.momentumSnapshot.studyProgress ?? 0}% ready</Text>
            </View>
            <View style={styles.snapshotTile}>
              <Text style={styles.snapshotLabel}>Discussions</Text>
              <Text style={styles.snapshotValue}>{home?.momentumSnapshot.discussionParticipation ?? 0} active</Text>
            </View>
          </View>
        </>
      );
    }

    return renderPaneCard(
      "Profile controls",
      "Keep your setup current without turning profile into a long settings page.",
      <>
        <Pressable style={styles.actionRow} onPress={() => navigation.navigate("EditProfile")}>
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>Edit profile</Text>
            <Text style={styles.actionMeta}>Update chapter identity, interests, and alert defaults.</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </Pressable>
        <Pressable style={styles.actionRow} onPress={() => navigation.navigate("Preferences")}>
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>Preferences overview</Text>
            <Text style={styles.actionMeta}>Review notifications, privacy, and accessibility settings.</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </Pressable>
      </>
    );
  };

  return (
    <AppScreen title="Profile" scroll={false} hideDefaultHeader includeTopSafeArea={false} showBackButton={false}>
      <View style={styles.screen}>
        <ProfileHeaderCard
          name={identity.displayName}
          roleLabel={identity.roleLabel}
          chapterLabel={identity.localChapterLabel}
          stateLabel={identity.stateChapterLabel}
          graduationLabel={identity.graduationLabel}
          onEdit={() => navigation.navigate("EditProfile")}
        />

        <ProfileMetricTileRow metrics={metrics} />

        <SegmentedControl value={activePane} options={paneOptions} onChange={setActivePane} compact />

        <View style={styles.pane}>
          {renderPane()}
        </View>

        <Pressable
          style={styles.signOut}
          onPress={async () => {
            await getRepository().signOut();
            dispatch(setUser(null));
          }}
        >
          <Text style={styles.signOutText}>{DEMO_MODE ? "Log out" : "Sign out"}</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
    gap: 7
  },
  pane: {
    flex: 1,
    minHeight: 0
  },
  paneCard: {
    flex: 1,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.card,
    gap: 5
  },
  paneCardHeader: {
    gap: 1
  },
  paneCardTitle: {
    ...theme.typography.title,
    fontSize: 17,
    color: palette.cream
  },
  paneCardSubtitle: {
    ...theme.typography.label,
    color: palette.mist
  },
  identityStack: {
    gap: 3
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
    paddingBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.08)"
  },
  identityLabel: {
    ...theme.typography.label,
    width: 48,
    color: palette.sky
  },
  identityValue: {
    ...theme.typography.body,
    color: palette.cream,
    fontSize: 13,
    flex: 1,
    minWidth: 0,
    textAlign: "right"
  },
  personalizationStack: {
    gap: 3
  },
  personalizationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
    paddingVertical: 3
  },
  personalizationLabel: {
    ...theme.typography.label,
    width: 48,
    color: palette.gold
  },
  personalizationText: {
    ...theme.typography.label,
    color: palette.mist,
    fontSize: 12,
    flex: 1,
    minWidth: 0,
    textAlign: "right"
  },
  linkGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  },
  linkCard: {
    flexBasis: "47%",
    flexGrow: 1,
    minHeight: 68,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 4
  },
  linkTitle: {
    ...theme.typography.label,
    fontSize: 13,
    color: palette.cream
  },
  linkMeta: {
    ...theme.typography.label,
    color: palette.mist
  },
  snapshotRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  },
  snapshotTile: {
    flexBasis: "47%",
    flexGrow: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 3
  },
  snapshotLabel: {
    ...theme.typography.label,
    color: palette.sky
  },
  snapshotValue: {
    ...theme.typography.label,
    color: palette.cream
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: palette.border
  },
  actionCopy: {
    flex: 1,
    gap: 2
  },
  actionTitle: {
    ...theme.typography.label,
    fontSize: 13,
    color: palette.cream
  },
  actionMeta: {
    ...theme.typography.label,
    color: palette.mist
  },
  actionArrow: {
    ...theme.typography.title,
    fontSize: 18,
    color: palette.sky
  },
  signOut: {
    minHeight: 32,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  signOutText: {
    ...theme.typography.label,
    color: palette.cream
  }
});
